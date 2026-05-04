export interface ISystemScoringSetting {
  id: string;
  winPoint: number;
  finishBonus: number;
  winningChampionshipBout: number;
  championVsChampionWin: number;
  winningAgainstRankedOpponent: number;
  winningFiveRoundFight: number;
  createdAt: string;
  updatedAt: string;
}

export type ScoringSettings = Omit<ISystemScoringSetting, "id" | "createdAt" | "updatedAt">;

export interface ISystemScoringResponse {
  success: boolean;
  message: string;
  data: ISystemScoringSetting;
}
