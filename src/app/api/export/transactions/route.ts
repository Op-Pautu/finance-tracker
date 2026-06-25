import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import type { TxWithCategory } from "@/lib/queries/dashboard";

/** Escape a value for safe CSV output. */
function csvCell(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** GET /api/export/transactions → downloads the user's transactions as CSV. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data } = await supabase
    .from("transactions")
    .select("*, category:categories(id, name, color, icon)")
    .eq("user_id", user.id)
    .order("occurred_at", { ascending: false });

  const rows = (data ?? []) as unknown as TxWithCategory[];

  const header = ["Date", "Type", "Category", "Note", "Amount"];
  const lines = rows.map((tx) =>
    [
      tx.occurred_at,
      tx.kind,
      tx.category?.name ?? "Uncategorized",
      tx.note ?? "",
      Number(tx.amount),
    ]
      .map(csvCell)
      .join(","),
  );
  const csv = [header.join(","), ...lines].join("\n");

  const filename = `fintrack-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
