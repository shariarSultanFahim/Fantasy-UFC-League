export type RankFilter = "all" | "top-3" | "top-5";

export interface TeamFighterRow {
  id: string;
  fighterName: string;
  weightClass: string;
  avatarUrl: string;
  championship: number;
  wins: number;
  fiveRw: number;
  rw: number;
  fin: number;
  cc: number;
  totalPoints: string;
}

export interface LeaderboardRow {
  teamId: string;
  rank: number;
  teamName: string;
  iconClassName: string;
  iconGlyph: string;
  totals: {
    r: number;
    hr: number;
    rbi: number;
    sb: number;
    avg: number;
    k: number;
    w: number;
    sv: number;
    hd: number;
    era: number;
    whip: number;
    tot: number;
    chg: number;
  };
}
