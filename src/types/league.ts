export type LeagueStatus = "active" | "drafting" | "completed";

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
