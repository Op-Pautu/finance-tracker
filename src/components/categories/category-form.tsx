"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { categorySchema, type CategoryValues } from "@/lib/validations/category";
import { createCategory } from "@/lib/actions/categories";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  DEFAULT_CATEGORY_COLOR,
  DEFAULT_CATEGORY_ICON,
} from "@/lib/category-options";
import { resolveIcon } from "@/components/shared/category-icon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TxKind } from "@/types/db";

export function CategoryForm({ onDone }: { onDone: () => void }) {
  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      kind: "expense",
      color: DEFAULT_CATEGORY_COLOR,
      icon: DEFAULT_CATEGORY_ICON,
    },
  });

  async function onSubmit(values: CategoryValues) {
    const res = await createCategory(values);
    if (res.ok) {
      toast.success("Category added");
      onDone();
    } else {
      toast.error(res.error);
    }
  }

  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="category-name">Name</Label>
        <Input
          id="category-name"
          placeholder="e.g. Subscriptions"
          autoFocus
          {...form.register("name")}
        />
        {errors.name && (
          <p className="text-xs text-expense">{errors.name.message}</p>
        )}
      </div>

      {/* kind toggle */}
      <Controller
        control={form.control}
        name="kind"
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label>Type</Label>
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              <KindButton
                active={field.value === "expense"}
                tone="expense"
                onClick={() => field.onChange("expense")}
              >
                Expense
              </KindButton>
              <KindButton
                active={field.value === "income"}
                tone="income"
                onClick={() => field.onChange("income")}
              >
                Income
              </KindButton>
            </div>
          </div>
        )}
      />

      {/* colour */}
      <Controller
        control={form.control}
        name="color"
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label>Colour</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS.map((c) => (
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
                {CATEGORY_ICONS.map((name) => {
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
          Add category
        </Button>
      </div>
    </form>
  );
}

function KindButton({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: TxKind;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        !active && "text-muted-foreground hover:text-foreground",
        active && tone === "expense" && "bg-card text-expense shadow-card",
        active && tone === "income" && "bg-card text-income shadow-card",
      )}
    >
      {children}
    </button>
  );
}
