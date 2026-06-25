import type { Metadata } from "next";
import { Landmark, CalendarClock, Wallet } from "lucide-react";
import { requireUser } from "@/lib/supabase/auth";
import { getEmis } from "@/lib/queries/emis";
import { formatINR } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { EmiCard } from "@/components/emis/emi-card";
import { NewEmiButton } from "@/components/emis/new-emi-button";

export const metadata: Metadata = { title: "EMIs" };

export default async function EmisPage() {
  const { user } = await requireUser();
  const emis = await getEmis(user.id);

  const active = emis.filter((e) => !e.done);
  const monthlyTotal = active.reduce((s, e) => s + e.monthly, 0);
  const remainingDebt = active.reduce((s, e) => s + e.remainingAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="EMIs"
        description="Loans and installments — track payoff and monthly outflow."
      >
        <NewEmiButton />
      </PageHeader>

      {emis.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title="No EMIs tracked"
          description="Add a loan or installment — like a laptop or scooty EMI — to track its payoff and monthly cost."
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <SummaryStat
              icon={CalendarClock}
              label="Monthly outflow"
              value={formatINR(monthlyTotal)}
            />
            <SummaryStat
              icon={Wallet}
              label="Remaining debt"
              value={formatINR(remainingDebt)}
            />
            <SummaryStat
              icon={Landmark}
              label="Active EMIs"
              value={String(active.length)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {emis.map((item) => (
              <EmiCard key={item.emi.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Landmark;
  label: string;
  value: string;
}) {
  return (
    <Card className="gap-0 p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-accent text-primary [&_svg]:size-3.5">
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
