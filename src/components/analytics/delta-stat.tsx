import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Delta } from "@/lib/queries/analytics";

/**
 * A metric with its month-over-month change. `invert` flips the colour logic
 * for expenses, where an increase is "bad" (red).
 */
export function DeltaStat({
  label,
  delta,
  invert = false,
}: {
  label: string;
  delta: Delta;
  invert?: boolean;
}) {
  const { current, pct } = delta;
  const up = pct != null && pct > 0;
  const down = pct != null && pct < 0;
  const good = invert ? down : up;

  const Icon = pct == null || pct === 0 ? Minus : up ? TrendingUp : TrendingDown;

  return (
    <Card className="gap-0 p-4">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <p className="tabular mt-2 text-xl font-semibold tracking-tight text-foreground">
        {formatINR(current)}
      </p>
      <div className="mt-1.5 flex items-center gap-1 text-xs">
        <Icon
          className={cn(
            "size-3.5",
            pct == null || pct === 0
              ? "text-muted-foreground"
              : good
                ? "text-income"
                : "text-expense",
          )}
        />
        <span
          className={cn(
            "tabular font-medium",
            pct == null || pct === 0
              ? "text-muted-foreground"
              : good
                ? "text-income"
                : "text-expense",
          )}
        >
          {pct == null
            ? "—"
            : `${up ? "+" : down ? "−" : ""}${Math.abs(Math.round(pct))}%`}
        </span>
        <span className="text-muted-foreground">vs last month</span>
      </div>
    </Card>
  );
}
