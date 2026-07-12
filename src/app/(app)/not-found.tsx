import { Compass } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function AppNotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 items-center py-12">
      <EmptyState
        icon={Compass}
        title="We couldn't find that page"
        description="It may have been moved, or the link might be outdated."
        action={{ label: "Back to dashboard", href: "/dashboard" }}
        className="w-full"
      />
    </div>
  );
}
