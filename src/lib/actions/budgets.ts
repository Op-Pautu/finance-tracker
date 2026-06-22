"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { monthStart, monthFromKey } from "@/lib/date";
import { budgetSchema, type BudgetValues } from "@/lib/validations/budget";

export type ActionResult = { ok: true } | { ok: false; error: string };

function refresh() {
  revalidatePath("/budget");
  revalidatePath("/dashboard");
}

/** Create or update a category's budget for a month (one per category/month). */
export async function upsertBudget(values: BudgetValues): Promise<ActionResult> {
  const parsed = budgetSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { user, supabase } = await requireUser();
  const month = monthStart(monthFromKey(parsed.data.month));

  const { error } = await supabase.from("budgets").upsert(
    {
      user_id: user.id,
      category_id: parsed.data.category_id,
      amount: parsed.data.amount,
      month,
    },
    { onConflict: "user_id,category_id,month" },
  );

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function deleteBudget(id: string): Promise<ActionResult> {
  const { user, supabase } = await requireUser();
  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}
