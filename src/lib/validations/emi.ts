import { z } from "zod";

export const emiSchema = z
  .object({
    name: z.string().trim().min(1, "Name your EMI").max(60),
    monthly_amount: z
      .number({ error: "Enter the monthly amount" })
      .positive("Enter an amount greater than 0")
      .max(100_000_000_000, "That's a bit too large"),
    total_months: z
      .number({ error: "Enter the number of months" })
      .int("Use whole months")
      .min(1, "At least 1 month")
      .max(600, "That's too many months"),
    months_paid: z
      .number({ error: "Enter months paid" })
      .int("Use whole months")
      .min(0, "Can't be negative"),
    start_date: z.string().min(1, "Pick a start date"),
    day_of_month: z
      .number()
      .int()
      .min(1)
      .max(31)
      .optional()
      .or(z.nan().transform(() => undefined)),
  })
  .refine((v) => v.months_paid <= v.total_months, {
    message: "Months paid can't exceed the total",
    path: ["months_paid"],
  });

export type EmiValues = z.infer<typeof emiSchema>;
