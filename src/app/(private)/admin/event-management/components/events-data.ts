import { FIGHTERS_DATA } from "@/app/(public)/(home)/rankings/components/data";

import type { Event, EventBout, EventStatus, Fighter } from "@/types";

export const WEIGHT_CLASS_OPTIONS = [
  "Flyweight",
  "Bantamweight",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Light Heavyweight",
  "Heavyweight"
];

function formatAsDateInput(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function offsetDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatAsDateInput(date);
}

function toEventFighterSnapshot(fighter: Fighter) {
  return {
    id: fighter.id,
    name: fighter.name,
    nickname: fighter.nickname,
    avatarUrl: fighter.avatarUrl,
    division: fighter.division
  };
}

function findFighter(fighterId: string, fallbackIndex: number) {
  return FIGHTERS_DATA.find((fighter) => fighter.id === fighterId) ?? FIGHTERS_DATA[fallbackIndex] ?? FIGHTERS_DATA[0];
}

const fighterA = toEventFighterSnapshot(findFighter("f-001", 0));
const fighterB = toEventFighterSnapshot(findFighter("f-002", 1));
const fighterC = toEventFighterSnapshot(findFighter("f-003", 2));
const fighterD = toEventFighterSnapshot(findFighter("f-004", 3));
const fighterE = toEventFighterSnapshot(findFighter("f-005", 4));

function createBout(partial: Omit<EventBout, "id">, index: number): EventBout {
  return {
    ...partial,
    id: `bout-${index + 1}`
  };
}

export const EVENTS_DATA: Event[] = [
  {
    id: "event-001",
    name: "UFC Atlantic Clash",
    location: "Las Vegas, NV",
    date: offsetDate(12),
    posterUrl: "/demo.jpeg",
    hasResults: false,
    bouts: [
      createBout(
        {
          fighter1: fighterD,
          fighter2: fighterE,
          weightClass: "Middleweight",
          rounds: 5,
          isMainEvent: true,
          isCoMainEvent: false,
          winnerId: null
        },
        0
      ),
      createBout(
        {
          fighter1: fighterA,
          fighter2: fighterC,
          weightClass: "Lightweight",
          rounds: 3,
          isMainEvent: false,
          isCoMainEvent: true,
          winnerId: null
        },
        1
      )
    ]
  },
  {
    id: "event-002",
    name: "UFC Tonight Live",
    location: "Abu Dhabi, UAE",
    date: offsetDate(0),
    posterUrl: "/demo.jpeg",
    hasResults: false,
    bouts: [
      createBout(
        {
          fighter1: fighterB,
          fighter2: fighterE,
          weightClass: "Heavyweight",
          rounds: 5,
          isMainEvent: true,
          isCoMainEvent: false,
          winnerId: null
        },
        0
      ),
      createBout(
        {
          fighter1: fighterA,
          fighter2: fighterD,
          weightClass: "Welterweight",
          rounds: 3,
          isMainEvent: false,
          isCoMainEvent: true,
          winnerId: null
        },
        1
      )
    ]
  },
  {
    id: "event-003",
    name: "UFC Legacy Night",
    location: "Sao Paulo, BR",
    date: offsetDate(-14),
    posterUrl: "/demo.jpeg",
    hasResults: true,
    bouts: [
      createBout(
        {
          fighter1: fighterD,
          fighter2: fighterA,
          weightClass: "Middleweight",
          rounds: 5,
          isMainEvent: true,
          isCoMainEvent: false,
          winnerId: fighterD.id
        },
        0
      ),
      createBout(
        {
          fighter1: fighterB,
          fighter2: fighterC,
          weightClass: "Heavyweight",
          rounds: 3,
          isMainEvent: false,
          isCoMainEvent: true,
          winnerId: fighterB.id
        },
        1
      )
    ]
  }
];

function parseEventDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function getEventStatus(event: Event): EventStatus {
  if (event.hasResults || event.bouts.some((bout) => bout.winnerId)) {
    return "completed";
  }

  const eventDate = parseEventDate(event.date);
  const today = new Date();

  if (isSameDay(eventDate, today)) {
    return "ongoing";
  }

  if (eventDate > today) {
    return "upcoming";
  }

  return "ongoing";
}

export function getEventById(eventId?: string) {
  if (!eventId) {
    return EVENTS_DATA[0];
  }

  return EVENTS_DATA.find((event) => event.id === eventId) ?? EVENTS_DATA[0];
}

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed"
};

export const EVENT_STATUS_BADGE_VARIANT: Record<EventStatus, "secondary" | "default" | "outline"> = {
  upcoming: "secondary",
  ongoing: "default",
  completed: "outline"
};
