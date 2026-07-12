"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { profileSchema, type ProfileValues } from "@/lib/validations/profile";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({
  defaultName,
  defaultIncome,
}: {
  defaultName: string;
  defaultIncome: number;
}) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: defaultName,
      monthly_income: defaultIncome,
    },
  });

  async function onSubmit(values: ProfileValues) {
    const res = await updateProfile(values);
    if (res.ok) {
      toast.success("Profile saved");
      form.reset(values);
    } else {
      toast.error(res.error);
    }
  }

  const { errors, isSubmitting, isDirty } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="display_name">Display name</Label>
        <Input id="display_name" {...form.register("display_name")} />
        <FieldError>{errors.display_name?.message}</FieldError>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="monthly_income">Monthly income</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            ₹
          </span>
          <Input
            id="monthly_income"
            inputMode="decimal"
            className="tabular pl-7"
            {...form.register("monthly_income", { valueAsNumber: true })}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Used to gauge your savings rate on the dashboard.
        </p>
        <FieldError>{errors.monthly_income?.message}</FieldError>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
