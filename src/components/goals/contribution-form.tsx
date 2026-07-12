"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  contributionSchema,
  type ContributionValues,
} from "@/lib/validations/goal";
import { addContribution } from "@/lib/actions/goals";
import { today } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContributionForm({
  goalId,
  onDone,
}: {
  goalId: string;
  onDone: () => void;
}) {
  const form = useForm<ContributionValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      goal_id: goalId,
      amount: undefined,
      occurred_at: today(),
      note: "",
    },
  });

  async function onSubmit(values: ContributionValues) {
    const res = await addContribution(values);
    if (res.ok) {
      toast.success("Added to your goal");
      onDone();
    } else {
      toast.error(res.error);
    }
  }

  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...form.register("goal_id")} />

      <div className="space-y-1.5">
        <Label htmlFor="contrib-amount">Amount</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            ₹
          </span>
          <Input
            id="contrib-amount"
            inputMode="decimal"
            placeholder="0"
            className="tabular pl-7"
            autoFocus
            {...form.register("amount", { valueAsNumber: true })}
          />
        </div>
        <FieldError>{errors.amount?.message}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contrib-date">Date</Label>
          <Input
            id="contrib-date"
            type="date"
            className="tabular"
            {...form.register("occurred_at")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contrib-note">Note (optional)</Label>
          <Input
            id="contrib-note"
            placeholder="e.g. Bonus"
            {...form.register("note")}
          />
        </div>
      </div>

      <div className="-mx-4 -mb-4 flex flex-col-reverse gap-2 border-t bg-muted/50 p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <Loader2 className="size-4 animate-spin" />
          )}
          Add money
        </Button>
      </div>
    </form>
  );
}
