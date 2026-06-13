import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * FinTrack wordmark. The mark is a stylized upward "ledger bar" — a small
 * custom SVG so the brand doesn't lean on a generic icon-library glyph.
 */
export function Logo({
  className,
  href = "/",
  showWord = true,
}: {
  className?: string;
  href?: string | null;
  showWord?: boolean;
}) {
  const inner = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground shadow-card">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-4"
          aria-hidden="true"
        >
          <rect x="4" y="13" width="3.2" height="6" rx="1.2" fill="currentColor" />
          <rect x="10.4" y="9" width="3.2" height="10" rx="1.2" fill="currentColor" />
          <rect x="16.8" y="5" width="3.2" height="14" rx="1.2" fill="currentColor" opacity="0.85" />
        </svg>
      </span>
      {showWord && (
        <span className="font-heading text-lg font-semibold tracking-tight">
          Fin<span className="text-primary">Track</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {inner}
      </Link>
    );
  }
  return inner;
}
