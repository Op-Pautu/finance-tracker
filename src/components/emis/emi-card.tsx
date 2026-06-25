import { Landmark, CalendarCheck, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { EmiActions } from "@/components/emis/emi-actions";
import { MarkPaidButton } from "@/components/emis/mark-paid-button";
import { formatINR } from "@/lib/format";
import { longDate } from "@/lib/date";
import type { EmiWithProgress } from "@/lib/queries/emis";

export function EmiCard({ item }: { item: EmiWithProgress }) {
  const {
    emi,
    monthly,
    paidMonths,
    totalMonths,
    remainingMonths,
    remainingAmount,
    pct,
    payoffDate,
    done,
  } = item;

  return (
    <Card>
      <CardContent className="space-y-3.5">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-primary [&_svg]:size-4">
            {done ? <Check className="size-4" /> : <Landmark className="size-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-heading text-base font-medium text-foreground">
                {emi.name}
              </p>
              {done && (
                <span className="rounded-full bg-income-muted px-1.5 py-0.5 text-[10px] font-semibold text-income">
                  Paid off
                </span>
              )}
            </div>
            <p className="tabular text-sm text-muted-foreground">
              {formatINR(monthly)}
              <span className="text-xs"> /month</span>
            </p>
          </div>
          <EmiActions emi={emi} canUndo={paidMonths > 0} />
        </div>

        <div className="space-y-1.5">
          <ProgressBar
            value={pct}
            tone={done ? "income" : "primary"}
            className="h-2"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="tabular">
              {paidMonths}/{totalMonths} months
            </span>
            <span className="tabular">
              {done ? "Fully paid" : `${formatINR(remainingAmount)} left`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarCheck className="size-3.5" />
            {done
              ? "Completed"
              : `${remainingMonths} mo left · ends ${longDate(payoffDate)}`}
          </span>
          {!done && <MarkPaidButton emiId={emi.id} />}
        </div>
      </CardContent>
    </Card>
  );
}
