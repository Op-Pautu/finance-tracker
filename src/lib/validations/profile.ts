import { z } from "zod";

export const profileSchema = z.object({
  display_name: z.string().trim().min(1, "Enter your name").max(60),
  monthly_income: z
    .number({ error: "Enter your monthly income" })
    .min(0, "Can't be negative")
    .max(100_000_000_000, "That's a bit too large"),
});

export type ProfileValues = z.infer<typeof profileSchema>;
