import type { ScoringSettings } from "@/types";

export const DEFAULT_SCORING_SETTINGS: ScoringSettings = {
  winPoints: 1,
  koTkoBonus: 0,
  finishBonus: 1,
  decisionWin: 0,
  winningChampionshipBout: 1,
  championVsChampionWin: 6,
  nonChampionshipFight: 0,
  winningAgainstRankedOpponent: 1,
  fightingUnrankedOpponent: 0,
  winningFiveRoundFight: 1,
  threeRoundFight: 0
};
