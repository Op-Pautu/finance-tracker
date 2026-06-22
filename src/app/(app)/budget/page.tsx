import type { Metadata } from "next";
import { Wallet, Info } from "lucide-react";
import { requireUser } from "@/lib/supabase/auth";
import { getBudgetOverview } from "@/lib/queries/budgets";
import { monthFromKey, monthKey, monthLabel } from "@/lib/date";
import { formatINR, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ProgressBar } from "@/components/shared/progress-bar";
import { MonthNav } from "@/components/shared/month-nav";
import { CategoryIcon } from "@/components/shared/category-icon";
import { SetBudgetButton } from "@/components/budget/set-budget-button";
import { BudgetList } from "@/components/budget/budget-list";

export const metadata: Metadata = { title: "Budget" };

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { user } = await requireUser();
  const { month: monthParam } = await searchParams;
  const month = monthParam ?? monthKey();
  const ref = monthFromKey(month);

  const overview = await getBudgetOverview(user.id, ref);
  const { totalBudget, totalSpent } = overview;
  const pct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const remaining = totalBudget - totalSpent;
  const hasBudgets = overview.rows.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budget"
        description="Set monthly limits and track how you're tracking."
      >
        <SetBudgetButton
          month={month}
          availableCategories={overview.availableCategories}
        />
      </PageHeader>

      <MonthNav />

      {hasBudgets ? (
        <>
          {/* overall summary */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Spent of {formatINR(totalBudget)} budget · {monthLabel(ref)}
                  </p>
                  <p className="tabular mt-1 text-3xl font-semibold tracking-tight">
                    {formatINR(totalSpent)}
                  </p>
                </div>
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
              <ProgressBar value={pct} className="h-2.5" />
              <p className="tabular text-xs text-muted-foreground">
                {formatPercent(pct)} of total budget used
              </p>
            </CardContent>
          </Card>

          {/* per-category budgets */}
          <Card>
            <CardHeader>
              <CardTitle>By category</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetList rows={overview.rows} month={month} />
            </CardContent>
          </Card>
        </>
      ) : (
        <EmptyState
          icon={Wallet}
          title="No budgets for this month"
          description="Set a limit on a category to start tracking your spending against a plan."
        />
      )}

      {/* unbudgeted spend hint */}
      {overview.unbudgeted.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="size-4" />
              Spending without a budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border/70">
              {overview.unbudgeted.map(({ category, spent }) => (
                <li
                  key={category.id}
                  className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <CategoryIcon
                    icon={category.icon}
                    color={category.color}
                    size="sm"
                  />
                  <span className="flex-1 truncate text-sm text-foreground">
                    {category.name}
                  </span>
                  <span className="tabular text-sm font-medium text-foreground">
                    {formatINR(spent)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
