import { z } from "zod";

export const LEAGUE_SIZE_OPTIONS = ["8", "10", "12", "16"] as const;
export const DRAFT_TYPE_OPTIONS = ["snake", "auction"] as const;
export const PICK_TIME_LIMIT_OPTIONS = ["30", "45", "60", "90"] as const;

export const createLeagueFormSchema = z
  .object({
    leagueName: z.string().trim().min(3, "League name must be at least 3 characters."),
    leagueSize: z.enum(LEAGUE_SIZE_OPTIONS, {
      error: "Select a league size."
    }),
    leagueType: z.enum(["public", "private"], {
      error: "Select a league type."
    }),
    draftType: z.enum(DRAFT_TYPE_OPTIONS, {
      error: "Select a draft type."
    }),
    draftDate: z.string().min(1, "Draft date is required."),
    draftTime: z.string().min(1, "Draft time is required."),
    pickTimeLimit: z.enum(PICK_TIME_LIMIT_OPTIONS, {
      error: "Select a pick time limit."
    }),
    passcode: z.string().optional()
  })
  .superRefine((value, context) => {
    if (value.leagueType !== "private") {
      return;
    }

    const passcode = value.passcode?.trim() ?? "";

    if (passcode.length < 4) {
      context.addIssue({
        code: "custom",
        path: ["passcode"],
        message: "Passcode must be at least 4 characters for private leagues."
      });
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(passcode)) {
      context.addIssue({
        code: "custom",
        path: ["passcode"],
        message: "Passcode must use letters and numbers only."
      });
    }
  });

export type CreateLeagueFormValues = z.infer<typeof createLeagueFormSchema>;
