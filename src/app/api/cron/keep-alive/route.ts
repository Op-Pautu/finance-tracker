import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";

/**
 * Vercel Cron hits this daily so Supabase sees regular activity and doesn't
 * pause the free-tier project after a week of inactivity. Vercel sends
 * `Authorization: Bearer ${CRON_SECRET}` on cron-triggered requests.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
  );

  // A real query against Postgres — RLS returns zero rows for the anon key,
  // but that's fine, the request itself is what counts as activity.
  const { error } = await supabase.from("profiles").select("id").limit(1);
  if (error) return new Response(error.message, { status: 500 });

  return new Response("ok");
}
