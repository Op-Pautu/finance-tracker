/**
 * Database types for the Supabase schema (see supabase/migrations/0001_init.sql).
 * Hand-authored to match the migration. Once the project is live you can
 * regenerate with: `supabase gen types typescript --project-id <ref> > src/types/db.ts`.
 */

export type TxKind = "income" | "expense";
export type GoalStatus = "active" | "done" | "archived";

export interface Profile {
  id: string;
  display_name: string | null;
  currency: string;
  avatar_url: string | null;
  monthly_income: number;
  onboarding_done: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  kind: TxKind;
  color: string;
  icon: string;
  is_default: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  kind: TxKind;
  category_id: string | null;
  note: string | null;
  occurred_at: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: string; // first day of month, ISO date
  amount: number;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  target_date: string | null;
  color: string;
  icon: string;
  status: GoalStatus;
  created_at: string;
}

export interface GoalContribution {
  id: string;
  user_id: string;
  goal_id: string;
  amount: number;
  occurred_at: string;
  note: string | null;
  created_at: string;
}

export interface Emi {
  id: string;
  user_id: string;
  name: string;
  principal: number | null;
  monthly_amount: number;
  total_months: number;
  months_paid: number;
  start_date: string;
  day_of_month: number | null;
  interest_rate: number | null;
  created_at: string;
}

export interface EmiPayment {
  id: string;
  user_id: string;
  emi_id: string;
  amount: number;
  paid_on: string;
  created_at: string;
}

type Row<T> = T;
type Insert<T, Optional extends keyof T> = Omit<T, Optional> &
  Partial<Pick<T, Optional>>;
type Update<T> = Partial<T>;

/** Columns the DB fills in automatically (safe to omit on insert). */
type Generated = "id" | "created_at";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Row<Profile>;
        Insert: Insert<Profile, "created_at">;
        Update: Update<Profile>;
      };
      categories: {
        Row: Row<Category>;
        Insert: Insert<Category, Generated | "is_default" | "color" | "icon">;
        Update: Update<Category>;
      };
      transactions: {
        Row: Row<Transaction>;
        Insert: Insert<Transaction, Generated | "occurred_at" | "note" | "category_id">;
        Update: Update<Transaction>;
      };
      budgets: {
        Row: Row<Budget>;
        Insert: Insert<Budget, Generated>;
        Update: Update<Budget>;
      };
      goals: {
        Row: Row<Goal>;
        Insert: Insert<Goal, Generated | "status" | "color" | "icon" | "target_date">;
        Update: Update<Goal>;
      };
      goal_contributions: {
        Row: Row<GoalContribution>;
        Insert: Insert<GoalContribution, Generated | "occurred_at" | "note">;
        Update: Update<GoalContribution>;
      };
      emis: {
        Row: Row<Emi>;
        Insert: Insert<Emi, Generated | "months_paid" | "principal" | "day_of_month" | "interest_rate" | "start_date">;
        Update: Update<Emi>;
      };
      emi_payments: {
        Row: Row<EmiPayment>;
        Insert: Insert<EmiPayment, Generated | "paid_on">;
        Update: Update<EmiPayment>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      tx_kind: TxKind;
      goal_status: GoalStatus;
    };
  };
}
