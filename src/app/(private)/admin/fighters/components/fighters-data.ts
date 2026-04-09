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

export const RANK_RANGE_OPTIONS = [
  "All Ranks",
  "Top 5",
  "Top 10",
  "Top 15",
  "Unranked"
];

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
  nationality: "All Nationalities"
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