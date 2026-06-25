import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/auth";
import { signOutAction } from "@/lib/actions/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { ProfileForm } from "@/components/settings/profile-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { user, profile } = await getCurrentProfile();
  const name = profile?.display_name || user.email?.split("@")[0] || "";
  const income = profile?.monthly_income ? Number(profile.monthly_income) : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and account."
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This personalises your dashboard and savings insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultName={name} defaultIncome={income} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Row label="Email" value={user.email ?? "—"} />
          <Row label="Currency" value="Indian Rupee (₹)" />
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-sm font-medium text-foreground">Sign out</p>
              <p className="text-xs text-muted-foreground">
                End your session on this device.
              </p>
            </div>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" className="gap-1.5">
                <LogOut className="size-4" />
                Sign out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
