export interface LeagueLobbyMember {
  name: string;
}

export interface LeagueLobbyMeta {
  id: string;
  name: string;
  memberLimit: number;
}

export type LeagueDraftStatus = "waiting" | "open" | "drafting";

const LOBBY_MEMBERS_KEY = "league-lobby-members";
const LOBBY_META_KEY = "league-lobby-meta";
const LOBBY_QUEUE_KEY = "league-lobby-queue";
const LOBBY_STATUS_KEY = "league-lobby-status";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrentLoggedInUserName() {
  if (typeof window === "undefined") {
    return "Matthew";
  }

  const candidateKeys = [
    "currentUserName",
    "loggedInUserName",
    "authUserName",
    "userName",
    "username"
  ];

  for (const key of candidateKeys) {
    const value = window.localStorage.getItem(key)?.trim();

    if (value) {
      return value;
    }
  }

  return "Matthew";
}

export function upsertLeagueLobbyMeta(meta: LeagueLobbyMeta) {
  const leagueMetaMap = readStorage<Record<string, LeagueLobbyMeta>>(LOBBY_META_KEY, {});
  leagueMetaMap[meta.id] = meta;
  writeStorage(LOBBY_META_KEY, leagueMetaMap);
}

export function getLeagueLobbyMeta(leagueId: string) {
  const leagueMetaMap = readStorage<Record<string, LeagueLobbyMeta>>(LOBBY_META_KEY, {});
  return leagueMetaMap[leagueId] ?? null;
}

export function joinLeagueLobby(leagueId: string, memberName = getCurrentLoggedInUserName()) {
  const membersByLeague = readStorage<Record<string, LeagueLobbyMember[]>>(LOBBY_MEMBERS_KEY, {});
  const existingMembers = membersByLeague[leagueId] ?? [];

  if (existingMembers.some((member) => member.name.toLowerCase() === memberName.toLowerCase())) {
    return existingMembers;
  }

  const updatedMembers = [...existingMembers, { name: memberName }];
  membersByLeague[leagueId] = updatedMembers;
  writeStorage(LOBBY_MEMBERS_KEY, membersByLeague);

  return updatedMembers;
}

export function getJoinedLeagueMembers(leagueId: string) {
  const membersByLeague = readStorage<Record<string, LeagueLobbyMember[]>>(LOBBY_MEMBERS_KEY, {});
  return membersByLeague[leagueId] ?? [];
}

export function getLeagueQueue(leagueId: string) {
  const queueByLeague = readStorage<Record<string, string[]>>(LOBBY_QUEUE_KEY, {});
  return queueByLeague[leagueId] ?? [];
}

export function setLeagueQueue(leagueId: string, queue: string[]) {
  const queueByLeague = readStorage<Record<string, string[]>>(LOBBY_QUEUE_KEY, {});
  queueByLeague[leagueId] = queue;
  writeStorage(LOBBY_QUEUE_KEY, queueByLeague);
}

export function getLeagueDraftStatus(leagueId: string): LeagueDraftStatus {
  const statusByLeague = readStorage<Record<string, LeagueDraftStatus>>(LOBBY_STATUS_KEY, {});
  return statusByLeague[leagueId] ?? "waiting";
}

export function setLeagueDraftStatus(leagueId: string, status: LeagueDraftStatus) {
  const statusByLeague = readStorage<Record<string, LeagueDraftStatus>>(LOBBY_STATUS_KEY, {});
  statusByLeague[leagueId] = status;
  writeStorage(LOBBY_STATUS_KEY, statusByLeague);
}
