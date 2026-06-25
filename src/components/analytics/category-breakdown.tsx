import { CategoryIcon } from "@/components/shared/category-icon";
import { formatINR, formatPercent } from "@/lib/format";
import type { CategorySlice } from "@/lib/queries/analytics";

/** Ranked expense categories with share-of-spend bars. */
export function CategoryBreakdown({ items }: { items: CategorySlice[] }) {
  return (
    <ul className="space-y-3.5">
      {items.map((c) => (
        <li key={c.categoryId ?? c.name}>
          <div className="flex items-center gap-3">
            <CategoryIcon icon={c.icon} color={c.color} size="sm" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {c.name}
            </span>
            <span className="tabular text-sm font-semibold text-foreground">
              {formatINR(c.total)}
            </span>
            <span className="tabular w-10 text-right text-xs text-muted-foreground">
              {formatPercent(c.pct)}
            </span>
          </div>
          <div className="mt-2 ml-10 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(2, c.pct)}%`,
                backgroundColor: c.color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
