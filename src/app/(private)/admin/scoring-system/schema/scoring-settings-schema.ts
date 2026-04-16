import { z } from "zod";

const SCORE_MIN = 0;
const SCORE_MAX = 20;

const scoreField = z
  .number({ message: "Point value is required." })
  .int("Point value must be a whole number.")
  .min(SCORE_MIN, `Point value must be at least ${SCORE_MIN}.`)
  .max(SCORE_MAX, `Point value must be at most ${SCORE_MAX}.`);

export const scoringSettingsSchema = z.object({
  winPoints: scoreField,
  finishBonus: scoreField,
  winningChampionshipBout: scoreField,
  championVsChampionWin: scoreField,
  winningAgainstRankedOpponent: scoreField,
  winningFiveRoundFight: scoreField
});
