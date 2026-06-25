import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/auth";
import { Logo } from "@/components/shared/logo";

/**
 * Minimal centered shell for the onboarding flow. Requires auth (via
 * getCurrentProfile) and sends already-onboarded users straight to the app.
 */
export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getCurrentProfile();
  if (profile?.onboarding_done) redirect("/dashboard");

  return (
    <div className="bg-grain flex min-h-full flex-1 flex-col px-6">
      <header className="mx-auto w-full max-w-md py-6">
        <Logo href={null} />
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 items-center pb-16">
        {children}
      </main>
    </div>
  );
}
