"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { emiSchema, type EmiValues } from "@/lib/validations/emi";
import { createEmi, updateEmi } from "@/lib/actions/emis";
import { today } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Emi } from "@/types/db";

export function EmiForm({
  emi,
  onDone,
  onSaved,
}: {
  emi?: Emi;
  onDone: () => void;
  onSaved?: () => void;
}) {
  const isEdit = Boolean(emi);

  const form = useForm<EmiValues>({
    resolver: zodResolver(emiSchema),
    defaultValues: {
      name: emi?.name ?? "",
      monthly_amount: emi ? Number(emi.monthly_amount) : undefined,
      total_months: emi?.total_months ?? undefined,
      months_paid: emi?.months_paid ?? 0,
      start_date: emi?.start_date ?? today(),
      day_of_month: emi?.day_of_month ?? undefined,
    },
  });

  async function onSubmit(values: EmiValues) {
    const res = emi ? await updateEmi(emi.id, values) : await createEmi(values);
    if (res.ok) {
      toast.success(isEdit ? "EMI updated" : "EMI added");
      onSaved?.();
      onDone();
    } else {
      toast.error(res.error);
    }
  }

  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="emi-name">Name</Label>
        <Input
          id="emi-name"
          placeholder="e.g. Laptop EMI"
          autoFocus
          {...form.register("name")}
        />
        {errors.name && (
          <p className="text-xs text-expense">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="emi-monthly">Monthly payment</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₹
            </span>
            <Input
              id="emi-monthly"
              inputMode="decimal"
              placeholder="0"
              className="tabular pl-7"
              {...form.register("monthly_amount", { valueAsNumber: true })}
            />
          </div>
          {errors.monthly_amount && (
            <p className="text-xs text-expense">
              {errors.monthly_amount.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="emi-start">Start date</Label>
          <Input
            id="emi-start"
            type="date"
            className="tabular"
            {...form.register("start_date")}
          />
          {errors.start_date && (
            <p className="text-xs text-expense">{errors.start_date.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="emi-total">Total months</Label>
          <Input
            id="emi-total"
            inputMode="numeric"
            placeholder="12"
            className="tabular"
            {...form.register("total_months", { valueAsNumber: true })}
          />
          {errors.total_months && (
            <p className="text-xs text-expense">{errors.total_months.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="emi-paid">Months paid</Label>
          <Input
            id="emi-paid"
            inputMode="numeric"
            placeholder="0"
            className="tabular"
            {...form.register("months_paid", { valueAsNumber: true })}
          />
          {errors.months_paid && (
            <p className="text-xs text-expense">{errors.months_paid.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="emi-day">Due day (optional)</Label>
          <Input
            id="emi-day"
            inputMode="numeric"
            placeholder="5"
            className="tabular"
            {...form.register("day_of_month", { valueAsNumber: true })}
          />
          {errors.day_of_month && (
            <p className="text-xs text-expense">{errors.day_of_month.message}</p>
          )}
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
          {isEdit ? "Save changes" : "Add EMI"}
        </Button>
      </div>
    </form>
  );
}
