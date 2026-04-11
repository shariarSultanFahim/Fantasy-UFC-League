import type { Fighter, FighterFilters } from "@/types";

export const DIVISION_OPTIONS = [
  "All Divisions",
  "Men's Heavyweight",
  "Men's Light Heavyweight",
  "Men's Middleweight",
  "Men's Welterweight",
  "Men's Lightweight",
  "Men's Featherweight",
  "Men's Bantamweight",
  "Men's Flyweight",
  "Women's Bantamweight",
  "Women's Flyweight",
  "Women's Strawweight"
];

export const RANK_RANGE_OPTIONS = ["All Ranks", "Top 5", "Top 10", "Top 15", "Unranked"];

export const NATIONALITY_OPTIONS = [
  "All Nationalities",
  "USA",
  "Brazil",
  "Russia",
  "Ireland",
  "Australia",
  "Canada",
  "Japan"
];

export const DEFAULT_FILTERS: FighterFilters = {
  division: "All Divisions",
  rankRange: "All Ranks",
  nationality: "All Nationalities",
  minWins: 0,
  maxLosses: 100
};

export const FIGHTERS_DATA: Fighter[] = [
  {
    id: "f-001",
    name: "Islam Makhachev",
    nickname: "The Eagle",
    nationality: "Russia",
    division: "Men's Lightweight",
    wins: 25,
    losses: 1,
    draws: 0,
    points: 2847,
    rank: 1,
    avatarUrl:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-002",
    name: "Jon Jones",
    nickname: "Bones",
    nationality: "USA",
    division: "Men's Heavyweight",
    wins: 27,
    losses: 1,
    draws: 0,
    points: 2756,
    rank: 2,
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-003",
    name: "Alex Pereira",
    nickname: "Poatan",
    nationality: "Brazil",
    division: "Men's Welterweight",
    wins: 11,
    losses: 2,
    draws: 0,
    points: 2456,
    rank: 3,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-004",
    name: "Israel Adesanya",
    nickname: "Stylebender",
    nationality: "Australia",
    division: "Men's Middleweight",
    wins: 24,
    losses: 3,
    draws: 0,
    points: 2156,
    rank: 4,
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-005",
    name: "Leon Edwards",
    nickname: "Rocky",
    nationality: "USA",
    division: "Men's Welterweight",
    wins: 21,
    losses: 3,
    draws: 0,
    points: 2045,
    rank: 5,
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-006",
    name: "Alexander Volkanovski",
    nickname: "The Great",
    nationality: "Australia",
    division: "Men's Featherweight",
    wins: 25,
    losses: 2,
    draws: 0,
    points: 1944,
    rank: 6,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-007",
    name: "Ilia Topuria",
    nickname: "El Matador",
    nationality: "Brazil",
    division: "Men's Featherweight",
    wins: 15,
    losses: 0,
    draws: 0,
    points: 1845,
    rank: 7,
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-008",
    name: "Conor McGregor",
    nickname: "The Notorious",
    nationality: "Ireland",
    division: "Men's Lightweight",
    wins: 22,
    losses: 6,
    draws: 0,
    points: 1701,
    rank: 8,
    avatarUrl:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-009",
    name: "Sean Strickland",
    nickname: "Tarzan",
    nationality: "USA",
    division: "Men's Middleweight",
    wins: 27,
    losses: 5,
    draws: 0,
    points: 1645,
    rank: null,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: "f-010",
    name: "Khabib Nurmagomedov",
    nickname: "The Eagle",
    nationality: "Russia",
    division: "Men's Lightweight",
    wins: 29,
    losses: 0,
    draws: 0,
    points: 1523,
    rank: null,
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop"
  }
];

export function getFighterById(fighterId?: string) {
  if (!fighterId) {
    return FIGHTERS_DATA[0];
  }
  return FIGHTERS_DATA.find((fighter) => fighter.id === fighterId) ?? FIGHTERS_DATA[0];
}
