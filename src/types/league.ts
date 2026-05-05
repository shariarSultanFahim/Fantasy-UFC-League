import { IApiResponse, IPaginatedResponse } from "./auth";
import { IFighter } from "./fighter";

export type LeagueStatus = 'DRAFTING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
export type LeagueType = 'PUBLIC' | 'PRIVATE';
export type DraftSessionStatus = 'WAITING' | 'DRAFTING' | 'COMPLETED';

export interface IUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  avatarUrl?: string;
}

export interface IScoringSettings {
  id: string;
  leagueId: string;
  systemScoringSettingId: string | null;
  winPoints: number;
  finishBonus: number;
  winningChampionshipBout: number;
  championVsChampionWin: number;
  winningAgainstRankedOpponent: number;
  winningFiveRoundFight: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITeamFighter {
  teamId: string;
  fighterId: string;
  fighter: IFighter;
}

export interface ITeam {
  id: string;
  name: string;
  leagueId: string;
  ownerId: string;
  totalPoints: number;
  rank: number | null;
  iconGlyph: string | null;
  owner?: IUser;
  teamFighters?: ITeamFighter[];
}

export interface IDraftSession {
  id: string;
  leagueId: string;
  status: DraftSessionStatus;
  currentRound: number;
  currentPickIndex: number;
  secondsPerPick: number;
  totalRounds: number;
  version: number;
  turnStartedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ILeague {
  id: string;
  name: string;
  code: string;               // Unique invite code (e.g., "ABCD-1234")
  passcode: string | null;     // Optional password for private leagues
  managerId: string;           // User ID of the league creator
  memberLimit: number;         // Max teams allowed (default: 8)
  rosterSize: number;          // Fighters per team (default: 5)
  status: LeagueStatus;        // Current state of the league
  draftTime: string | null;    // ISO Date when drafting starts
  isSystemGenerated: boolean;  // True for official/global leagues
  deletedAt: string | null;    // Soft delete timestamp
  createdAt: string;
  updatedAt: string;

  // Relations
  manager?: IUser;
  scoringSettings?: IScoringSettings;
  draftSession?: IDraftSession;
  teams?: ITeam[];            // List of teams (for leaderboard)
  isPrivate?: boolean;        // Optional flag for available leagues
  _count?: {
    members: number;
    teams: number;
  };
}

export interface IJoinLeaguePayload {
  code: string;
  passcode?: string;
  teamName: string;
}

export interface ICreateLeaguePayload {
  name: string;
  passcode?: string;
  memberLimit: number;
  rosterSize: number;
  draftTime: string;
  scoringSettings: {
    winPoints: number;
    finishBonus: number;
    winningChampionshipBout?: number;
    championVsChampionWin?: number;
    winningAgainstRankedOpponent?: number;
    winningFiveRoundFight?: number;
  };
}

export type ILeagueResponse = IApiResponse<ILeague>;
export type ILeagueListResponse = IApiResponse<ILeague[]>;
export type IAvailableLeagueListResponse = IPaginatedResponse<ILeague>;

export interface IAvailableFightersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: IFighter[];
  };
}

export interface LeagueLobbyEntry {
  id: string;
  code: string;
  name: string;
  hasPasscode: boolean;
  draftTime: string;
  members: number;
  memberLimit: number;
  actionLabel: string;
  actionStyle: "dark" | "muted";
  isDraftStarted: boolean;
  categories: string[];
}
