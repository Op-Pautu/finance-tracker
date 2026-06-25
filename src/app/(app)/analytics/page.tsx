import type { Metadata } from "next";
import { ChartColumnBig, PiggyBank, TrendingUp } from "lucide-react";
import { requireUser } from "@/lib/supabase/auth";
import { getAnalytics } from "@/lib/queries/analytics";
import { monthKey, monthLabel, monthFromKey } from "@/lib/date";
import { formatINR } from "@/lib/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { MonthNav } from "@/components/shared/month-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { TrendChart } from "@/components/analytics/trend-chart";
import { DeltaStat } from "@/components/analytics/delta-stat";
import { CategoryBreakdown } from "@/components/analytics/category-breakdown";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { user } = await requireUser();
  const { month: monthParam } = await searchParams;
  const month = monthParam ?? monthKey();

  const analytics = await getAnalytics(user.id, month);
  const hasData = analytics.months.some((m) => m.income > 0 || m.expense > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Spot trends and understand your money over time."
      />

      <MonthNav />

      {!hasData ? (
        <EmptyState
          icon={ChartColumnBig}
          title="Not enough data yet"
          description="Add some transactions and your trends, comparisons and breakdowns will appear here."
        />
      ) : (
        <>
          {/* month-over-month comparison */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <DeltaStat label="Income" delta={analytics.income} />
            <DeltaStat label="Spent" delta={analytics.expense} invert />
            <DeltaStat label="Net saved" delta={analytics.net} />
          </div>

          {/* trend chart */}
          <Card>
            <CardHeader>
              <CardTitle>Income vs spending</CardTitle>
              <CardDescription>
                Last 6 months · bars show income & spending, the line is net
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart months={analytics.months} />
            </CardContent>
          </Card>

          {/* secondary insights */}
          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Spending by category</CardTitle>
                <CardDescription>{monthLabel(monthFromKey(month))}</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.byCategory.length > 0 ? (
                  <CategoryBreakdown items={analytics.byCategory} />
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No spending recorded this month.
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4 lg:col-span-2">
              <InsightCard
                icon={PiggyBank}
                label="Avg monthly spend"
                value={formatINR(Math.round(analytics.avgExpense))}
                hint="Across the last 6 months"
              />
              <InsightCard
                icon={TrendingUp}
                label="Top category"
                value={analytics.topCategory?.name ?? "—"}
                hint={
                  analytics.topCategory
                    ? `${formatINR(analytics.topCategory.total)} this month`
                    : "No spending yet"
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function InsightCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof PiggyBank;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="gap-0 p-4">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-accent text-primary [&_svg]:size-4">
          <Icon />
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-3 truncate text-lg font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}
