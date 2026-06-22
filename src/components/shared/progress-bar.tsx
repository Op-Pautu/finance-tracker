import { cn } from "@/lib/utils";

type Tone = "auto" | "income" | "expense" | "goal" | "primary";

const TONE_BG: Record<Exclude<Tone, "auto">, string> = {
  income: "bg-income",
  expense: "bg-expense",
  goal: "bg-goal",
  primary: "bg-primary",
};

/**
 * Slim progress bar. With tone="auto" the colour reflects budget health:
 * green under 80%, amber 80–100%, red over budget.
 */
export function ProgressBar({
  value,
  tone = "auto",
  className,
}: {
  value: number; // percentage, may exceed 100
  tone?: Tone;
  className?: string;
}) {
  const width = Math.max(0, Math.min(100, value));
  const color =
    tone === "auto"
      ? value > 100
        ? "bg-expense"
        : value >= 80
          ? "bg-goal"
          : "bg-income"
      : TONE_BG[tone];

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all", color)}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
