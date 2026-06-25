import Link from "next/link";
import { Landmark, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatINR } from "@/lib/format";
import type { EmiSummary } from "@/lib/queries/emis";

export function EmiWatch({ summary }: { summary: EmiSummary }) {
  if (!summary.hasEmis) {
    return (
      <Link href="/emis" className="block">
        <Card className="h-full transition-shadow hover:shadow-card">
          <CardContent className="flex h-full items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-accent text-primary">
              <Landmark className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Track your EMIs
              </p>
              <p className="text-xs text-muted-foreground">
                See payoff progress and monthly outflow at a glance.
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            EMI obligations
          </p>
          <Link
            href="/emis"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View <ArrowRight className="size-3" />
          </Link>
        </div>
        <p className="tabular text-xl font-semibold tracking-tight">
          {formatINR(summary.monthlyTotal)}
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            /month
          </span>
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {summary.activeCount} active{" "}
            {summary.activeCount === 1 ? "loan" : "loans"}
          </span>
          <span className="tabular">
            {formatINR(summary.remainingDebt)} left to pay
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
