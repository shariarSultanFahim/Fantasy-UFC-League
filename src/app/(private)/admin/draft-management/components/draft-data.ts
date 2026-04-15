import type { DraftPickHistory, DraftRoomSnapshot, DraftTeam } from "@/types";

export const DRAFT_ROOM_SNAPSHOT: DraftRoomSnapshot = {
  roomName: "Team Alpha Elite",
  roundLabel: "Round 4",
  activePickLabel: "Pick 12",
  secondsLeft: 45
};

export const DRAFT_TEAMS: DraftTeam[] = [
  {
    id: "team-01",
    code: "T1",
    name: "Alpha Elite",
    slotLabel: "Team 01",
    isActive: true
  },
  {
    id: "team-02",
    code: "T2",
    name: "Strike Force",
    slotLabel: "Team 02",
    isActive: false
  },
  {
    id: "team-03",
    code: "T3",
    name: "Grapple Kings",
    slotLabel: "Team 03",
    isActive: false
  },
  {
    id: "team-04",
    code: "T4",
    name: "Octagon Titans",
    slotLabel: "Team 04",
    isActive: false
  }
];

export const DRAFT_PICKS: DraftPickHistory[] = [
  {
    id: "pick-411",
    leagueId: "88295",
    pickNo: "4.11",
    fighterName: "Charles Oliveira",
    fighterImageUrl: "/demo.jpeg",
    division: "Lightweight",
    teamName: "Octagon Titans",
    round: 4,
    pickTime: "14:02:45 PM"
  },
  {
    id: "pick-410",
    leagueId: "88295",
    pickNo: "4.10",
    fighterName: "Dustin Poirier",
    fighterImageUrl: "/demo.jpeg",
    division: "Lightweight",
    teamName: "Grapple Kings",
    round: 4,
    pickTime: "14:01:20 PM"
  },
  {
    id: "pick-409",
    leagueId: "88295",
    pickNo: "4.09",
    fighterName: "Sean O'Malley",
    fighterImageUrl: "/demo.jpeg",
    division: "Bantamweight",
    teamName: "Strike Force",
    round: 4,
    pickTime: "13:59:55 PM"
  },
  {
    id: "pick-408",
    leagueId: "88295",
    pickNo: "4.08",
    fighterName: "Amanda Nunes",
    fighterImageUrl: "/demo.jpeg",
    division: "Bantamweight",
    teamName: "Alpha Elite",
    round: 4,
    pickTime: "13:58:40 PM"
  },
  {
    id: "pick-307",
    leagueId: "88310",
    pickNo: "3.07",
    fighterName: "Jon Jones",
    fighterImageUrl: "/demo.jpeg",
    division: "Heavyweight",
    teamName: "Alpha Elite",
    round: 3,
    pickTime: "13:42:18 PM"
  },
  {
    id: "pick-306",
    leagueId: "88310",
    pickNo: "3.06",
    fighterName: "Islam Makhachev",
    fighterImageUrl: "/demo.jpeg",
    division: "Lightweight",
    teamName: "Strike Force",
    round: 3,
    pickTime: "13:40:03 PM"
  },
  {
    id: "pick-305",
    leagueId: "88310",
    pickNo: "3.05",
    fighterName: "Leon Edwards",
    fighterImageUrl: "/demo.jpeg",
    division: "Welterweight",
    teamName: "Grapple Kings",
    round: 3,
    pickTime: "13:38:22 PM"
  },
  {
    id: "pick-304",
    leagueId: "88310",
    pickNo: "3.04",
    fighterName: "Alex Pereira",
    fighterImageUrl: "/demo.jpeg",
    division: "Light Heavyweight",
    teamName: "Octagon Titans",
    round: 3,
    pickTime: "13:36:50 PM"
  }
];
