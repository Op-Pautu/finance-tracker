"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/auth";
import {
  transactionSchema,
  type TransactionValues,
} from "@/lib/validations/transaction";

export type ActionResult = { ok: true } | { ok: false; error: string };

function refresh() {
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}

export async function createTransaction(
  values: TransactionValues,
): Promise<ActionResult> {
  const parsed = transactionSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { user, supabase } = await requireUser();
  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    kind: parsed.data.kind,
    amount: parsed.data.amount,
    category_id: parsed.data.category_id,
    occurred_at: parsed.data.occurred_at,
    note: parsed.data.note || null,
  });

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function updateTransaction(
  id: string,
  values: TransactionValues,
): Promise<ActionResult> {
  const parsed = transactionSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { user, supabase } = await requireUser();
  const { error } = await supabase
    .from("transactions")
    .update({
      kind: parsed.data.kind,
      amount: parsed.data.amount,
      category_id: parsed.data.category_id,
      occurred_at: parsed.data.occurred_at,
      note: parsed.data.note || null,
    })
    .eq("id", id)
    .eq("user_id", user.id); // defense-in-depth alongside RLS

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  const { user, supabase } = await requireUser();
  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}
