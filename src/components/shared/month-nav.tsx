"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthFromKey, monthKey, monthLabel, shiftMonthKey } from "@/lib/date";
import { Button } from "@/components/ui/button";

/** Month stepper that drives the ?month=YYYY-MM URL param. */
export function MonthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const month = searchParams.get("month") ?? monthKey();

  function go(delta: number) {
    const params = new URLSearchParams(searchParams);
    params.set("month", shiftMonthKey(month, delta));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center rounded-lg border bg-card p-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Previous month"
        onClick={() => go(-1)}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="min-w-32 px-1 text-center text-sm font-medium">
        {monthLabel(monthFromKey(month))}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Next month"
        onClick={() => go(1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
