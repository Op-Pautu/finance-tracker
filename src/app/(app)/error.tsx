"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-2xl flex-1 items-center py-12">
      <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 px-6 py-12 text-center">
        <div className="grid size-12 place-items-center rounded-full bg-accent text-primary">
          <AlertTriangle className="size-5" />
        </div>
        <p className="mt-4 font-heading text-base font-medium text-foreground">
          Something went wrong
        </p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          This page hit a snag loading your data. You can try again, or head
          back to the dashboard.
        </p>
        <div className="mt-5 flex items-center gap-2">
          <Button size="sm" onClick={reset}>
            Try again
          </Button>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
