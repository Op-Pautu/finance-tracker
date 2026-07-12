import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Inline form field error: icon + message, so color isn't the only signal. */
export function FieldError({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      className={cn(
        "flex items-center gap-1 text-xs text-expense",
        className,
      )}
    >
      <CircleAlert className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}
