"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  transactionSchema,
  type TransactionValues,
} from "@/lib/validations/transaction";
import {
  createTransaction,
  updateTransaction,
} from "@/lib/actions/transactions";
import { today } from "@/lib/date";
import { cn } from "@/lib/utils";
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
import type { Category, TxKind, Transaction } from "@/types/db";

type Props = {
  categories: Category[];
  transaction?: Transaction;
  onDone: () => void;
};

export function TransactionForm({ categories, transaction, onDone }: Props) {
  const isEdit = Boolean(transaction);

  const form = useForm<TransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      kind: transaction?.kind ?? "expense",
      amount: transaction ? Number(transaction.amount) : undefined,
      category_id: transaction?.category_id ?? "",
      occurred_at: transaction?.occurred_at ?? today(),
      note: transaction?.note ?? "",
    },
  });

  const kind = form.watch("kind");
  const visibleCategories = React.useMemo(
    () => categories.filter((c) => c.kind === kind),
    [categories, kind],
  );

  // Clear the chosen category if it no longer matches the selected kind.
  React.useEffect(() => {
    const current = form.getValues("category_id");
    if (current && !visibleCategories.some((c) => c.id === current)) {
      form.setValue("category_id", "", { shouldValidate: false });
    }
  }, [kind, visibleCategories, form]);

  async function onSubmit(values: TransactionValues) {
    const res = transaction
      ? await updateTransaction(transaction.id, values)
      : await createTransaction(values);

    if (res.ok) {
      toast.success(isEdit ? "Transaction updated" : "Transaction added");
      onDone();
    } else {
      toast.error(res.error);
    }
  }

  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* kind toggle */}
      <Controller
        control={form.control}
        name="kind"
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
            <KindButton
              active={field.value === "expense"}
              tone="expense"
              onClick={() => field.onChange("expense")}
            >
              Expense
            </KindButton>
            <KindButton
              active={field.value === "income"}
              tone="income"
              onClick={() => field.onChange("income")}
            >
              Income
            </KindButton>
          </div>
        )}
      />

      {/* amount */}
      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            ₹
          </span>
          <Input
            id="amount"
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

      {/* category */}
      <div className="space-y-1.5">
        <Label>Category</Label>
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
                    const c = categories.find((x) => x.id === value);
                    return c ? (
                      <span className="flex items-center gap-2">
                        <Dot color={c.color} />
                        {c.name}
                      </span>
                    ) : null;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {visibleCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    <Dot color={c.color} />
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category_id && (
          <p className="text-xs text-expense">{errors.category_id.message}</p>
        )}
      </div>

      {/* date + note */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="occurred_at">Date</Label>
          <Input
            id="occurred_at"
            type="date"
            className="tabular"
            {...form.register("occurred_at")}
          />
          {errors.occurred_at && (
            <p className="text-xs text-expense">{errors.occurred_at.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="note">Note (optional)</Label>
          <Input
            id="note"
            placeholder="e.g. Groceries"
            {...form.register("note")}
          />
          {errors.note && (
            <p className="text-xs text-expense">{errors.note.message}</p>
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
          {isEdit ? "Save changes" : "Add transaction"}
        </Button>
      </div>
    </form>
  );
}

function KindButton({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: TxKind;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        !active && "text-muted-foreground hover:text-foreground",
        active && tone === "expense" && "bg-card text-expense shadow-card",
        active && tone === "income" && "bg-card text-income shadow-card",
      )}
    >
      {children}
    </button>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      className="size-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}
