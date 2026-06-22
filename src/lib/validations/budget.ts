import { z } from "zod";

export const budgetSchema = z.object({
  category_id: z.string().uuid("Pick a category"),
  amount: z
    .number({ error: "Enter an amount" })
    .positive("Enter an amount greater than 0")
    .max(100_000_000_000, "That's a bit too large"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Invalid month"),
});

export type BudgetValues = z.infer<typeof budgetSchema>;
