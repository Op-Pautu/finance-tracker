/**
 * Database types for the Supabase schema (see supabase/migrations/0001_init.sql).
 * Hand-authored to match the migration. Once the project is live you can
 * regenerate with: `supabase gen types typescript --project-id <ref> > src/types/db.ts`.
 */

export type TxKind = "income" | "expense";
export type GoalStatus = "active" | "done" | "archived";

export type Profile = {
  id: string;
  display_name: string | null;
  currency: string;
  avatar_url: string | null;
  monthly_income: number;
  onboarding_done: boolean;
  created_at: string;
}

export type Category = {
  id: string;
  user_id: string;
  name: string;
  kind: TxKind;
  color: string;
  icon: string;
  is_default: boolean;
  created_at: string;
}

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  kind: TxKind;
  category_id: string | null;
  note: string | null;
  occurred_at: string;
  created_at: string;
}

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  month: string; // first day of month, ISO date
  amount: number;
  created_at: string;
}

export type Goal = {
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

export type GoalContribution = {
  id: string;
  user_id: string;
  goal_id: string;
  amount: number;
  occurred_at: string;
  note: string | null;
  created_at: string;
}

export type Emi = {
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

export type EmiPayment = {
  id: string;
  user_id: string;
  emi_id: string;
  amount: number;
  paid_on: string;
  created_at: string;
}

type Insert<T, Optional extends keyof T> = Omit<T, Optional> &
  Partial<Pick<T, Optional>>;

/**
 * Shape supabase-js expects per table (Row/Insert/Update/Relationships).
 * The Relationships field is required by the client's generics — omitting it
 * collapses query inference to `never`.
 */
type Table<R, Ins, Upd = Partial<R>> = {
  Row: R;
  Insert: Ins;
  Update: Upd;
  Relationships: [];
};

/** Columns the DB fills in automatically (safe to omit on insert). */
type Generated = "id" | "created_at";

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, Insert<Profile, "created_at">>;
      categories: Table<
        Category,
        Insert<Category, Generated | "is_default" | "color" | "icon">
      >;
      transactions: Table<
        Transaction,
        Insert<Transaction, Generated | "occurred_at" | "note" | "category_id">
      >;
      budgets: Table<Budget, Insert<Budget, Generated>>;
      goals: Table<
        Goal,
        Insert<Goal, Generated | "status" | "color" | "icon" | "target_date">
      >;
      goal_contributions: Table<
        GoalContribution,
        Insert<GoalContribution, Generated | "occurred_at" | "note">
      >;
      emis: Table<
        Emi,
        Insert<
          Emi,
          | Generated
          | "months_paid"
          | "principal"
          | "day_of_month"
          | "interest_rate"
          | "start_date"
        >
      >;
      emi_payments: Table<EmiPayment, Insert<EmiPayment, Generated | "paid_on">>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      tx_kind: TxKind;
      goal_status: GoalStatus;
    };
  };
}
