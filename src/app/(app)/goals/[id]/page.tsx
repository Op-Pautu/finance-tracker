import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, CalendarClock, PiggyBank, Flag } from "lucide-react";
import { createElement } from "react";
import { requireUser } from "@/lib/supabase/auth";
import { getGoalDetail } from "@/lib/queries/goals";
import { resolveIcon } from "@/components/shared/category-icon";
import { formatINR, formatPercent } from "@/lib/format";
import { longDate } from "@/lib/date";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressRing } from "@/components/shared/progress-ring";
import { EmptyState } from "@/components/shared/empty-state";
import { GoalActions } from "@/components/goals/goal-actions";
import { AddContributionButton } from "@/components/goals/add-contribution-button";
import { ContributionList } from "@/components/goals/contribution-list";

export const metadata: Metadata = { title: "Goal" };

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await requireUser();
  const detail = await getGoalDetail(user.id, id);

  if (!detail) notFound();

  const { goal, saved, remaining, pct, done, contributions, monthlyNeeded, daysLeft } =
    detail;
  const Icon = resolveIcon(goal.icon);

  return (
    <div className="space-y-6">
      <Link
        href="/goals"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All goals
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="grid size-11 place-items-center rounded-xl [&_svg]:size-5"
            style={{ backgroundColor: `${goal.color}1f`, color: goal.color }}
          >
            {createElement(Icon)}
          </span>
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {goal.name}
            </h1>
            {goal.target_date && (
              <p className="text-sm text-muted-foreground">
                Target date · {longDate(goal.target_date)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddContributionButton goalId={goal.id} goalName={goal.name} />
          <GoalActions goal={goal} />
        </div>
      </div>

      {/* progress overview */}
      <Card>
        <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <ProgressRing value={pct} size={140} stroke={12} color={goal.color}>
            <span className="tabular text-2xl font-semibold text-foreground">
              {formatPercent(pct)}
            </span>
            <span className="text-xs text-muted-foreground">saved</span>
          </ProgressRing>

          <div className="grid w-full flex-1 grid-cols-2 gap-4">
            <Metric
              icon={PiggyBank}
              label="Saved"
              value={formatINR(saved)}
              tone="income"
            />
            <Metric
              icon={Flag}
              label="Target"
              value={formatINR(Number(goal.target_amount))}
            />
            <Metric
              icon={done ? Check : PiggyBank}
              label="Remaining"
              value={done ? "Reached 🎉" : formatINR(remaining)}
              tone={done ? "income" : undefined}
            />
            <Metric
              icon={CalendarClock}
              label={monthlyNeeded != null ? "Needed / month" : "Status"}
              value={
                done
                  ? "Complete"
                  : monthlyNeeded != null
                    ? formatINR(Math.ceil(monthlyNeeded))
                    : "In progress"
              }
              hint={
                daysLeft != null && !done
                  ? daysLeft >= 0
                    ? `${daysLeft} days left`
                    : "Target date passed"
                  : undefined
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* contributions */}
      <Card>
        <CardHeader>
          <CardTitle>Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          {contributions.length > 0 ? (
            <ContributionList contributions={contributions} goalId={goal.id} />
          ) : (
            <EmptyState
              icon={PiggyBank}
              title="No contributions yet"
              description="Add your first contribution to start filling this goal."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof PiggyBank;
  label: string;
  value: string;
  hint?: string;
  tone?: "income";
}) {
  return (
    <div className="rounded-lg border bg-card/50 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p
        className={`tabular mt-1 text-base font-semibold ${
          tone === "income" ? "text-income" : "text-foreground"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
