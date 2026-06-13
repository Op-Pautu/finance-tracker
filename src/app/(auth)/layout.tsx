import Link from "next/link";
import { Logo } from "@/components/shared/logo";

/**
 * Split auth layout: a calm form panel on the left, a branded "value" panel
 * on the right (hidden on small screens).
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-full flex-1 lg:grid-cols-2">
      {/* form panel */}
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to keep your finances tidy. 🌱
        </p>
      </div>

      {/* brand panel */}
      <div className="bg-grain relative hidden flex-col justify-between overflow-hidden bg-primary/95 p-12 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-black/10 blur-3xl"
        />

        <Link href="/" className="relative text-sm font-medium opacity-80 hover:opacity-100">
          ← Back home
        </Link>

        <div className="relative max-w-md">
          <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight">
            A calm, clear view of where your money actually goes.
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Track spending, set budgets, hit savings goals and stay on top of
            EMIs — all in one tidy place built for real life.
          </p>

          <div className="mt-8 flex items-center gap-6 text-sm">
            <Stat label="Spending clarity" value="At a glance" />
            <span className="h-8 w-px bg-white/20" />
            <Stat label="Made for" value="₹ India" />
          </div>
        </div>

        <p className="relative text-sm text-primary-foreground/70">
          “What gets measured gets managed.”
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-base font-semibold">{value}</p>
      <p className="text-primary-foreground/70">{label}</p>
    </div>
  );
}
