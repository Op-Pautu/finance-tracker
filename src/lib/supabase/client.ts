import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/db";

/**
 * Supabase client for use in Client Components (browser).
 * Reads the public env vars, which are safe to expose — RLS protects the data.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
