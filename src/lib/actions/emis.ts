"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/supabase/auth";
import { emiSchema, type EmiValues } from "@/lib/validations/emi";

export type ActionResult = { ok: true } | { ok: false; error: string };

function refresh() {
  revalidatePath("/emis");
  revalidatePath("/dashboard");
}

export async function createEmi(values: EmiValues): Promise<ActionResult> {
  const parsed = emiSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { user, supabase } = await requireUser();
  const { error } = await supabase.from("emis").insert({
    user_id: user.id,
    name: parsed.data.name,
    monthly_amount: parsed.data.monthly_amount,
    total_months: parsed.data.total_months,
    months_paid: parsed.data.months_paid,
    start_date: parsed.data.start_date,
    day_of_month: parsed.data.day_of_month ?? null,
  });

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function updateEmi(
  id: string,
  values: EmiValues,
): Promise<ActionResult> {
  const parsed = emiSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { user, supabase } = await requireUser();
  const { error } = await supabase
    .from("emis")
    .update({
      name: parsed.data.name,
      monthly_amount: parsed.data.monthly_amount,
      total_months: parsed.data.total_months,
      months_paid: parsed.data.months_paid,
      start_date: parsed.data.start_date,
      day_of_month: parsed.data.day_of_month ?? null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function deleteEmi(id: string): Promise<void> {
  const { user, supabase } = await requireUser();
  await supabase.from("emis").delete().eq("id", id).eq("user_id", user.id);
  refresh();
  redirect("/emis");
}

/** Record one more installment paid (capped at the total term). */
export async function markEmiPayment(id: string): Promise<ActionResult> {
  const { user, supabase } = await requireUser();

  const { data: emi, error: readErr } = await supabase
    .from("emis")
    .select("months_paid, total_months")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (readErr) return { ok: false, error: readErr.message };
  if (!emi) return { ok: false, error: "EMI not found" };
  if (emi.months_paid >= emi.total_months) return { ok: true };

  const { error } = await supabase
    .from("emis")
    .update({ months_paid: emi.months_paid + 1 })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

/** Undo the most recent installment (floor 0). */
export async function undoEmiPayment(id: string): Promise<ActionResult> {
  const { user, supabase } = await requireUser();

  const { data: emi, error: readErr } = await supabase
    .from("emis")
    .select("months_paid")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (readErr) return { ok: false, error: readErr.message };
  if (!emi) return { ok: false, error: "EMI not found" };
  if (emi.months_paid <= 0) return { ok: true };

  const { error } = await supabase
    .from("emis")
    .update({ months_paid: emi.months_paid - 1 })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}
