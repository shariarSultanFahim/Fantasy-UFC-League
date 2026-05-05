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
    code: "OVERLORDS",
    hasPasscode: true,
    passcode: "MMA2026",
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
    code: "SUBMIT",
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
    code: "ELITES",
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
    code: "GABBY",
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
    code: "KINGS",
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
    code: "WARRIORS",
    hasPasscode: true,
    passcode: "MMA2026",
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
    code: "COMMAND",
    hasPasscode: true,
    passcode: "MMA2026",
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
    code: "MASTERS",
    hasPasscode: true,
    passcode: "MMA2026",
    draftTime: "5:55 PM",
    members: 1,
    memberLimit: 10,
    actionLabel: "Enter Passcode",
    actionStyle: "dark",
    categories: ["MY TEAM", "LEADERBOARD"]
  }
];
