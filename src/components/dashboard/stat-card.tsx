import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Tone = "primary" | "income" | "expense" | "goal";

const TONES: Record<Tone, string> = {
  primary: "bg-accent text-primary",
  income: "bg-income-muted text-income",
  expense: "bg-expense-muted text-expense",
  goal: "bg-goal-muted text-goal",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <Card className="gap-0 p-4 transition-shadow hover:shadow-card sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "grid size-8 place-items-center rounded-lg [&_svg]:size-4",
            TONES[tone],
          )}
        >
          <Icon />
        </span>
      </div>
      <p className="tabular mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
