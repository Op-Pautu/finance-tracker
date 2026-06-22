"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionDialog } from "@/components/transactions/transaction-dialog";
import type { Category } from "@/types/db";

/**
 * "Add transaction" button. Auto-opens when the URL carries ?new=1
 * (the dashboard CTA links here), then strips the param.
 */
export function AddTransaction({ categories }: { categories: Category[] }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      setOpen(true);
      const params = new URLSearchParams(searchParams);
      params.delete("new");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Add transaction
      </Button>
      <TransactionDialog
        open={open}
        onOpenChange={setOpen}
        categories={categories}
      />
    </>
  );
}
