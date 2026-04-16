import type { LeagueStatus } from "@/types";

export type DraftLifecycleStatus = "pre_draft" | "drafting" | "completed";

export interface DraftParticipant {
  id: string;
  name: string;
  email: string;
  teamName: string;
  joinedAt: string;
  avatarUrl: string;
}

export interface DraftTeamRosterFighter {
  id: string;
  name: string;
  division: string;
  ranking: number;
}

export interface DraftTeamDetails {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerAvatarUrl: string;
  fighters: DraftTeamRosterFighter[];
}

export interface LeagueDraftDetails {
  leagueId: string;
  leagueName: string;
  leagueCode: string;
  status: DraftLifecycleStatus;
  draftStartsAt: string;
  participants: DraftParticipant[];
  teams: DraftTeamDetails[];
}

const SHARED_TEAMS: DraftTeamDetails[] = [
  {
    id: "team-alpha",
    name: "Alpha Elite",
    ownerName: "Mason Kent",
    ownerEmail: "mason.kent@fantasymma.com",
    ownerAvatarUrl: "/demo.jpeg",
    fighters: [
      { id: "fighter-001", name: "Jon Jones", division: "Heavyweight", ranking: 1 },
      { id: "fighter-002", name: "Alex Pereira", division: "Light Heavyweight", ranking: 2 },
      { id: "fighter-003", name: "Dustin Poirier", division: "Lightweight", ranking: 9 }
    ]
  },
  {
    id: "team-strike",
    name: "Strike Force",
    ownerName: "Leah Park",
    ownerEmail: "leah.park@fantasymma.com",
    ownerAvatarUrl: "/demo.jpeg",
    fighters: [
      { id: "fighter-004", name: "Islam Makhachev", division: "Lightweight", ranking: 1 },
      { id: "fighter-005", name: "Leon Edwards", division: "Welterweight", ranking: 3 },
      { id: "fighter-006", name: "Sean O'Malley", division: "Bantamweight", ranking: 2 }
    ]
  },
  {
    id: "team-grapple",
    name: "Grapple Kings",
    ownerName: "Noah Francis",
    ownerEmail: "noah.francis@fantasymma.com",
    ownerAvatarUrl: "/demo.jpeg",
    fighters: [
      { id: "fighter-007", name: "Charles Oliveira", division: "Lightweight", ranking: 2 },
      { id: "fighter-008", name: "Khamzat Chimaev", division: "Middleweight", ranking: 4 },
      { id: "fighter-009", name: "Belal Muhammad", division: "Welterweight", ranking: 1 }
    ]
  },
  {
    id: "team-octagon",
    name: "Octagon Titans",
    ownerName: "Rico Mendoza",
    ownerEmail: "rico.mendoza@fantasymma.com",
    ownerAvatarUrl: "/demo.jpeg",
    fighters: [
      { id: "fighter-010", name: "Tom Aspinall", division: "Heavyweight", ranking: 2 },
      { id: "fighter-011", name: "Merab Dvalishvili", division: "Bantamweight", ranking: 1 },
      { id: "fighter-012", name: "Amanda Nunes", division: "Bantamweight", ranking: 1 }
    ]
  }
];

const SHARED_PARTICIPANTS: DraftParticipant[] = [
  {
    id: "participant-01",
    name: "Mason Kent",
    email: "mason.kent@fantasymma.com",
    teamName: "Alpha Elite",
    joinedAt: "2026-04-10 11:12 AM",
    avatarUrl: "/demo.jpeg"
  },
  {
    id: "participant-02",
    name: "Leah Park",
    email: "leah.park@fantasymma.com",
    teamName: "Strike Force",
    joinedAt: "2026-04-10 11:20 AM",
    avatarUrl: "/demo.jpeg"
  },
  {
    id: "participant-03",
    name: "Noah Francis",
    email: "noah.francis@fantasymma.com",
    teamName: "Grapple Kings",
    joinedAt: "2026-04-10 11:31 AM",
    avatarUrl: "/demo.jpeg"
  },
  {
    id: "participant-04",
    name: "Rico Mendoza",
    email: "rico.mendoza@fantasymma.com",
    teamName: "Octagon Titans",
    joinedAt: "2026-04-10 11:44 AM",
    avatarUrl: "/demo.jpeg"
  }
];

export const LEAGUE_DRAFT_DETAILS: LeagueDraftDetails[] = [
  {
    leagueId: "88291",
    leagueName: "Ultimate Punchers",
    leagueCode: "UP",
    status: "pre_draft",
    draftStartsAt: "2026-04-20T18:00:00.000Z",
    participants: SHARED_PARTICIPANTS,
    teams: SHARED_TEAMS
  },
  {
    leagueId: "88295",
    leagueName: "Octagon Chaos",
    leagueCode: "OC",
    status: "drafting",
    draftStartsAt: "2026-04-16T15:00:00.000Z",
    participants: SHARED_PARTICIPANTS,
    teams: SHARED_TEAMS
  },
  {
    leagueId: "88301",
    leagueName: "Grappler's Choice",
    leagueCode: "GC",
    status: "completed",
    draftStartsAt: "2026-04-12T18:00:00.000Z",
    participants: SHARED_PARTICIPANTS,
    teams: SHARED_TEAMS
  },
  {
    leagueId: "88310",
    leagueName: "Friday Night Fights",
    leagueCode: "FF",
    status: "drafting",
    draftStartsAt: "2026-04-16T20:00:00.000Z",
    participants: SHARED_PARTICIPANTS,
    teams: SHARED_TEAMS
  },
  {
    leagueId: "88318",
    leagueName: "Knockout Syndicate",
    leagueCode: "KS",
    status: "pre_draft",
    draftStartsAt: "2026-04-21T00:00:00.000Z",
    participants: SHARED_PARTICIPANTS,
    teams: SHARED_TEAMS
  },
  {
    leagueId: "88324",
    leagueName: "Title Chasers",
    leagueCode: "TC",
    status: "completed",
    draftStartsAt: "2026-04-09T18:00:00.000Z",
    participants: SHARED_PARTICIPANTS,
    teams: SHARED_TEAMS
  },
  {
    leagueId: "88331",
    leagueName: "Brawl Theory",
    leagueCode: "BT",
    status: "pre_draft",
    draftStartsAt: "2026-04-22T00:00:00.000Z",
    participants: SHARED_PARTICIPANTS,
    teams: SHARED_TEAMS
  },
  {
    leagueId: "88337",
    leagueName: "Heavyweight Grind",
    leagueCode: "HG",
    status: "drafting",
    draftStartsAt: "2026-04-17T00:00:00.000Z",
    participants: SHARED_PARTICIPANTS,
    teams: SHARED_TEAMS
  }
];

export function leagueStatusToDraftLifecycle(status: LeagueStatus): DraftLifecycleStatus {
  if (status === "active") {
    return "pre_draft";
  }

  if (status === "drafting") {
    return "drafting";
  }

  return "completed";
}
