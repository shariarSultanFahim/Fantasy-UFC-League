export type EventStatus = "upcoming" | "ongoing" | "completed";

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
}

export interface EventFormValues {
  name: string;
  location: string;
  date: string;
  posterDataUrl: string;
  bouts: EventBoutFormValue[];
}
