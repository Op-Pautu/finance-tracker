import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

/**
 * Friendly empty state used across pages instead of blank screens.
 * Optional CTA renders as a link-styled button.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="grid size-12 place-items-center rounded-full bg-accent text-primary">
        <Icon className="size-5" />
      </div>
      <p className="mt-4 font-heading text-base font-medium text-foreground">
        {title}
      </p>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <Link
          href={action.href}
          className={cn(buttonVariants({ size: "sm" }), "mt-5")}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
