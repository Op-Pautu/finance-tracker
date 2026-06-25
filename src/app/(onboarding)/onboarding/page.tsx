import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/supabase/auth";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = { title: "Welcome" };

export default async function OnboardingPage() {
  const { user, profile } = await getCurrentProfile();
  const name = profile?.display_name || user.email?.split("@")[0] || "";
  const income = profile?.monthly_income ? Number(profile.monthly_income) : 0;

  return <OnboardingWizard defaultName={name} defaultIncome={income} />;
}
