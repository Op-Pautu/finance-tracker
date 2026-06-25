import Link from "next/link";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/shared/progress-ring";
import { resolveIcon } from "@/components/shared/category-icon";
import { formatINR, formatPercent } from "@/lib/format";
import { longDate } from "@/lib/date";
import { createElement } from "react";
import type { GoalWithProgress } from "@/lib/queries/goals";

export function GoalCard({ item }: { item: GoalWithProgress }) {
  const { goal, saved, remaining, pct, done } = item;
  const Icon = resolveIcon(goal.icon);

  return (
    <Link href={`/goals/${goal.id}`} className="block">
      <Card className="h-full transition-shadow hover:shadow-lift">
        <CardContent className="flex items-center gap-4">
          <ProgressRing value={pct} size={84} stroke={8} color={goal.color}>
            <span
              className="grid size-9 place-items-center rounded-full [&_svg]:size-4"
              style={{ backgroundColor: `${goal.color}1f`, color: goal.color }}
            >
              {done ? <Check className="size-4" /> : createElement(Icon)}
            </span>
          </ProgressRing>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-heading text-base font-medium text-foreground">
                {goal.name}
              </p>
              {done && (
                <span className="rounded-full bg-income-muted px-1.5 py-0.5 text-[10px] font-semibold text-income">
                  Done
                </span>
              )}
            </div>
            <p className="tabular mt-0.5 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {formatINR(saved)}
              </span>{" "}
              of {formatINR(Number(goal.target_amount))}
            </p>
            <p className="tabular mt-1 text-xs text-muted-foreground">
              {done
                ? "Goal reached 🎉"
                : `${formatPercent(pct)} · ${formatINR(remaining)} to go`}
              {goal.target_date && !done && (
                <span> · by {longDate(goal.target_date)}</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
