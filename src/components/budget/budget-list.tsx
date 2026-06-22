import { CategoryIcon } from "@/components/shared/category-icon";
import { ProgressBar } from "@/components/shared/progress-bar";
import { BudgetActions } from "@/components/budget/budget-actions";
import { formatINR, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BudgetRow } from "@/lib/queries/budgets";

export function BudgetList({
  rows,
  month,
}: {
  rows: BudgetRow[];
  month: string;
}) {
  return (
    <ul className="divide-y divide-border/70">
      {rows.map(({ budget, category, spent }) => {
        const limit = Number(budget.amount);
        const pct = limit > 0 ? (spent / limit) * 100 : 0;
        const remaining = limit - spent;
        const over = remaining < 0;

        return (
          <li key={budget.id} className="py-3.5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <CategoryIcon icon={category.icon} color={category.color} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {category.name}
                </p>
                <p className="tabular text-xs text-muted-foreground">
                  {formatINR(spent)} of {formatINR(limit)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "tabular text-sm font-semibold",
                    over ? "text-expense" : "text-foreground",
                  )}
                >
                  {over
                    ? `${formatINR(Math.abs(remaining))} over`
                    : `${formatINR(remaining)} left`}
                </p>
                <p className="tabular text-xs text-muted-foreground">
                  {formatPercent(pct)} used
                </p>
              </div>
              <BudgetActions
                budgetId={budget.id}
                category={category}
                amount={limit}
                month={month}
              />
            </div>
            <ProgressBar value={pct} className="mt-2.5" />
          </li>
        );
      })}
    </ul>
  );
}
