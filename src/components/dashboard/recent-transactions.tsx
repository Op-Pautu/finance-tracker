import { CategoryIcon } from "@/components/shared/category-icon";
import { formatSigned } from "@/lib/format";
import { shortDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { TxWithCategory } from "@/lib/queries/dashboard";

export function RecentTransactions({ items }: { items: TxWithCategory[] }) {
  return (
    <ul className="divide-y divide-border/70">
      {items.map((tx) => (
        <li key={tx.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <CategoryIcon
            icon={tx.category?.icon}
            color={tx.category?.color}
            size="default"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {tx.note?.trim() || tx.category?.name || "Transaction"}
            </p>
            <p className="text-xs text-muted-foreground">
              {tx.category?.name ?? "Uncategorized"} · {shortDate(tx.occurred_at)}
            </p>
          </div>
          <span
            className={cn(
              "tabular shrink-0 text-sm font-semibold",
              tx.kind === "income" ? "text-income" : "text-foreground",
            )}
          >
            {formatSigned(Number(tx.amount), tx.kind)}
          </span>
        </li>
      ))}
    </ul>
  );
}
