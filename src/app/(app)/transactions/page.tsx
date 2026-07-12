import type { Metadata } from "next";
import { Receipt, ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";
import { requireUser } from "@/lib/supabase/auth";
import { getCategories, getTransactions } from "@/lib/queries/transactions";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AddTransaction } from "@/components/transactions/add-transaction";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionList } from "@/components/transactions/transaction-list";
import type { TxKind } from "@/types/db";

export const metadata: Metadata = { title: "Transactions" };

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
    type?: string;
    category?: string;
    q?: string;
  }>;
}) {
  const { user } = await requireUser();
  const sp = await searchParams;

  const [categories, result] = await Promise.all([
    getCategories(user.id),
    getTransactions(user.id, {
      month: sp.month,
      type: (sp.type as "all" | TxKind) || "all",
      categoryId: sp.category,
      q: sp.q,
    }),
  ]);

  const net = result.income - result.expense;
  const isFiltered = Boolean(sp.type || sp.category || sp.q);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Every rupee in and out — search, filter and edit."
      >
        <AddTransaction categories={categories} />
      </PageHeader>

      <TransactionFilters categories={categories} />

      {/* summary for the current filter */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryStat
          icon={ArrowUpRight}
          label="Income"
          value={formatINR(result.income)}
          tone="income"
        />
        <SummaryStat
          icon={ArrowDownLeft}
          label="Spent"
          value={formatINR(result.expense)}
          tone="expense"
        />
        <SummaryStat
          icon={Scale}
          label="Net"
          value={formatINR(net)}
          tone={net >= 0 ? "income" : "expense"}
        />
      </div>

      <Card>
        <CardContent>
          {result.items.length > 0 ? (
            <TransactionList items={result.items} categories={categories} />
          ) : (
            <EmptyState
              icon={Receipt}
              title={
                isFiltered
                  ? "No matches"
                  : "No transactions this month"
              }
              description={
                isFiltered
                  ? "Try a different month, type or search term."
                  : "Add your first transaction for this month to get started."
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Receipt;
  label: string;
  value: string;
  tone: "income" | "expense";
}) {
  return (
    <Card className="gap-0 p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid size-7 place-items-center rounded-lg [&_svg]:size-3.5",
            tone === "income"
              ? "bg-income-muted text-income"
              : "bg-expense-muted text-expense",
          )}
        >
          <Icon />
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="tabular mt-2 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {value}
      </p>
    </Card>
  );
}
