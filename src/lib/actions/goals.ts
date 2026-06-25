"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import {
  goalSchema,
  contributionSchema,
  type GoalValues,
  type ContributionValues,
} from "@/lib/validations/goal";

export type ActionResult = { ok: true } | { ok: false; error: string };

function refresh(goalId?: string) {
  revalidatePath("/goals");
  if (goalId) revalidatePath(`/goals/${goalId}`);
  revalidatePath("/dashboard");
}

export async function createGoal(values: GoalValues): Promise<ActionResult> {
  const parsed = goalSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { user, supabase } = await requireUser();
  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    name: parsed.data.name,
    target_amount: parsed.data.target_amount,
    target_date: parsed.data.target_date || null,
    color: parsed.data.color,
    icon: parsed.data.icon,
  });

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function updateGoal(
  id: string,
  values: GoalValues,
): Promise<ActionResult> {
  const parsed = goalSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { user, supabase } = await requireUser();
  const { error } = await supabase
    .from("goals")
    .update({
      name: parsed.data.name,
      target_amount: parsed.data.target_amount,
      target_date: parsed.data.target_date || null,
      color: parsed.data.color,
      icon: parsed.data.icon,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  refresh(id);
  return { ok: true };
}

/** Deletes a goal (its contributions cascade) and returns to the list. */
export async function deleteGoal(id: string): Promise<void> {
  const { user, supabase } = await requireUser();
  await supabase.from("goals").delete().eq("id", id).eq("user_id", user.id);
  refresh();
  redirect("/goals");
}

export async function addContribution(
  values: ContributionValues,
): Promise<ActionResult> {
  const parsed = contributionSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { user, supabase } = await requireUser();
  const { error } = await supabase.from("goal_contributions").insert({
    user_id: user.id,
    goal_id: parsed.data.goal_id,
    amount: parsed.data.amount,
    occurred_at: parsed.data.occurred_at,
    note: parsed.data.note || null,
  });

  if (error) return { ok: false, error: error.message };
  refresh(parsed.data.goal_id);
  return { ok: true };
}

export async function deleteContribution(
  id: string,
  goalId: string,
): Promise<ActionResult> {
  const { user, supabase } = await requireUser();
  const { error } = await supabase
    .from("goal_contributions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  refresh(goalId);
  return { ok: true };
}
