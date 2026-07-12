"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { budgetSchema, type BudgetValues } from "@/lib/validations/budget";
import { upsertBudget } from "@/lib/actions/budgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryIcon } from "@/components/shared/category-icon";
import type { Category } from "@/types/db";

type Props = {
  month: string; // YYYY-MM
  availableCategories: Category[];
  /** When set, the form edits this category's budget (category is fixed). */
  editing?: { category: Category; amount: number };
  onDone: () => void;
};

export function BudgetForm({
  month,
  availableCategories,
  editing,
  onDone,
}: Props) {
  const isEdit = Boolean(editing);

  const form = useForm<BudgetValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category_id: editing?.category.id ?? "",
      amount: editing ? editing.amount : undefined,
      month,
    },
  });

  async function onSubmit(values: BudgetValues) {
    const res = await upsertBudget(values);
    if (res.ok) {
      toast.success(isEdit ? "Budget updated" : "Budget set");
      onDone();
    } else {
      toast.error(res.error);
    }
  }

  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Category</Label>
        {isEdit ? (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
            <CategoryIcon
              icon={editing!.category.icon}
              color={editing!.category.color}
              size="sm"
            />
            {editing!.category.name}
          </div>
        ) : (
          <Controller
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(v) => field.onChange(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a category">
                    {(value) => {
                      const c = availableCategories.find((x) => x.id === value);
                      return c ? (
                        <span className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: c.color }}
                          />
                          {c.name}
                        </span>
                      ) : null;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        {errors.category_id && (
          <p className="text-xs text-expense">{errors.category_id.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="budget-amount">Monthly limit</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            ₹
          </span>
          <Input
            id="budget-amount"
            inputMode="decimal"
            placeholder="0"
            className="tabular pl-7"
            autoFocus
            {...form.register("amount", { valueAsNumber: true })}
          />
        </div>
        {errors.amount && (
          <p className="text-xs text-expense">{errors.amount.message}</p>
        )}
      </div>

      <div className="-mx-4 -mb-4 flex flex-col-reverse gap-2 border-t bg-muted/50 p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {isEdit ? "Save changes" : "Set budget"}
        </Button>
      </div>
    </form>
  );
}
