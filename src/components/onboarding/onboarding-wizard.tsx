"use client";

import * as React from "react";
import { Loader2, ArrowRight, ArrowLeft, Plus, Landmark, Check } from "lucide-react";
import { toast } from "sonner";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmiDialog } from "@/components/emis/emi-dialog";

type Step = 0 | 1;

export function OnboardingWizard({
  defaultName,
  defaultIncome,
}: {
  defaultName: string;
  defaultIncome: number;
}) {
  const [step, setStep] = React.useState<Step>(0);
  const [name, setName] = React.useState(defaultName);
  const [income, setIncome] = React.useState(
    defaultIncome ? String(defaultIncome) : "",
  );
  const [emiOpen, setEmiOpen] = React.useState(false);
  const [emiAdded, setEmiAdded] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  const nameValid = name.trim().length > 0;

  async function finish() {
    setSubmitting(true);
    const res = await completeOnboarding({
      display_name: name.trim(),
      monthly_income: Number(income) || 0,
    });
    // success redirects; only failures return here
    if (res && !res.ok) {
      setSubmitting(false);
      toast.error(res.error);
    }
  }

  return (
    <div className="w-full">
      {/* progress */}
      <div className="mb-6 flex items-center gap-2">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= step ? "bg-primary" : "bg-muted",
            )}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Welcome to FinTrack 🌱
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Let&apos;s set you up in two quick steps.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ob-name">What should we call you?</Label>
            <Input
              id="ob-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ob-income">Monthly income (optional)</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                ₹
              </span>
              <Input
                id="ob-income"
                inputMode="decimal"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="0"
                className="tabular pl-7"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Helps gauge your savings rate. You can change it anytime.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              className="gap-1.5"
              disabled={!nameValid}
              onClick={() => setStep(1)}
            >
              Continue <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Any EMIs to track?
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add loans or installments — like a laptop or scooty EMI. Optional,
              and you can add more later.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEmiOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/40"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-accent text-primary">
              <Plus className="size-4" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Add an EMI</p>
              <p className="text-xs text-muted-foreground">
                Track payoff progress and monthly outflow.
              </p>
            </div>
            <Landmark className="size-4 text-muted-foreground" />
          </button>

          {emiAdded > 0 && (
            <p className="flex items-center gap-1.5 text-sm text-income">
              <Check className="size-4" />
              {emiAdded} EMI{emiAdded > 1 ? "s" : ""} added
            </p>
          )}

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="gap-1.5"
              onClick={() => setStep(0)}
              disabled={submitting}
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button className="gap-1.5" onClick={finish} disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {emiAdded > 0 ? "Finish" : "Finish — I'll add later"}
            </Button>
          </div>

          <EmiDialog
            open={emiOpen}
            onOpenChange={setEmiOpen}
            onSaved={() => setEmiAdded((c) => c + 1)}
          />
        </div>
      )}
    </div>
  );
}
