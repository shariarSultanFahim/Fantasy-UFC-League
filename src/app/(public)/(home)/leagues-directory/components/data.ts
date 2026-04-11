import type { LeagueLobbyEntry, LeagueLobbyTab } from "@/types/league";

export const LEAGUE_LOBBY_TABS: LeagueLobbyTab[] = [
  "MY TEAM",
  "FREE AGENTS",
  "OPPOSING TEAM",
  "LEADERBOARD"
];

export const LEAGUE_LOBBY_DATA: LeagueLobbyEntry[] = [
  {
    id: "league-001",
    name: "Octagon Overlords",
    hasPasscode: true,
    draftTime: "5:55 PM",
    members: 0,
    memberLimit: 12,
    actionLabel: "Enter Passcode",
    actionStyle: "dark",
    categories: ["MY TEAM", "LEADERBOARD"]
  },
  {
    id: "league-002",
    name: "The Submission Squad",
    hasPasscode: false,
    draftTime: "5:55 PM",
    members: 0,
    memberLimit: 12,
    actionLabel: "Join",
    actionStyle: "dark",
    categories: ["FREE AGENTS"]
  },
  {
    id: "league-003",
    name: "Fight Night Elites",
    hasPasscode: false,
    draftTime: "5:55 PM",
    members: 8,
    memberLimit: 8,
    actionLabel: "Full",
    actionStyle: "muted",
    categories: ["OPPOSING TEAM", "LEADERBOARD"]
  },
  {
    id: "league-004",
    name: "Gabriela's Gauntlet",
    hasPasscode: false,
    draftTime: "5:55 PM",
    members: 0,
    memberLimit: 8,
    actionLabel: "Join",
    actionStyle: "dark",
    categories: ["FREE AGENTS"]
  },
  {
    id: "league-005",
    name: "Knockout Kings",
    hasPasscode: false,
    draftTime: "5:55 PM",
    members: 0,
    memberLimit: 8,
    actionLabel: "Join",
    actionStyle: "dark",
    categories: ["FREE AGENTS", "LEADERBOARD"]
  },
  {
    id: "league-006",
    name: "Ultimate Warriors League",
    hasPasscode: true,
    draftTime: "5:55 PM",
    members: 0,
    memberLimit: 10,
    actionLabel: "Enter Passcode",
    actionStyle: "dark",
    categories: ["MY TEAM"]
  },
  {
    id: "league-007",
    name: "Cage Commanders",
    hasPasscode: true,
    draftTime: "5:55 PM",
    members: 0,
    memberLimit: 10,
    actionLabel: "Enter Passcode",
    actionStyle: "dark",
    categories: ["MY TEAM"]
  },
  {
    id: "league-008",
    name: "Ground & Pound Masters",
    hasPasscode: true,
    draftTime: "5:55 PM",
    members: 1,
    memberLimit: 10,
    actionLabel: "Enter Passcode",
    actionStyle: "dark",
    categories: ["MY TEAM", "LEADERBOARD"]
  }
];
