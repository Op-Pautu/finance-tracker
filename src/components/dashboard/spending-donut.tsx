"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { formatINR, formatINRCompact, formatPercent } from "@/lib/format";
import type { CategorySpend } from "@/lib/queries/dashboard";

export function SpendingDonut({
  data,
  total,
}: {
  data: CategorySpend[];
  total: number;
}) {
  // Collapse a long tail into "Other" so the donut stays readable.
  const top = data.slice(0, 5);
  const rest = data.slice(5);
  const restTotal = rest.reduce((sum, c) => sum + c.total, 0);
  const slices = restTotal
    ? [...top, { categoryId: null, name: "Other", color: "#C0A988", total: restTotal }]
    : top;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative size-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={84}
              paddingAngle={slices.length > 1 ? 2 : 0}
              strokeWidth={0}
            >
              {slices.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted-foreground">Spent</span>
          <span className="tabular text-lg font-semibold text-foreground">
            {formatINRCompact(total)}
          </span>
        </div>
      </div>

      <ul className="flex w-full flex-1 flex-col gap-2.5">
        {slices.map((slice) => {
          const pct = total > 0 ? (slice.total / total) * 100 : 0;
          return (
            <li key={slice.name} className="flex items-center gap-3 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="min-w-0 flex-1 truncate text-foreground">
                {slice.name}
              </span>
              <span className="tabular text-muted-foreground">
                {formatPercent(pct)}
              </span>
              <span className="tabular w-20 text-right font-medium text-foreground">
                {formatINR(slice.total)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
