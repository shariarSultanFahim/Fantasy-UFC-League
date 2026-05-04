import type { ScoringSettings } from "@/types";

export type ScoringCriteriaKey = keyof ScoringSettings;

export interface ScoringCriterion {
  key: ScoringCriteriaKey;
  title: string;
  description: string;
}

export const SCORING_CRITERIA: ScoringCriterion[] = [
  {
    key: "winPoint",
    title: "Win Point",
    description: "Base point awarded for a victory."
  },
  {
    key: "finishBonus",
    title: "Finish Bonus",
    description: "Extra point for KO/TKO/SUB/DQ or stoppage wins."
  },
  {
    key: "winningChampionshipBout",
    title: "Winning Championship Bout",
    description: "Extra point for title fight (interim or undisputed championship) victories."
  },
  {
    key: "championVsChampionWin",
    title: "Champion vs Champion Win",
    description: "Rare extra point for champion moves up or down a division and wins title fight (interim or undisputed) in that division."
  },
  {
    key: "winningAgainstRankedOpponent",
    title: "Winning Against Ranked Opponent",
    description: "Extra point for defeating a ranked fighter."
  },
  {
    key: "winningFiveRoundFight",
    title: "Winning a 5 Round Fight",
    description: "Extra point for five-round bout victories."
  }
];
