"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { goalSchema, type GoalValues } from "@/lib/validations/goal";
import { createGoal, updateGoal } from "@/lib/actions/goals";
import {
  GOAL_COLORS,
  GOAL_ICONS,
  DEFAULT_GOAL_COLOR,
  DEFAULT_GOAL_ICON,
} from "@/lib/goal-options";
import { resolveIcon } from "@/components/shared/category-icon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Goal } from "@/types/db";

export function GoalForm({
  goal,
  onDone,
}: {
  goal?: Goal;
  onDone: () => void;
}) {
  const isEdit = Boolean(goal);

  const form = useForm<GoalValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: goal?.name ?? "",
      target_amount: goal ? Number(goal.target_amount) : undefined,
      target_date: goal?.target_date ?? "",
      color: goal?.color ?? DEFAULT_GOAL_COLOR,
      icon: goal?.icon ?? DEFAULT_GOAL_ICON,
    },
  });

  async function onSubmit(values: GoalValues) {
    const res = goal
      ? await updateGoal(goal.id, values)
      : await createGoal(values);
    if (res.ok) {
      toast.success(isEdit ? "Goal updated" : "Goal created");
      onDone();
    } else {
      toast.error(res.error);
    }
  }

  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="goal-name">Goal name</Label>
        <Input
          id="goal-name"
          placeholder="e.g. Emergency fund"
          autoFocus
          {...form.register("name")}
        />
        {errors.name && (
          <p className="text-xs text-expense">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="goal-target">Target amount</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              ₹
            </span>
            <Input
              id="goal-target"
              inputMode="decimal"
              placeholder="0"
              className="tabular pl-7"
              {...form.register("target_amount", { valueAsNumber: true })}
            />
          </div>
          {errors.target_amount && (
            <p className="text-xs text-expense">
              {errors.target_amount.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="goal-date">Target date (optional)</Label>
          <Input
            id="goal-date"
            type="date"
            className="tabular"
            {...form.register("target_date")}
          />
        </div>
      </div>

      {/* colour */}
      <Controller
        control={form.control}
        name="color"
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label>Colour</Label>
            <div className="flex flex-wrap gap-2">
              {GOAL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Colour ${c}`}
                  onClick={() => field.onChange(c)}
                  className={cn(
                    "grid size-7 place-items-center rounded-full transition-transform hover:scale-110",
                    field.value === c &&
                      "ring-2 ring-foreground/30 ring-offset-2 ring-offset-card",
                  )}
                  style={{ backgroundColor: c }}
                >
                  {field.value === c && (
                    <Check className="size-3.5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      />

      {/* icon */}
      <Controller
        control={form.control}
        name="icon"
        render={({ field }) => {
          const color = form.watch("color");
          return (
            <div className="space-y-1.5">
              <Label>Icon</Label>
              <div className="flex flex-wrap gap-2">
                {GOAL_ICONS.map((name) => {
                  const Icon = resolveIcon(name);
                  const active = field.value === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-label={`Icon ${name}`}
                      onClick={() => field.onChange(name)}
                      className={cn(
                        "grid size-9 place-items-center rounded-lg border transition-colors [&_svg]:size-4",
                        active
                          ? "border-transparent text-white"
                          : "border-border bg-card text-muted-foreground hover:text-foreground",
                      )}
                      style={active ? { backgroundColor: color } : undefined}
                    >
                      <Icon />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }}
      />

      <div className="-mx-4 -mb-4 flex flex-col-reverse gap-2 border-t bg-muted/50 p-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {isEdit ? "Save changes" : "Create goal"}
        </Button>
      </div>
    </form>
  );
}
