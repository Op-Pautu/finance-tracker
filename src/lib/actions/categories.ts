"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import { categorySchema, type CategoryValues } from "@/lib/validations/category";

export type ActionResult = { ok: true } | { ok: false; error: string };

function refresh() {
  revalidatePath("/transactions");
  revalidatePath("/budget");
  revalidatePath("/settings");
}

export async function createCategory(
  values: CategoryValues,
): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { user, supabase } = await requireUser();
  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name: parsed.data.name,
    kind: parsed.data.kind,
    color: parsed.data.color,
    icon: parsed.data.icon,
  });

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}
