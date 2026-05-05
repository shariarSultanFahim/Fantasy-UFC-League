export type LeagueStatus = "DRAFTING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type LeagueLobbyTab = "MY TEAM" | "FREE AGENTS" | "OPPOSING TEAM" | "LEADERBOARD";
export type LeagueLobbyActionStyle = "dark" | "muted";

export interface IScoringSettings {
  winPoints: number;
  finishBonus: number;
  winningChampionshipBout: number;
  championVsChampionWin: number;
  winningAgainstRankedOpponent: number;
  winningFiveRoundFight: number;
}

export interface ILeague {
  id: string;
  name: string;
  code: string;
  managerId: string;
  memberLimit: number;
  rosterSize: number;
  status: LeagueStatus;
  draftTime: string;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  manager?: any; // User details
  teams?: ITeam[]; // Leaderboard
  scoringSettings?: IScoringSettings;
}

import { IFighter } from "./fighter";

export interface ITeam {
  id: string;
  name: string;
  leagueId: string;
  ownerId: string;
  totalPoints: number;
  rank?: number;
  iconGlyph?: string;
  owner?: any; // User details
  fighters?: IFighter[];
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ILeagueResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ILeague;
}

export interface ILeagueListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: IMeta;
    data: ILeague[];
  };
}

export interface IAddFighterPayload {
  fighterId: string;
}

export interface IRemoveFighterPayload {
  fighterId: string;
}

export interface LeagueLobbyEntry {
  id: string;
  code: string;
  name: string;
  hasPasscode: boolean;
  passcode?: string;
  draftTime: string;
  members: number;
  memberLimit: number;
  actionLabel: string;
  actionStyle: LeagueLobbyActionStyle;
  categories: LeagueLobbyTab[];
}
