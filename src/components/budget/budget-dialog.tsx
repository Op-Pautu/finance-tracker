"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BudgetForm } from "@/components/budget/budget-form";
import type { Category } from "@/types/db";

export function BudgetDialog({
  open,
  onOpenChange,
  month,
  availableCategories,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: string;
  availableCategories: Category[];
  editing?: { category: Category; amount: number };
}) {
  const isEdit = Boolean(editing);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit budget" : "Set a budget"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Adjust the monthly spending limit for this category."
              : "Cap how much you plan to spend in a category this month."}
          </DialogDescription>
        </DialogHeader>
        <BudgetForm
          month={month}
          availableCategories={availableCategories}
          editing={editing}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
