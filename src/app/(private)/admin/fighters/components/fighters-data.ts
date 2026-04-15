import type { Fighter, FighterFilters } from "@/types";

export const DIVISION_OPTIONS = [
  "All Divisions",
  "Lightweight",
  "Heavyweight",
  "Middleweight",
  "Welterweight",
  "Featherweight",
  "Bantamweight"
];

export const RANK_RANGE_OPTIONS = ["All Ranks", "Top 5", "Top 10", "Top 15", "Unranked"];

export const NATIONALITY_OPTIONS = [
  "All Nationalities",
  "Ireland",
  "USA",
  "Russia",
  "Nigeria",
  "Cameroon",
  "Brazil"
];

export const DEFAULT_FILTERS: FighterFilters = {
  division: "All Divisions",
  rankRange: "All Ranks",
  nationality: "All Nationalities",
  minWins: 0,
  maxLosses: 99
};

export const FIGHTERS_DATA: Fighter[] = [
  {
    id: "f-001",
    name: "Conor McGregor",
    nickname: "The Notorious",
    nationality: "Ireland",
    division: "Lightweight",
    wins: 22,
    losses: 6,
    draws: 0,
    points: 1847,
    rank: 8,
    age: 36,
    height: "5'8\"",
    reach: '74"',
    koWins: 19,
    submissionWins: 1,
    decisionWins: 2,
    titleDefenses: 0,
    upcomingOpponent: "Michael Chandler",
    upcomingEvent: "UFC 310",
    scheduledDate: "2026-06-12",
    lastFiveFightsAvgPoints: 72,
    pointsChange: 14,
    formerChampionDivisions: ["Featherweight", "Lightweight"],
    avatarUrl:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-002",
    name: "Jon Jones",
    nickname: "Bones",
    nationality: "USA",
    division: "Heavyweight",
    wins: 27,
    losses: 1,
    draws: 0,
    points: 2156,
    rank: 1,
    age: 38,
    height: "6'4\"",
    reach: '84.5"',
    koWins: 11,
    submissionWins: 7,
    decisionWins: 9,
    titleDefenses: 12,
    upcomingOpponent: "Tom Aspinall",
    upcomingEvent: "UFC 312",
    scheduledDate: "2026-07-21",
    lastFiveFightsAvgPoints: 86,
    pointsChange: 18,
    formerChampionDivisions: ["Light Heavyweight", "Heavyweight"],
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-003",
    name: "Khabib Nurmagomedov",
    nickname: "The Eagle",
    nationality: "Russia",
    division: "Lightweight",
    wins: 29,
    losses: 0,
    draws: 0,
    points: 1923,
    rank: null,
    age: 37,
    height: "5'10\"",
    reach: '70"',
    koWins: 8,
    submissionWins: 11,
    decisionWins: 10,
    titleDefenses: 3,
    upcomingOpponent: "Retired",
    upcomingEvent: "N/A",
    scheduledDate: "2026-01-01",
    lastFiveFightsAvgPoints: 79,
    pointsChange: 0,
    formerChampionDivisions: ["Lightweight"],
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-004",
    name: "Israel Adesanya",
    nickname: "The Last Stylebender",
    nationality: "Nigeria",
    division: "Middleweight",
    wins: 24,
    losses: 3,
    draws: 0,
    points: 1756,
    rank: 2,
    age: 35,
    height: "6'4\"",
    reach: '80"',
    koWins: 16,
    submissionWins: 0,
    decisionWins: 8,
    titleDefenses: 5,
    upcomingOpponent: "Dricus Du Plessis",
    upcomingEvent: "UFC 309",
    scheduledDate: "2026-05-30",
    lastFiveFightsAvgPoints: 74,
    pointsChange: -7,
    formerChampionDivisions: ["Middleweight"],
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-005",
    name: "Francis Ngannou",
    nickname: "The Predator",
    nationality: "Cameroon",
    division: "Heavyweight",
    wins: 17,
    losses: 3,
    draws: 0,
    points: 1689,
    rank: 3,
    age: 39,
    height: "6'4\"",
    reach: '83"',
    koWins: 12,
    submissionWins: 4,
    decisionWins: 1,
    titleDefenses: 1,
    upcomingOpponent: "Ciryl Gane",
    upcomingEvent: "PFL Super Fights",
    scheduledDate: "2026-08-10",
    lastFiveFightsAvgPoints: 69,
    pointsChange: 9,
    formerChampionDivisions: ["Heavyweight"],
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
  }
];

export function getFighterById(fighterId?: string) {
  if (!fighterId) {
    return FIGHTERS_DATA[0];
  }

  return FIGHTERS_DATA.find((fighter) => fighter.id === fighterId) ?? FIGHTERS_DATA[0];
}
