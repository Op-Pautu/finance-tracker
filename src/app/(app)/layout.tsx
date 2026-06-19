import { getCurrentProfile } from "@/lib/supabase/auth";
import { Sidebar } from "@/components/app/sidebar";
import { MobileNav } from "@/components/app/mobile-nav";
import { UserMenu } from "@/components/app/user-menu";
import { Logo } from "@/components/shared/logo";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getCurrentProfile();

  const name =
    profile?.display_name || user.email?.split("@")[0] || "there";
  const email = user.email ?? "";
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div className="min-h-full flex-1 bg-background">
      <Sidebar name={name} email={email} avatarUrl={avatarUrl} />

      <div className="flex min-h-full flex-1 flex-col lg:pl-64">
        {/* mobile top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-2">
            <MobileNav />
            <Logo />
          </div>
          <UserMenu
            name={name}
            email={email}
            avatarUrl={avatarUrl}
            variant="compact"
          />
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
