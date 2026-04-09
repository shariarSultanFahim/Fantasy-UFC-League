import { z } from "zod";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const boutFormSchema = z
  .object({
    fighter1Id: z.string().trim().min(1, "Select Fighter 1."),
    fighter2Id: z.string().trim().min(1, "Select Fighter 2."),
    weightClass: z.string().trim().min(1, "Select weight class."),
    rounds: z
      .number("Rounds must be a number.")
      .min(1, "Rounds must be at least 1.")
      .max(5, "Rounds must be 5 or lower."),
    isMainEvent: z.boolean(),
    isCoMainEvent: z.boolean(),
    winnerId: z.string().trim()
  })
  .superRefine((bout, context) => {
    if (bout.fighter1Id && bout.fighter2Id && bout.fighter1Id === bout.fighter2Id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fighter 1 and Fighter 2 must be different.",
        path: ["fighter2Id"]
      });
    }

    if (bout.isMainEvent && bout.isCoMainEvent) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A bout cannot be both Main Event and Co-Main Event.",
        path: ["isCoMainEvent"]
      });
    }

    if (bout.winnerId && bout.winnerId !== bout.fighter1Id && bout.winnerId !== bout.fighter2Id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Winner must be one of the two selected fighters.",
        path: ["winnerId"]
      });
    }
  });

const baseEventFormSchema = z
  .object({
    name: z.string().trim().min(3, "Event name must be at least 3 characters."),
    location: z.string().trim().min(2, "Location must be at least 2 characters."),
    date: z
      .string()
      .trim()
      .min(1, "Date is required.")
      .regex(datePattern, "Date must use YYYY-MM-DD format."),
    posterDataUrl: z.string().min(1, "Upload and crop a 16:9 poster."),
    bouts: z.array(boutFormSchema).min(1, "Add at least one bout.")
  })
  .superRefine((eventForm, context) => {
    const mainEventCount = eventForm.bouts.filter((bout) => bout.isMainEvent).length;

    if (mainEventCount > 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only one bout can be marked as Main Event.",
        path: ["bouts"]
      });
    }

    const coMainEventCount = eventForm.bouts.filter((bout) => bout.isCoMainEvent).length;

    if (coMainEventCount > 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only one bout can be marked as Co-Main Event.",
        path: ["bouts"]
      });
    }
  });

export function getEventFormSchema(mode: "create" | "edit") {
  return baseEventFormSchema.superRefine((eventForm, context) => {
    if (mode === "edit") {
      eventForm.bouts.forEach((bout, index) => {
        if (!bout.winnerId) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Select a winner for this bout.",
            path: ["bouts", index, "winnerId"]
          });
          return;
        }

        if (bout.winnerId !== bout.fighter1Id && bout.winnerId !== bout.fighter2Id) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Winner must be one of the selected fighters.",
            path: ["bouts", index, "winnerId"]
          });
        }
      });
    }
  });
}

export type EventFormValues = z.infer<typeof baseEventFormSchema>;
