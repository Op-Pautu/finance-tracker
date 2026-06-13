import { ArrowUpRight, PiggyBank, Target, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";

export default function Home() {
  return (
    <main className="bg-grain relative flex min-h-full flex-1 flex-col items-center justify-center px-6 py-20">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
          <span className="size-1.5 rounded-full bg-primary" />
          Phase 0 · design system online
        </div>

        <h1 className="font-heading text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Know where your <span className="text-primary">money</span> goes.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-pretty text-base text-muted-foreground">
          FinTrack is a calm, modern way to track spending, budgets, savings
          goals and EMIs — without the spreadsheet headache.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" className="gap-1.5">
            Get started <ArrowUpRight className="size-4" />
          </Button>
          <Button size="lg" variant="outline">
            See a demo
          </Button>
        </div>

        {/* token preview */}
        <div className="mt-14 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
          <PreviewCard
            icon={<Wallet className="size-4" />}
            label="Balance"
            value={formatINR(48200)}
            tone="primary"
          />
          <PreviewCard
            icon={<Target className="size-4" />}
            label="Goals"
            value={formatINR(86000)}
            tone="goal"
          />
          <PreviewCard
            icon={<PiggyBank className="size-4" />}
            label="Saved /mo"
            value={formatINR(12400)}
            tone="income"
          />
        </div>
      </div>
    </main>
  );
}

function PreviewCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "goal" | "income";
}) {
  const toneClasses = {
    primary: "text-primary bg-accent",
    goal: "text-goal bg-goal-muted",
    income: "text-income bg-income-muted",
  }[tone];

  return (
    <Card className="gap-0 p-4 shadow-card transition-transform hover:-translate-y-0.5">
      <div
        className={`mb-3 inline-flex size-8 items-center justify-center rounded-lg ${toneClasses}`}
      >
        {icon}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="tabular mt-0.5 text-xl font-semibold text-foreground">
        {value}
      </p>
    </Card>
  );
}
