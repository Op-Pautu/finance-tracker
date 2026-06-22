import { z } from "zod";

export const transactionSchema = z.object({
  kind: z.enum(["income", "expense"]),
  amount: z
    .number({ error: "Enter an amount" })
    .positive("Enter an amount greater than 0")
    .max(100_000_000_000, "That's a bit too large"),
  category_id: z.string().uuid("Pick a category"),
  occurred_at: z.string().min(1, "Pick a date"),
  note: z.string().trim().max(140, "Keep notes under 140 characters").optional(),
});

export type TransactionValues = z.infer<typeof transactionSchema>;
