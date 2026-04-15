export type LeagueDraftStatus = "waiting" | "open" | "drafting";

export interface LeagueFighter {
  id: string;
  name: string;
  weightClass: string;
  nationality: string;
  wins: number;
  losses: number;
  avgPoints: number;
  divisionRank: number;
  avatarUrl: string;
}

export interface LeagueSimulationState {
  queueByLeague: Record<string, string[]>;
  statusByLeague: Record<string, LeagueDraftStatus>;
}

export interface DraftPickItem {
  id: string;
  teamName: string;
  fighterName: string;
  pickLabel: string;
}
