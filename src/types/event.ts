import type { ScoringSettings } from "./scoring";

export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type EventBoutScoringCriteria = Record<keyof ScoringSettings, boolean>;

export interface IBoutOutcome {
  id: string;
  winnerId: string;
  winPoint: boolean;
  finishBonus: boolean;
  winningChampionshipBout: boolean;
  championVsChampionWin: boolean;
  winningAgainstRankedOpponent: boolean;
  winningFiveRoundFight: boolean;
}

export interface EventFighterSnapshot {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string | null;
  division?: string | { id: string; name: string };
}

export interface EventBout {
  id: string;
  eventId: string;
  fighter1: EventFighterSnapshot;
  fighter2: EventFighterSnapshot;
  weightClass: string;
  rounds: number;
  isMainEvent: boolean;
  isCoMainEvent: boolean;
  winnerId: string | null;
  scoringCriteria?: EventBoutScoringCriteria;
  outcome?: IBoutOutcome;
}

export interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  status: EventStatus;
  posterUrl: string | null;
  hasResults: boolean;
  bouts: EventBout[];
  _count?: { bouts: number };
}

export interface ICreateEventPayload {
  name: string;
  location: string;
  date: string;
  bouts: {
    weightClass: string;
    rounds: number;
    isMainEvent?: boolean;
    isCoMainEvent?: boolean;
    fighters: { fighterId: string }[];
  }[];
}

export interface ICreateBoutPayload {
  eventId: string;
  weightClass: string;
  rounds: number;
  isMainEvent?: boolean;
  isCoMainEvent?: boolean;
  fighters: { fighterId: string }[];
}

export interface IPostBoutResultPayload {
  winnerId: string;
  winPoint: boolean;
  finishBonus: boolean;
  winningChampionshipBout: boolean;
  championVsChampionWin: boolean;
  winningAgainstRankedOpponent: boolean;
  winningFiveRoundFight: boolean;
}

export interface EventBoutFormValue {
  id?: string;
  fighter1Id: string;
  fighter2Id: string;
  weightClass: string;
  rounds: number;
  isMainEvent: boolean;
  isCoMainEvent: boolean;
  winnerId: string;
  scoringCriteria: EventBoutScoringCriteria;
}

export interface EventFormValues {
  name: string;
  location: string;
  date: string;
  posterDataUrl: string;
  bouts: EventBoutFormValue[];
}
