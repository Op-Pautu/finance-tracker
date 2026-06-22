import Link from "next/link";
import { Wallet, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { formatINR, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BudgetSummary } from "@/lib/queries/budgets";

export function BudgetWatch({ summary }: { summary: BudgetSummary }) {
  // No budgets yet → gentle prompt to set one up.
  if (!summary.hasBudgets) {
    return (
      <Link href="/budget" className="block">
        <Card className="transition-shadow hover:shadow-card">
          <CardContent className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-accent text-primary">
              <Wallet className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Set a monthly budget
              </p>
              <p className="text-xs text-muted-foreground">
                Track your spending against a plan and avoid surprises.
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    );
  }

  const pct =
    summary.totalBudget > 0
      ? (summary.totalSpent / summary.totalBudget) * 100
      : 0;
  const remaining = summary.totalBudget - summary.totalSpent;

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            Monthly budget
          </p>
          <Link
            href="/budget"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Manage <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="flex items-end justify-between">
          <p className="tabular text-xl font-semibold tracking-tight">
            {formatINR(summary.totalSpent)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              of {formatINR(summary.totalBudget)}
            </span>
          </p>
          <p
            className={cn(
              "tabular text-sm font-semibold",
              remaining < 0 ? "text-expense" : "text-income",
            )}
          >
            {remaining < 0
              ? `${formatINR(Math.abs(remaining))} over`
              : `${formatINR(remaining)} left`}
          </p>
        </div>
        <ProgressBar value={pct} />
        <p className="tabular text-xs text-muted-foreground">
          {formatPercent(pct)} used
        </p>
      </CardContent>
    </Card>
  );
}
