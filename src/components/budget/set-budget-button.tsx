"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BudgetDialog } from "@/components/budget/budget-dialog";
import type { Category } from "@/types/db";

export function SetBudgetButton({
  month,
  availableCategories,
}: {
  month: string;
  availableCategories: Category[];
}) {
  const [open, setOpen] = React.useState(false);
  const disabled = availableCategories.length === 0;

  return (
    <>
      <Button
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={disabled ? "Every category already has a budget" : undefined}
      >
        <Plus className="size-4" />
        Set budget
      </Button>
      <BudgetDialog
        open={open}
        onOpenChange={setOpen}
        month={month}
        availableCategories={availableCategories}
      />
    </>
  );
}
