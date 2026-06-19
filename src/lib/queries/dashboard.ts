import { createClient } from "@/lib/supabase/server";
import { monthRange } from "@/lib/date";
import type { Category, Transaction } from "@/types/db";

export type TxWithCategory = Transaction & {
  category: Pick<Category, "id" | "name" | "color" | "icon"> | null;
};

export type CategorySpend = {
  categoryId: string | null;
  name: string;
  color: string;
  total: number;
};

export type DashboardData = {
  monthIncome: number;
  monthExpense: number;
  monthNet: number;
  balance: number; // all-time income − expense
  savingsRate: number; // 0–100
  byCategory: CategorySpend[];
  recent: TxWithCategory[];
  hasAnyTransactions: boolean;
};

/**
 * Loads everything the dashboard needs for the given month in a few queries.
 * RLS guarantees only the current user's rows come back.
 */
export async function getDashboardData(
  userId: string,
  ref: Date = new Date(),
): Promise<DashboardData> {
  const supabase = await createClient();
  const { from, to } = monthRange(ref);

  const [monthTx, allTx, recent, anyTx] = await Promise.all([
    // this month's transactions joined with category (for totals + breakdown)
    supabase
      .from("transactions")
      .select("id, amount, kind, category_id, category:categories(id, name, color, icon)")
      .eq("user_id", userId)
      .gte("occurred_at", from)
      .lte("occurred_at", to),
    // all-time totals for running balance
    supabase.from("transactions").select("amount, kind").eq("user_id", userId),
    // recent activity
    supabase
      .from("transactions")
      .select("*, category:categories(id, name, color, icon)")
      .eq("user_id", userId)
      .order("occurred_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(6),
    // cheap existence check
    supabase
      .from("transactions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  const month = (monthTx.data ?? []) as unknown as TxWithCategory[];
  const all = (allTx.data ?? []) as Pick<Transaction, "amount" | "kind">[];

  let monthIncome = 0;
  let monthExpense = 0;
  const categoryMap = new Map<string, CategorySpend>();

  for (const tx of month) {
    const amount = Number(tx.amount);
    if (tx.kind === "income") {
      monthIncome += amount;
    } else {
      monthExpense += amount;
      const key = tx.category?.id ?? "uncategorized";
      const existing = categoryMap.get(key);
      if (existing) {
        existing.total += amount;
      } else {
        categoryMap.set(key, {
          categoryId: tx.category?.id ?? null,
          name: tx.category?.name ?? "Uncategorized",
          color: tx.category?.color ?? "#9AA0A6",
          total: amount,
        });
      }
    }
  }

  let allIncome = 0;
  let allExpense = 0;
  for (const tx of all) {
    if (tx.kind === "income") allIncome += Number(tx.amount);
    else allExpense += Number(tx.amount);
  }

  const monthNet = monthIncome - monthExpense;
  const savingsRate = monthIncome > 0 ? (monthNet / monthIncome) * 100 : 0;
  const byCategory = [...categoryMap.values()].sort((a, b) => b.total - a.total);

  return {
    monthIncome,
    monthExpense,
    monthNet,
    balance: allIncome - allExpense,
    savingsRate,
    byCategory,
    recent: (recent.data ?? []) as unknown as TxWithCategory[],
    hasAnyTransactions: (anyTx.count ?? 0) > 0,
  };
}
