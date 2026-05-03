import { z } from "zod";

export const fighterFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  nickname: z.string().trim().min(2, "Nickname must be at least 2 characters."),
  nationality: z.string().trim().min(1, "Select nationality."),
  divisionId: z.string().trim().min(1, "Select division."),
  rank: z.number().min(1, "Rank must be at least 1.").max(30, "Rank must be 30 or lower.").nullable(),
  wins: z.number().min(0, "Wins cannot be negative."),
  losses: z.number().min(0, "Losses cannot be negative."),
  draws: z.number().min(0, "Draws cannot be negative."),
  avgL5: z.number().min(0, "Points cannot be negative."),
  bio: z.string().trim().min(20, "Bio must be at least 20 characters.").nullable(),
  age: z.number().min(18, "Fighter must be at least 18.").max(60, "Age is too high.").nullable(),
  height: z.string().trim().min(1, "Enter height.").nullable(),
  avatarDataUrl: z.string().optional(),
  isActive: z.boolean(),
});

export type FighterFormValues = z.infer<typeof fighterFormSchema>;

export type FighterFormInput = z.input<typeof fighterFormSchema>;
