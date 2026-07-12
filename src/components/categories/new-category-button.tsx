"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/categories/category-dialog";

export function NewCategoryButton() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Add category
      </Button>
      <CategoryDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
