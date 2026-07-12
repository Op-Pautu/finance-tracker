import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isValidRedirect(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

/**
 * OAuth / email-confirmation callback. Supabase redirects here with a `code`
 * which we exchange for a session cookie, then forward the user into the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const validNext = isValidRedirect(next) ? next : "/dashboard";
      return NextResponse.redirect(`${origin}${validNext}`);
    }
  }

  // Something went wrong — send them back to login with a flag.
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
