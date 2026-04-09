import { z } from "zod";

export const fighterFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  nickname: z.string().trim().min(2, "Nickname must be at least 2 characters."),
  nationality: z.string().trim().min(1, "Select nationality."),
  division: z.string().trim().min(1, "Select division."),
  rank: z.number().min(1, "Rank must be at least 1.").max(30, "Rank must be 30 or lower."),
  wins: z.number().min(0, "Wins cannot be negative."),
  losses: z.number().min(0, "Losses cannot be negative."),
  draws: z.number().min(0, "Draws cannot be negative."),
  points: z.number().min(0, "Points cannot be negative."),
  bio: z.string().trim().min(20, "Bio must be at least 20 characters."),
  avatarDataUrl: z.string().min(1, "Upload and crop a square image.")
});

export type FighterFormValues = z.infer<typeof fighterFormSchema>;

export type FighterFormInput = z.input<typeof fighterFormSchema>;