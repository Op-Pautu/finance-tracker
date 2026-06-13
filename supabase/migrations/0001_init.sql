-- ============================================================================
-- FinTrack — initial schema
-- Multi-tenant: every table is scoped by user_id and protected by RLS so a
-- signed-in user can only ever read/write their own rows.
-- Apply via Supabase Dashboard → SQL Editor, or `supabase db push` with the CLI.
-- ============================================================================

-- ── profiles ────────────────────────────────────────────────────────────────
-- One row per auth user. Created automatically by the handle_new_user trigger.
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  display_name    text,
  currency        text        not null default 'INR',
  avatar_url      text,
  monthly_income  numeric(12, 2) not null default 0,
  onboarding_done boolean     not null default false,
  created_at      timestamptz not null default now()
);

-- ── categories ──────────────────────────────────────────────────────────────
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users (id) on delete cascade,
  name       text        not null,
  kind       text        not null check (kind in ('income', 'expense')),
  color      text        not null default '#0E8C6E',
  icon       text        not null default 'tag',
  is_default boolean     not null default false,
  created_at timestamptz not null default now()
);
create index if not exists categories_user_idx on public.categories (user_id);

-- ── transactions ────────────────────────────────────────────────────────────
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  amount      numeric(12, 2) not null check (amount >= 0),
  kind        text        not null check (kind in ('income', 'expense')),
  category_id uuid        references public.categories (id) on delete set null,
  note        text,
  occurred_at date        not null default current_date,
  created_at  timestamptz not null default now()
);
create index if not exists transactions_user_date_idx
  on public.transactions (user_id, occurred_at desc);

-- ── budgets ─────────────────────────────────────────────────────────────────
-- One budget per category per month (month stored as the 1st of the month).
create table if not exists public.budgets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  category_id uuid        not null references public.categories (id) on delete cascade,
  month       date        not null,
  amount      numeric(12, 2) not null check (amount >= 0),
  created_at  timestamptz not null default now(),
  unique (user_id, category_id, month)
);
create index if not exists budgets_user_month_idx on public.budgets (user_id, month);

-- ── goals ───────────────────────────────────────────────────────────────────
create table if not exists public.goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users (id) on delete cascade,
  name          text        not null,
  target_amount numeric(12, 2) not null check (target_amount > 0),
  target_date   date,
  color         text        not null default '#E0962F',
  icon          text        not null default 'target',
  status        text        not null default 'active'
                  check (status in ('active', 'done', 'archived')),
  created_at    timestamptz not null default now()
);
create index if not exists goals_user_idx on public.goals (user_id);

-- ── goal_contributions ──────────────────────────────────────────────────────
create table if not exists public.goal_contributions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  goal_id     uuid        not null references public.goals (id) on delete cascade,
  amount      numeric(12, 2) not null check (amount > 0),
  occurred_at date        not null default current_date,
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists goal_contributions_goal_idx
  on public.goal_contributions (goal_id);

-- ── emis (installment loans) ────────────────────────────────────────────────
create table if not exists public.emis (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users (id) on delete cascade,
  name          text        not null,
  principal     numeric(12, 2),
  monthly_amount numeric(12, 2) not null check (monthly_amount >= 0),
  total_months  int         not null check (total_months > 0),
  months_paid   int         not null default 0 check (months_paid >= 0),
  start_date    date        not null default current_date,
  day_of_month  int         check (day_of_month between 1 and 31),
  interest_rate numeric(5, 2),
  created_at    timestamptz not null default now()
);
create index if not exists emis_user_idx on public.emis (user_id);

-- ── emi_payments ────────────────────────────────────────────────────────────
create table if not exists public.emi_payments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users (id) on delete cascade,
  emi_id     uuid        not null references public.emis (id) on delete cascade,
  amount     numeric(12, 2) not null check (amount >= 0),
  paid_on    date        not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists emi_payments_emi_idx on public.emi_payments (emi_id);

-- ============================================================================
-- Row Level Security — owner-only access on every table.
-- ============================================================================
alter table public.profiles           enable row level security;
alter table public.categories         enable row level security;
alter table public.transactions       enable row level security;
alter table public.budgets            enable row level security;
alter table public.goals              enable row level security;
alter table public.goal_contributions enable row level security;
alter table public.emis               enable row level security;
alter table public.emi_payments       enable row level security;

-- profiles keyed on id (= auth uid)
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- helper: identical owner policies for the user_id-scoped tables
do $$
declare
  t text;
begin
  foreach t in array array[
    'categories', 'transactions', 'budgets', 'goals',
    'goal_contributions', 'emis', 'emi_payments'
  ]
  loop
    execute format(
      'create policy %1$I on public.%2$I for select using (auth.uid() = user_id);',
      t || '_select_own', t);
    execute format(
      'create policy %1$I on public.%2$I for insert with check (auth.uid() = user_id);',
      t || '_insert_own', t);
    execute format(
      'create policy %1$I on public.%2$I for update using (auth.uid() = user_id) with check (auth.uid() = user_id);',
      t || '_update_own', t);
    execute format(
      'create policy %1$I on public.%2$I for delete using (auth.uid() = user_id);',
      t || '_delete_own', t);
  end loop;
end$$;

-- ============================================================================
-- New-user bootstrap: create a profile + seed a starter set of categories.
-- SECURITY DEFINER so it can write rows on the new user's behalf at signup.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );

  insert into public.categories (user_id, name, kind, color, icon, is_default)
  values
    -- expense
    (new.id, 'Food & Dining', 'expense', '#DD6B4D', 'utensils',     true),
    (new.id, 'Rent & Housing', 'expense', '#7C6BA0', 'house',        true),
    (new.id, 'Transport',      'expense', '#5B6472', 'bus',          true),
    (new.id, 'Bills & Utilities','expense','#0E8C6E', 'receipt',     true),
    (new.id, 'Shopping',       'expense', '#E0962F', 'shopping-bag', true),
    (new.id, 'Health',         'expense', '#C0506B', 'heart-pulse',  true),
    (new.id, 'Entertainment',  'expense', '#4F8DD0', 'clapperboard', true),
    (new.id, 'Education',      'expense', '#3FA796', 'graduation-cap',true),
    (new.id, 'Tithe & Giving', 'expense', '#A67C52', 'hand-heart',   true),
    (new.id, 'Other',          'expense', '#9AA0A6', 'ellipsis',     true),
    -- income
    (new.id, 'Salary',         'income',  '#0E8C6E', 'wallet',       true),
    (new.id, 'Freelance',      'income',  '#3FA796', 'laptop',       true),
    (new.id, 'Investments',    'income',  '#7C6BA0', 'trending-up',  true),
    (new.id, 'Other Income',   'income',  '#9AA0A6', 'circle-plus',  true);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
