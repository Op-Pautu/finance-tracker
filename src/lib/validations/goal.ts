import { z } from "zod";

export const goalSchema = z.object({
  name: z.string().trim().min(1, "Give your goal a name").max(60),
  target_amount: z
    .number({ error: "Enter a target amount" })
    .positive("Enter an amount greater than 0")
    .max(100_000_000_000, "That's a bit too large"),
  target_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
    .optional()
    .or(z.literal("")),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid colour"),
  icon: z.string().min(1).max(40),
});

export const contributionSchema = z.object({
  goal_id: z.string().uuid(),
  amount: z
    .number({ error: "Enter an amount" })
    .positive("Enter an amount greater than 0")
    .max(100_000_000_000, "That's a bit too large"),
  occurred_at: z.string().min(1, "Pick a date"),
  note: z.string().trim().max(140).optional(),
});

export type GoalValues = z.infer<typeof goalSchema>;
export type ContributionValues = z.infer<typeof contributionSchema>;
