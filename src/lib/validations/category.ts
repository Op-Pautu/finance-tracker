import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Give it a name").max(40),
  kind: z.enum(["income", "expense"]),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid colour"),
  icon: z.string().min(1).max(40),
});

export type CategoryValues = z.infer<typeof categorySchema>;
