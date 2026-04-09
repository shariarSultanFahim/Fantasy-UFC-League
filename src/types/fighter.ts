export interface Fighter {
  id: string;
  name: string;
  nickname: string;
  nationality: string;
  division: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  rank: number | null;
  avatarUrl: string;
}

export interface FighterFilters {
  division: string;
  rankRange: string;
  nationality: string;
}