import type { Metadata } from "next";
import Link from "next/link";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Plus,
  Receipt,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { requireUser } from "@/lib/supabase/auth";
import { getDashboardData } from "@/lib/queries/dashboard";
import { monthLabel } from "@/lib/date";
import { formatINR, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SpendingDonut } from "@/components/dashboard/spending-donut";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const { user } = await requireUser();
  const data = await getDashboardData(user.id);
  const now = new Date();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Your money at a glance · ${monthLabel(now)}`}
      >
        <Link
          href="/transactions?new=1"
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
        >
          <Plus className="size-4" />
          Add transaction
        </Link>
      </PageHeader>

      {!data.hasAnyTransactions ? (
        <WelcomeEmpty name={user.email?.split("@")[0] ?? "there"} />
      ) : (
        <>
          {/* stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={Wallet}
              label="Balance"
              value={formatINR(data.balance)}
              hint="All-time net"
              tone="primary"
            />
            <StatCard
              icon={TrendingUp}
              label="Income"
              value={formatINR(data.monthIncome)}
              hint="This month"
              tone="income"
            />
            <StatCard
              icon={TrendingDown}
              label="Spent"
              value={formatINR(data.monthExpense)}
              hint="This month"
              tone="expense"
            />
            <StatCard
              icon={PiggyBank}
              label="Saved"
              value={formatINR(data.monthNet)}
              hint={
                data.monthIncome > 0
                  ? `${formatPercent(data.savingsRate)} of income`
                  : "This month"
              }
              tone="goal"
            />
          </div>

          {/* breakdown + recent */}
          <div className="grid gap-4 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Where your money went</CardTitle>
                <CardDescription>
                  Spending by category · {monthLabel(now)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.byCategory.length > 0 ? (
                  <SpendingDonut
                    data={data.byCategory}
                    total={data.monthExpense}
                  />
                ) : (
                  <EmptyState
                    icon={Receipt}
                    title="No spending yet this month"
                    description="Add an expense to see your breakdown light up."
                  />
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Recent activity</CardTitle>
                <Link
                  href="/transactions"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  View all <ArrowRight className="size-3" />
                </Link>
              </CardHeader>
              <CardContent>
                {data.recent.length > 0 ? (
                  <RecentTransactions items={data.recent} />
                ) : (
                  <EmptyState
                    icon={Receipt}
                    title="Nothing here yet"
                    description="Your latest transactions will show up here."
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function WelcomeEmpty({ name }: { name: string }) {
  return (
    <Card className="bg-grain overflow-hidden">
      <CardContent className="flex flex-col items-center px-6 py-14 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-card">
          <Sparkles className="size-6" />
        </span>
        <h2 className="mt-5 font-heading text-xl font-semibold tracking-tight">
          Welcome, {name} 👋
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Let&apos;s get a clear picture of your money. Add your first
          transaction and your dashboard will come to life — totals, spending
          breakdown and trends.
        </p>
        <Link
          href="/transactions?new=1"
          className={cn(buttonVariants(), "mt-6 gap-1.5")}
        >
          <Plus className="size-4" />
          Add your first transaction
        </Link>
      </CardContent>
    </Card>
  );
}
