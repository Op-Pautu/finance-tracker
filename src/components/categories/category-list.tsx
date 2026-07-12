import { CategoryIcon } from "@/components/shared/category-icon";
import type { Category } from "@/types/db";

export function CategoryList({ categories }: { categories: Category[] }) {
  const expense = categories.filter((c) => c.kind === "expense");
  const income = categories.filter((c) => c.kind === "income");

  return (
    <div className="space-y-4">
      <Group title="Expense" categories={expense} />
      <Group title="Income" categories={income} />
    </div>
  );
}

function Group({
  title,
  categories,
}: {
  title: string;
  categories: Category[];
}) {
  if (categories.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm"
          >
            <CategoryIcon icon={c.icon} color={c.color} size="sm" />
            <span className="text-foreground">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
