"use client";

import * as React from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteContribution } from "@/lib/actions/goals";
import { formatINR } from "@/lib/format";
import { longDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import type { GoalContribution } from "@/types/db";

export function ContributionList({
  contributions,
  goalId,
}: {
  contributions: GoalContribution[];
  goalId: string;
}) {
  return (
    <ul className="divide-y divide-border/70">
      {contributions.map((c) => (
        <ContributionRow key={c.id} contribution={c} goalId={goalId} />
      ))}
    </ul>
  );
}

function ContributionRow({
  contribution,
  goalId,
}: {
  contribution: GoalContribution;
  goalId: string;
}) {
  const [deleting, setDeleting] = React.useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await deleteContribution(contribution.id, goalId);
    if (!res.ok) {
      setDeleting(false);
      toast.error(res.error);
    } else {
      toast.success("Contribution removed");
    }
  }

  return (
    <li className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          {contribution.note?.trim() || "Contribution"}
        </p>
        <p className="text-xs text-muted-foreground">
          {longDate(contribution.occurred_at)}
        </p>
      </div>
      <span className="tabular text-sm font-semibold text-income">
        +{formatINR(Number(contribution.amount))}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Remove contribution"
        disabled={deleting}
        onClick={handleDelete}
        className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-expense"
      >
        {deleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
      </Button>
    </li>
  );
}
