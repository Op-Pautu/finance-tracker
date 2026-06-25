# FinTrack

A clean, modern personal finance tracker — know where your money goes, set budgets,
hit savings goals, and stay on top of EMIs. Built as a multi-tenant SaaS: anyone can
sign up and only ever sees their own data.

> Currency: **INR (₹)**. Light, card-based UI with a jade/terracotta palette and a
> ledger-style monospaced numerals.

## Features

- **Dashboard** — balance, monthly income/spend/savings, spending breakdown donut,
  recent activity, plus budget and EMI watch cards.
- **Transactions** — full CRUD with categories, month/type/category filters and note
  search, all driven through the URL.
- **Budgets** — per-category monthly limits with over/under progress and a dashboard
  summary.
- **Goals** — savings goals with progress rings, contributions, and a detail page with
  payoff projection.
- **EMIs** — loan/installment tracker with payoff countdown, monthly outflow and
  one-tap "mark paid".
- **Analytics** — 6-month income-vs-spending trend, month-over-month comparison, and a
  category breakdown.
- **Settings** — editable profile (name, monthly income).

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, `src/`) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (Base UI primitives) |
| Backend | Supabase (Postgres + Auth + Row Level Security) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Deploy | Vercel + Supabase (free tiers) |

The app is **security-by-database**: every table is scoped by `user_id` and protected
by RLS, so multi-tenancy is enforced in Postgres rather than app code.

## Getting started

1. **Install**
   ```bash
   npm install
   ```

2. **Set up Supabase** — follow [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md):
   create a project, run [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   in the SQL editor, and copy your keys into `.env.local` (see [`.env.example`](.env.example)).

3. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000), sign up, and start tracking.

## Project structure

```
src/
  app/
    (marketing)         landing page
    (auth)              login / signup
    (app)               authed shell: dashboard, transactions, budget,
                        goals, emis, analytics, settings
  components/           ui (shadcn) + feature components
  lib/
    supabase/           browser/server clients, auth helpers
    queries/            server-side data reads
    actions/            server actions (mutations)
    validations/        zod schemas
supabase/migrations/    database schema, RLS, triggers
```

## Deploying to Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add the env vars from `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL` = your Vercel URL).
3. In Supabase → Authentication → URL Configuration, set the Site URL and add your
   Vercel URL to the redirect allow-list.
4. Deploy.

## Roadmap

Recurring transactions, CSV import, Claude-powered monthly insights, investment /
net-worth tracking, weekly email digests, and a Pro tier.
