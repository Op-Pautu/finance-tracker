"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/categories/category-form";

export function CategoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
          <DialogDescription>
            Create a category to sort your transactions and budgets by.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
