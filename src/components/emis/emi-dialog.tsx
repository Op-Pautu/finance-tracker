"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmiForm } from "@/components/emis/emi-form";
import type { Emi } from "@/types/db";

export function EmiDialog({
  open,
  onOpenChange,
  emi,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emi?: Emi;
  onSaved?: () => void;
}) {
  const isEdit = Boolean(emi);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit EMI" : "Add an EMI"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this loan's details."
              : "Track a loan or installment — laptop, scooty, anything on EMI."}
          </DialogDescription>
        </DialogHeader>
        <EmiForm
          emi={emi}
          onSaved={onSaved}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
