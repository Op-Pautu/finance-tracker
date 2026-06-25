"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  monthFromKey,
  monthKey,
  monthLabel,
  shiftMonthKey,
} from "@/lib/date";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, TxKind } from "@/types/db";

type TypeFilter = "all" | TxKind;

export function TransactionFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const month = searchParams.get("month") ?? monthKey();
  const type = (searchParams.get("type") as TypeFilter) || "all";
  const category = searchParams.get("category") ?? "all";
  const q = searchParams.get("q") ?? "";

  const setParam = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Debounced search input. Initialised from the URL; the debounce pushes
  // changes back to the URL (which re-renders the server list).
  const [search, setSearch] = React.useState(q);
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (search !== q) setParam({ q: search });
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const visibleCategories =
    type === "all" ? categories : categories.filter((c) => c.kind === type);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* month stepper */}
        <div className="flex items-center rounded-lg border bg-card p-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Previous month"
            onClick={() => setParam({ month: shiftMonthKey(month, -1) })}
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
            onClick={() => setParam({ month: shiftMonthKey(month, 1) })}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        {/* type segmented */}
        <div className="flex items-center gap-0.5 rounded-lg border bg-card p-0.5">
          {(["all", "expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setParam({ type: t, category: "all" })}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                type === t
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* category */}
        <Select
          value={category}
          onValueChange={(v) => setParam({ category: v })}
        >
          <SelectTrigger size="sm" className="min-w-36">
            <SelectValue placeholder="All categories">
              {(value) =>
                value === "all"
                  ? "All categories"
                  : categories.find((c) => c.id === value)?.name ??
                    "All categories"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {visibleCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* search */}
        <div className="relative ml-auto w-full sm:w-52">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            className="h-8 pl-8"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
