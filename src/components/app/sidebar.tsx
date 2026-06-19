import { Logo } from "@/components/shared/logo";
import { NavLinks } from "@/components/app/nav-links";
import { UserMenu } from "@/components/app/user-menu";

/** Fixed desktop sidebar (hidden on < lg). */
export function Sidebar({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email: string;
  avatarUrl?: string | null;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 pb-3">
        <NavLinks />
      </div>
      <div className="border-t border-sidebar-border p-2">
        <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
      </div>
    </aside>
  );
}
