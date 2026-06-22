import { createClient } from "@/lib/supabase/server";
import { monthRange, monthFromKey } from "@/lib/date";
import type { Category, TxKind } from "@/types/db";
import type { TxWithCategory } from "@/lib/queries/dashboard";

export type TransactionFilters = {
  month?: string; // "2026-06"
  type?: "all" | TxKind;
  categoryId?: string; // category uuid or undefined for all
  q?: string; // search in note
};

export type TransactionsResult = {
  items: TxWithCategory[];
  income: number;
  expense: number;
  count: number;
};

/** All of a user's categories, ordered for pickers (expense first, then A–Z). */
export async function getCategories(userId: string): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("kind", { ascending: true })
    .order("name", { ascending: true });
  return (data ?? []) as Category[];
}

/** Filtered transactions for a month + running income/expense totals. */
export async function getTransactions(
  userId: string,
  filters: TransactionFilters,
): Promise<TransactionsResult> {
  const supabase = await createClient();
  const { from, to } = monthRange(monthFromKey(filters.month));

  let query = supabase
    .from("transactions")
    .select("*, category:categories(id, name, color, icon)")
    .eq("user_id", userId)
    .gte("occurred_at", from)
    .lte("occurred_at", to)
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.type && filters.type !== "all") {
    query = query.eq("kind", filters.type);
  }
  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }
  if (filters.q?.trim()) {
    query = query.ilike("note", `%${filters.q.trim()}%`);
  }

  const { data } = await query;
  const items = (data ?? []) as unknown as TxWithCategory[];

  let income = 0;
  let expense = 0;
  for (const tx of items) {
    if (tx.kind === "income") income += Number(tx.amount);
    else expense += Number(tx.amount);
  }

  return { items, income, expense, count: items.length };
}
