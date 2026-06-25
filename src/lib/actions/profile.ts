"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { profileSchema, type ProfileValues } from "@/lib/validations/profile";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(
  values: ProfileValues,
): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { user, supabase } = await requireUser();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.display_name,
      monthly_income: parsed.data.monthly_income,
      onboarding_done: true,
    })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}
