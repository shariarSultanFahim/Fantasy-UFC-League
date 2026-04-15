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
  age: number;
  height: string;
  reach: string;
  koWins: number;
  submissionWins: number;
  decisionWins: number;
  titleDefenses: number;
  upcomingOpponent: string;
  upcomingEvent: string;
  scheduledDate: string;
  lastFiveFightsAvgPoints: number;
  pointsChange: number;
  formerChampionDivisions?: string[];
}

export interface FighterFilters {
  division: string;
  rankRange: string;
  nationality: string;
  minWins: number;
  maxLosses: number;
}
