export interface DraftTeam {
  id: string;
  code: string;
  name: string;
  slotLabel: string;
  isActive: boolean;
}

export interface DraftPickHistory {
  id: string;
  leagueId: string;
  pickNo: string;
  fighterName: string;
  fighterImageUrl: string;
  division: string;
  teamName: string;
  round: number;
  pickTime: string;
}

export interface DraftRoomSnapshot {
  roomName: string;
  roundLabel: string;
  activePickLabel: string;
  secondsLeft: number;
}
