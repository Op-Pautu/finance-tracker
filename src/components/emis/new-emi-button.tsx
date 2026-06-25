"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmiDialog } from "@/components/emis/emi-dialog";

export function NewEmiButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Add EMI
      </Button>
      <EmiDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
