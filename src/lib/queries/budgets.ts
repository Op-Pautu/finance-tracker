import { createClient } from "@/lib/supabase/server";
import { monthRange, monthStart } from "@/lib/date";
import type { Budget, Category } from "@/types/db";

export type BudgetRow = {
  budget: Budget;
  category: Category;
  spent: number;
};

export type BudgetOverview = {
  rows: BudgetRow[]; // categories that HAVE a budget, sorted by usage desc
  unbudgeted: { category: Category; spent: number }[]; // spend with no budget set
  availableCategories: Category[]; // expense categories without a budget yet
  totalBudget: number;
  totalSpent: number; // spend on budgeted categories
  unbudgetedSpent: number;
};

/** Sum this month's expense per category id. */
async function spendByCategory(
  userId: string,
  from: string,
  to: string,
): Promise<Map<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("transactions")
    .select("category_id, amount")
    .eq("user_id", userId)
    .eq("kind", "expense")
    .gte("occurred_at", from)
    .lte("occurred_at", to);

  const map = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.category_id) continue;
    map.set(
      row.category_id,
      (map.get(row.category_id) ?? 0) + Number(row.amount),
    );
  }
  return map;
}

/** Full budget-vs-actual picture for a month. */
export async function getBudgetOverview(
  userId: string,
  ref: Date = new Date(),
): Promise<BudgetOverview> {
  const supabase = await createClient();
  const { from, to } = monthRange(ref);
  const month = monthStart(ref);

  const [categoriesRes, budgetsRes, spend] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .eq("kind", "expense")
      .order("name"),
    supabase
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .eq("month", month),
    spendByCategory(userId, from, to),
  ]);

  const categories = (categoriesRes.data ?? []) as Category[];
  const budgets = (budgetsRes.data ?? []) as Budget[];
  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const budgetedIds = new Set(budgets.map((b) => b.category_id));

  const rows: BudgetRow[] = budgets
    .map((budget) => ({
      budget,
      category: categoryById.get(budget.category_id)!,
      spent: spend.get(budget.category_id) ?? 0,
    }))
    .filter((r) => r.category) // drop budgets whose category was deleted
    .sort((a, b) => b.spent / b.budget.amount - a.spent / a.budget.amount);

  const unbudgeted = categories
    .filter((c) => !budgetedIds.has(c.id) && (spend.get(c.id) ?? 0) > 0)
    .map((category) => ({ category, spent: spend.get(category.id) ?? 0 }))
    .sort((a, b) => b.spent - a.spent);

  const availableCategories = categories.filter((c) => !budgetedIds.has(c.id));

  return {
    rows,
    unbudgeted,
    availableCategories,
    totalBudget: budgets.reduce((s, b) => s + Number(b.amount), 0),
    totalSpent: rows.reduce((s, r) => s + r.spent, 0),
    unbudgetedSpent: unbudgeted.reduce((s, u) => s + u.spent, 0),
  };
}

export type BudgetSummary = {
  totalBudget: number;
  totalSpent: number;
  hasBudgets: boolean;
};

/** Lightweight budget totals for the dashboard. */
export async function getBudgetSummary(
  userId: string,
  ref: Date = new Date(),
): Promise<BudgetSummary> {
  const overview = await getBudgetOverview(userId, ref);
  return {
    totalBudget: overview.totalBudget,
    totalSpent: overview.totalSpent,
    hasBudgets: overview.rows.length > 0,
  };
}
