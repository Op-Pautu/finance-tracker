import { format, subMonths } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { monthStart, monthEnd, monthFromKey, monthKey } from "@/lib/date";
import type { TxWithCategory } from "@/lib/queries/dashboard";

export type MonthPoint = {
  key: string; // "2026-06"
  label: string; // "Jun"
  income: number;
  expense: number;
  net: number;
};

export type CategorySlice = {
  categoryId: string | null;
  name: string;
  color: string;
  icon: string;
  total: number;
  pct: number; // share of the month's expense
};

export type Delta = {
  current: number;
  previous: number;
  pct: number | null; // % change vs previous, null when previous is 0
};

export type Analytics = {
  months: MonthPoint[]; // 6 trailing months ending at the selected one
  current: MonthPoint;
  income: Delta;
  expense: Delta;
  net: Delta;
  byCategory: CategorySlice[]; // selected month expense breakdown
  avgExpense: number; // mean monthly expense across the window
  topCategory: CategorySlice | null;
};

function delta(current: number, previous: number): Delta {
  return {
    current,
    previous,
    pct: previous > 0 ? ((current - previous) / previous) * 100 : null,
  };
}

/** Six-month trends, month-over-month comparison and category breakdown. */
export async function getAnalytics(
  userId: string,
  month: string = monthKey(),
): Promise<Analytics> {
  const supabase = await createClient();
  const ref = monthFromKey(month);

  const from = monthStart(subMonths(ref, 5));
  const to = monthEnd(ref);

  const { data } = await supabase
    .from("transactions")
    .select("*, category:categories(id, name, color, icon)")
    .eq("user_id", userId)
    .gte("occurred_at", from)
    .lte("occurred_at", to);

  const txs = (data ?? []) as unknown as TxWithCategory[];

  // Build the 6 month buckets in order.
  const months: MonthPoint[] = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(ref, 5 - i);
    return {
      key: monthKey(d),
      label: format(d, "MMM"),
      income: 0,
      expense: 0,
      net: 0,
    };
  });
  const byKey = new Map(months.map((m) => [m.key, m]));

  const selectedKey = monthKey(ref);
  const categoryMap = new Map<string, CategorySlice>();

  for (const tx of txs) {
    const key = tx.occurred_at.slice(0, 7);
    const point = byKey.get(key);
    const amount = Number(tx.amount);
    if (point) {
      if (tx.kind === "income") point.income += amount;
      else point.expense += amount;
    }

    // category breakdown for the selected month only
    if (key === selectedKey && tx.kind === "expense") {
      const id = tx.category?.id ?? "uncategorized";
      const existing = categoryMap.get(id);
      if (existing) existing.total += amount;
      else
        categoryMap.set(id, {
          categoryId: tx.category?.id ?? null,
          name: tx.category?.name ?? "Uncategorized",
          color: tx.category?.color ?? "#9AA0A6",
          icon: tx.category?.icon ?? "tag",
          total: amount,
          pct: 0,
        });
    }
  }

  for (const m of months) m.net = m.income - m.expense;

  const current = byKey.get(selectedKey)!;
  const previous =
    months[months.length - 2] ??
    { income: 0, expense: 0, net: 0, key: "", label: "" };

  const expenseTotal = current.expense;
  const byCategory = [...categoryMap.values()]
    .map((c) => ({
      ...c,
      pct: expenseTotal > 0 ? (c.total / expenseTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const avgExpense =
    months.reduce((s, m) => s + m.expense, 0) / (months.length || 1);

  return {
    months,
    current,
    income: delta(current.income, previous.income),
    expense: delta(current.expense, previous.expense),
    net: delta(current.net, previous.net),
    byCategory,
    avgExpense,
    topCategory: byCategory[0] ?? null,
  };
}
