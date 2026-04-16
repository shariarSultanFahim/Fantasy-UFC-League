import type { ScoringSettings } from "@/types";

export type ScoringCriteriaKey = keyof ScoringSettings;

export interface ScoringCriterion {
  key: ScoringCriteriaKey;
  title: string;
  description: string;
}

export const SCORING_CRITERIA: ScoringCriterion[] = [
  {
    key: "winPoints",
    title: "Win Points",
    description: "Base points awarded for a victory."
  },
  {
    key: "koTkoBonus",
    title: "KO/TKO Bonus",
    description: "Additional points for knockout wins."
  },
  {
    key: "finishBonus",
    title: "Finish Bonus",
    description: "Extra points for submission or stoppage."
  },
  {
    key: "decisionWin",
    title: "Decision Win",
    description: "Points for wins by judges decision."
  },
  {
    key: "winningChampionshipBout",
    title: "Winning Championship Bout",
    description: "Bonus points for title fight victories."
  },
  {
    key: "championVsChampionWin",
    title: "Champion vs Champion Win",
    description: "Bonus points for rare champion vs champion victories."
  },
  {
    key: "nonChampionshipFight",
    title: "Non Championship Fight",
    description: "Points for a standard non-title win."
  },
  {
    key: "winningAgainstRankedOpponent",
    title: "Winning Against Ranked Opponent",
    description: "Bonus for defeating a ranked fighter."
  },
  {
    key: "fightingUnrankedOpponent",
    title: "Fighting Unranked Opponent",
    description: "Adjuster for matches versus unranked fighters."
  },
  {
    key: "winningFiveRoundFight",
    title: "Winning a 5 Round Fight",
    description: "Extra points for five-round victories."
  },
  {
    key: "threeRoundFight",
    title: "3 Round Fight",
    description: "Adjuster for standard three-round fights."
  }
];
