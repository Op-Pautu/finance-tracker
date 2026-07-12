"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { monthFromKey, monthKey, monthLabel, shiftMonthKey } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Month stepper that drives the ?month=YYYY-MM URL param. The label opens a
 * month-grid popover for jumping years, since prev/next alone is slow for
 * anything more than a couple of months away.
 */
export function MonthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const month = searchParams.get("month") ?? monthKey();
  const selected = monthFromKey(month);

  const [open, setOpen] = React.useState(false);
  const [pickerYear, setPickerYear] = React.useState(selected.getFullYear());

  function setMonth(key: string) {
    const params = new URLSearchParams(searchParams);
    params.set("month", key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function pick(monthIndex: number) {
    setMonth(monthKey(new Date(pickerYear, monthIndex, 1)));
    setOpen(false);
  }

  return (
    <div className="flex w-fit items-center rounded-lg border bg-card p-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Previous month"
        onClick={() => setMonth(shiftMonthKey(month, -1))}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) setPickerYear(selected.getFullYear());
        }}
      >
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="min-w-32 justify-center font-medium"
            />
          }
        >
          {monthLabel(selected)}
        </PopoverTrigger>
        <PopoverContent align="center" className="w-56 gap-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Previous year"
              onClick={() => setPickerYear((y) => y - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="tabular text-sm font-medium">{pickerYear}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Next year"
              onClick={() => setPickerYear((y) => y + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {MONTH_ABBR.map((label, i) => {
              const active =
                pickerYear === selected.getFullYear() &&
                i === selected.getMonth();
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => pick(i)}
                  className={cn(
                    "rounded-md py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Next month"
        onClick={() => setMonth(shiftMonthKey(month, 1))}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
