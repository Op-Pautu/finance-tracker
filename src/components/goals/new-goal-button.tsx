"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalDialog } from "@/components/goals/goal-dialog";

export function NewGoalButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        New goal
      </Button>
      <GoalDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
