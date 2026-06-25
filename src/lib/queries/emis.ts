import { addMonths, format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { fromISO } from "@/lib/date";
import type { Emi } from "@/types/db";

export type EmiWithProgress = {
  emi: Emi;
  monthly: number;
  paidMonths: number;
  remainingMonths: number;
  totalMonths: number;
  paidAmount: number;
  totalAmount: number;
  remainingAmount: number;
  pct: number; // 0–100
  payoffDate: string; // ISO date the loan finishes
  done: boolean;
};

function progress(emi: Emi): EmiWithProgress {
  const monthly = Number(emi.monthly_amount);
  const totalMonths = emi.total_months;
  const paidMonths = Math.min(emi.months_paid, totalMonths);
  const remainingMonths = Math.max(0, totalMonths - paidMonths);
  const payoffDate = format(
    addMonths(fromISO(emi.start_date), totalMonths),
    "yyyy-MM-dd",
  );

  return {
    emi,
    monthly,
    paidMonths,
    remainingMonths,
    totalMonths,
    paidAmount: monthly * paidMonths,
    totalAmount: monthly * totalMonths,
    remainingAmount: monthly * remainingMonths,
    pct: totalMonths > 0 ? (paidMonths / totalMonths) * 100 : 0,
    payoffDate,
    done: paidMonths >= totalMonths,
  };
}

/** All EMIs, active (unpaid) first, then by payoff date. */
export async function getEmis(userId: string): Promise<EmiWithProgress[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("emis")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return ((data ?? []) as Emi[])
    .map(progress)
    .sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return a.payoffDate.localeCompare(b.payoffDate);
    });
}

export type EmiSummary = {
  monthlyTotal: number; // monthly outflow across active EMIs
  remainingDebt: number; // total still owed across active EMIs
  activeCount: number;
  hasEmis: boolean;
};

/** Lightweight EMI obligations for the dashboard. */
export async function getEmiSummary(userId: string): Promise<EmiSummary> {
  const emis = await getEmis(userId);
  const active = emis.filter((e) => !e.done);
  return {
    monthlyTotal: active.reduce((s, e) => s + e.monthly, 0),
    remainingDebt: active.reduce((s, e) => s + e.remainingAmount, 0),
    activeCount: active.length,
    hasEmis: emis.length > 0,
  };
}
