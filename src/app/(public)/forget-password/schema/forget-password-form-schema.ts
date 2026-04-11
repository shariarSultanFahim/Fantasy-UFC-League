import { z } from "zod";

export const forgetPasswordFormSchema = z.object({
  email: z.email("Enter a valid email address.")
});

export type ForgetPasswordFormValues = z.infer<typeof forgetPasswordFormSchema>;
