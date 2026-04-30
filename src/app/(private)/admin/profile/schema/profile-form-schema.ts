import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  role: z.any().optional(),
  email: z.any().optional(),
  phone: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  bio: z.string().trim().optional().or(z.literal(""))
});

export type AdminProfileFormValues = z.infer<typeof profileFormSchema>;
