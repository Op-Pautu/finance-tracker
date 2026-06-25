import type { Metadata } from "next";
import { Target } from "lucide-react";
import { requireUser } from "@/lib/supabase/auth";
import { getGoals } from "@/lib/queries/goals";
import { formatINR } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { GoalCard } from "@/components/goals/goal-card";
import { NewGoalButton } from "@/components/goals/new-goal-button";

export const metadata: Metadata = { title: "Goals" };

export default async function GoalsPage() {
  const { user } = await requireUser();
  const goals = await getGoals(user.id);

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce(
    (s, g) => s + Number(g.goal.target_amount),
    0,
  );
  const completed = goals.filter((g) => g.done).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        description="Save toward what matters — one contribution at a time."
      >
        <NewGoalButton />
      </PageHeader>

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="Create your first savings goal — an emergency fund, a new scooty, a trip — and watch it fill up."
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <GlanceStat label="Saved" value={formatINR(totalSaved)} />
            <GlanceStat label="Target" value={formatINR(totalTarget)} />
            <GlanceStat
              label="Completed"
              value={`${completed}/${goals.length}`}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {goals.map((item) => (
              <GoalCard key={item.goal.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function GlanceStat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="gap-0 p-3 sm:p-4">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <p className="tabular mt-1.5 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {value}
      </p>
    </Card>
  );
}
