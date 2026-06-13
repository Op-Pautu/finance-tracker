import Link from "next/link";
import { ArrowUpRight, PiggyBank, Target, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/format";

export default function Home() {
  return (
    <main className="bg-grain relative flex min-h-full flex-1 flex-col px-6">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            Sign in
          </Link>
          <Link href="/signup" className={cn(buttonVariants({ size: "sm" }))}>
            Get started
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
          <span className="size-1.5 rounded-full bg-primary" />
          Personal finance, minus the spreadsheet
        </div>

        <h1 className="font-heading text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Know where your <span className="text-primary">money</span> goes.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-pretty text-base text-muted-foreground">
          FinTrack is a calm, modern way to track spending, budgets, savings
          goals and EMIs — without the spreadsheet headache.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "h-10 gap-1.5 px-5")}
          >
            Get started <ArrowUpRight className="size-4" />
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-5")}
          >
            Sign in
          </Link>
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
