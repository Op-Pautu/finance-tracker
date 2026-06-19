import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/db";

/**
 * Returns the signed-in user, redirecting to /login if there isn't one.
 * Use in protected Server Components / layouts as the auth gate.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return { user, supabase };
}

/** Current user + their profile row (profile is created at signup by trigger). */
export async function getCurrentProfile(): Promise<{
  user: Awaited<ReturnType<typeof requireUser>>["user"];
  profile: Profile | null;
}> {
  const { user, supabase } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile };
}
