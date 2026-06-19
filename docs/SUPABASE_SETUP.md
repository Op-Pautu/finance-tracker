# Supabase setup

One-time backend setup. Takes ~5 minutes.

## 1. Create the project
1. Go to [supabase.com](https://supabase.com) → **New project** (free tier is fine).
2. Pick a region close to you, set a database password, create.

## 2. Add your keys locally
Copy `.env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...                 # Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...     # Settings → API Keys → publishable (sb_publishable_...)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Key naming:** Supabase is retiring the legacy `anon` / `service_role` JWT
> keys (removal slated for late 2026) in favour of new **publishable**
> (`sb_publishable_...`) and **secret** (`sb_secret_...`) keys. Use the
> publishable key here. If your project only shows an `anon` key, set
> `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead — the app falls back to it.

## 3. Create the schema
Open **SQL Editor** in the Supabase dashboard → paste the contents of
[`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) → **Run**.

This creates all tables, enables Row Level Security (owner-only access), and adds
a trigger that — on every new signup — creates the user's profile and seeds a
starter set of spending/income categories.

## 4. Auth configuration
**Authentication → Sign In / Providers:**
- **Email**: enabled by default. For the smoothest local testing you can turn
  **"Confirm email" OFF** (Auth → Providers → Email) so signups log in instantly.
  Leave it ON for production.
- **Google** (optional but recommended): enable the provider and paste a Google
  OAuth client ID/secret ([console.cloud.google.com](https://console.cloud.google.com)
  → Credentials → OAuth client → Web). Add this authorized redirect URI:
  `https://<your-project-ref>.supabase.co/auth/v1/callback`

**Authentication → URL Configuration:**
- **Site URL**: `http://localhost:3000` (dev) — change to your Vercel URL in prod.
- **Redirect URLs**: add `http://localhost:3000/**` and your Vercel
  `https://<app>.vercel.app/**`.

## 5. Run it
```
npm run dev
```
Visit http://localhost:3000 → sign up → you should land on `/dashboard` (built in
Phase 2). Until then, the protected routes redirect to `/login`.

---

### Production (Vercel)
Add the same three `NEXT_PUBLIC_*` env vars in the Vercel project settings, set
`NEXT_PUBLIC_SITE_URL` to your deployed URL, and update the Supabase Site URL /
redirect URLs accordingly.
