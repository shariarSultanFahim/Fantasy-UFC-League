import type { ScoringSettings } from "./scoring";

export type EventStatus = "upcoming" | "ongoing" | "completed";

export type EventBoutScoringCriteria = Record<keyof ScoringSettings, boolean>;

export interface EventFighterSnapshot {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string;
  division: string;
}

export interface EventBout {
  id: string;
  fighter1: EventFighterSnapshot;
  fighter2: EventFighterSnapshot;
  weightClass: string;
  rounds: number;
  isMainEvent: boolean;
  isCoMainEvent: boolean;
  winnerId: string | null;
  scoringCriteria?: EventBoutScoringCriteria;
}

export interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  posterUrl: string;
  bouts: EventBout[];
  hasResults: boolean;
}

export interface EventBoutFormValue {
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
