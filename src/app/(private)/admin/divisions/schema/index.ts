import { z } from "zod";

export const divisionSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
});

export type DivisionFormValues = z.infer<typeof divisionSchema>;
