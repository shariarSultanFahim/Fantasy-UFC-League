import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  role: z.string().trim().min(2, "Role must be at least 2 characters."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Phone number must be at least 7 characters."),
  location: z.string().trim().min(2, "Location must be at least 2 characters."),
  bio: z.string().trim().min(20, "Bio must be at least 20 characters.")
});
