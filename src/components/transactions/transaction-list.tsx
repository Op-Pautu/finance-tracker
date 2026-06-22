import { CategoryIcon } from "@/components/shared/category-icon";
import { TransactionActions } from "@/components/transactions/transaction-actions";
import { formatSigned } from "@/lib/format";
import { longDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/db";
import type { TxWithCategory } from "@/lib/queries/dashboard";

/** Groups transactions by their occurred_at date for readable sectioning. */
function groupByDate(items: TxWithCategory[]) {
  const groups = new Map<string, TxWithCategory[]>();
  for (const tx of items) {
    const list = groups.get(tx.occurred_at) ?? [];
    list.push(tx);
    groups.set(tx.occurred_at, list);
  }
  return [...groups.entries()];
}

export function TransactionList({
  items,
  categories,
}: {
  items: TxWithCategory[];
  categories: Category[];
}) {
  const groups = groupByDate(items);

  return (
    <div className="divide-y divide-border/70">
      {groups.map(([date, txs]) => (
        <div key={date} className="py-1.5 first:pt-0">
          <p className="px-1 py-2 text-xs font-medium text-muted-foreground">
            {longDate(date)}
          </p>
          <ul>
            {txs.map((tx) => (
              <li
                key={tx.id}
                className="group flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-muted/50"
              >
                <CategoryIcon icon={tx.category?.icon} color={tx.category?.color} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {tx.note?.trim() || tx.category?.name || "Transaction"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {tx.category?.name ?? "Uncategorized"}
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
                <TransactionActions transaction={tx} categories={categories} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
