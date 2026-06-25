"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { markEmiPayment } from "@/lib/actions/emis";
import { Button } from "@/components/ui/button";

/** Records one installment as paid. */
export function MarkPaidButton({ emiId }: { emiId: string }) {
  const [loading, setLoading] = React.useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await markEmiPayment(emiId);
    setLoading(false);
    if (res.ok) toast.success("Payment recorded");
    else toast.error(res.error);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Check className="size-3.5" />
      )}
      Mark paid
    </Button>
  );
}
