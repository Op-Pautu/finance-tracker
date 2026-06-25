"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContributionForm } from "@/components/goals/contribution-form";

export function AddContributionButton({
  goalId,
  goalName,
}: {
  goalId: string;
  goalName: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Add money
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to {goalName}</DialogTitle>
            <DialogDescription>
              Record a contribution toward this goal.
            </DialogDescription>
          </DialogHeader>
          <ContributionForm goalId={goalId} onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
