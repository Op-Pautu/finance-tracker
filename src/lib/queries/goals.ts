import { createClient } from "@/lib/supabase/server";
import type { Goal, GoalContribution } from "@/types/db";

export type GoalWithProgress = {
  goal: Goal;
  saved: number;
  remaining: number;
  pct: number; // 0–100, clamped
  done: boolean;
};

function progress(goal: Goal, saved: number): GoalWithProgress {
  const target = Number(goal.target_amount);
  const remaining = Math.max(0, target - saved);
  const pct = target > 0 ? Math.min(100, (saved / target) * 100) : 0;
  return { goal, saved, remaining, pct, done: saved >= target };
}

/** All goals with their saved amount (sum of contributions). */
export async function getGoals(userId: string): Promise<GoalWithProgress[]> {
  const supabase = await createClient();

  const [goalsRes, contribRes] = await Promise.all([
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    supabase
      .from("goal_contributions")
      .select("goal_id, amount")
      .eq("user_id", userId),
  ]);

  const savedByGoal = new Map<string, number>();
  for (const c of contribRes.data ?? []) {
    savedByGoal.set(c.goal_id, (savedByGoal.get(c.goal_id) ?? 0) + Number(c.amount));
  }

  return ((goalsRes.data ?? []) as Goal[]).map((goal) =>
    progress(goal, savedByGoal.get(goal.id) ?? 0),
  );
}

export type GoalDetail = GoalWithProgress & {
  contributions: GoalContribution[];
  monthlyNeeded: number | null; // to hit target_date, null if no date / done
  daysLeft: number | null;
};

/** A single goal with its contribution history and a simple projection. */
export async function getGoalDetail(
  userId: string,
  goalId: string,
): Promise<GoalDetail | null> {
  const supabase = await createClient();

  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .eq("id", goalId)
    .maybeSingle();

  if (!goal) return null;

  const { data: contributions } = await supabase
    .from("goal_contributions")
    .select("*")
    .eq("user_id", userId)
    .eq("goal_id", goalId)
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false });

  const list = (contributions ?? []) as GoalContribution[];
  const saved = list.reduce((s, c) => s + Number(c.amount), 0);
  const base = progress(goal as Goal, saved);

  let monthlyNeeded: number | null = null;
  let daysLeft: number | null = null;
  if (goal.target_date && !base.done) {
    const target = new Date(`${goal.target_date}T00:00:00`);
    const now = new Date();
    const ms = target.getTime() - now.getTime();
    daysLeft = Math.ceil(ms / (1000 * 60 * 60 * 24));
    const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));
    monthlyNeeded = base.remaining / monthsLeft;
  }

  return { ...base, contributions: list, monthlyNeeded, daysLeft };
}
