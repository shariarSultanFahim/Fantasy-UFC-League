export type LeagueStatus = "active" | "drafting" | "completed";
export type LeagueLobbyTab = "MY TEAM" | "FREE AGENTS" | "OPPOSING TEAM" | "LEADERBOARD";

export type LeagueLobbyActionStyle = "dark" | "muted";

export interface League {
  id: string;
  code: string;
  name: string;
  managerName: string;
  managerAvatarUrl: string;
  memberCount: number;
  memberLimit: number;
  status: LeagueStatus;
}

export interface LeagueLobbyEntry {
  id: string;
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
