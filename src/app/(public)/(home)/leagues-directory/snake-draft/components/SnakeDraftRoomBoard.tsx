"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Briefcase, Plus, Trophy, UserRound } from "lucide-react";

import type { DraftPickItem, LeagueFighter } from "@/types/league-simulation";

import {
  getCurrentLoggedInUserName,
  getJoinedLeagueMembers,
  getLeagueLobbyMeta,
  getLeagueQueue,
  setLeagueQueue
} from "@/helpers/league-lobby";

import { LEAGUE_FIGHTERS } from "@/data/league-fighters";

import { Button, Card, Input } from "@/components/ui";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface TeamSlot {
  id: string;
  label: string;
}

const PICK_SECONDS = 161;
const TEAM_DRAFT_TARGET = 4;

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function buildTeamSlots(memberNames: string[], maxSlots: number) {
  const slots: TeamSlot[] = memberNames.slice(0, maxSlots).map((name, index) => ({
    id: `slot-${index + 1}`,
    label: name
  }));

  for (let index = slots.length; index < maxSlots; index += 1) {
    slots.push({ id: `slot-${index + 1}`, label: `Manager ${index + 1}` });
  }

  return slots;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function SnakeDraftRoomBoard() {
  const searchParams = useSearchParams();
  const leagueId = searchParams.get("leagueId") ?? "instant-league";
  const loggedInUserName = getCurrentLoggedInUserName();

  const leagueMeta = useMemo(() => getLeagueLobbyMeta(leagueId), [leagueId]);
  const memberLimit = leagueMeta?.memberLimit ?? 10;
  const joinedNames = getJoinedLeagueMembers(leagueId).map((member) => member.name);

  const teamSlots = useMemo(
    () => buildTeamSlots(joinedNames, memberLimit),
    [joinedNames, memberLimit]
  );

  const [pickClock, setPickClock] = useState(PICK_SECONDS);
  const [currentSeatIndex, setCurrentSeatIndex] = useState(0);
  const [queue, setQueue] = useState<string[]>(() => getLeagueQueue(leagueId));
  const [playerSearch, setPlayerSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [nationalityFilter, setNationalityFilter] = useState("all");
  const [isAutoPickEnabled, setIsAutoPickEnabled] = useState(true);
  const [draftedIds, setDraftedIds] = useState<string[]>([]);
  const [isDraftCompleteModalOpen, setIsDraftCompleteModalOpen] = useState(false);
  const [hasShownDraftCompleteModal, setHasShownDraftCompleteModal] = useState(false);

  useEffect(() => {
    setQueue(getLeagueQueue(leagueId));
  }, [leagueId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPickClock((previous) => {
        if (previous > 1) {
          return previous - 1;
        }

        setCurrentSeatIndex((seat) => (teamSlots.length ? (seat + 1) % teamSlots.length : 0));
        return PICK_SECONDS;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [teamSlots.length]);

  useEffect(() => {
    if (hasShownDraftCompleteModal) {
      return;
    }

    if (draftedIds.length >= TEAM_DRAFT_TARGET) {
      setIsDraftCompleteModalOpen(true);
      setHasShownDraftCompleteModal(true);
    }
  }, [draftedIds.length, hasShownDraftCompleteModal]);

  const filteredPlayers = useMemo(() => {
    return LEAGUE_FIGHTERS.filter(
      (fighter) =>
        !draftedIds.includes(fighter.id) &&
        (divisionFilter === "all" || fighter.weightClass === divisionFilter) &&
        (nationalityFilter === "all" || fighter.nationality === nationalityFilter) &&
        fighter.name.toLowerCase().includes(playerSearch.toLowerCase())
    );
  }, [divisionFilter, draftedIds, nationalityFilter, playerSearch]);

  const divisionOptions = useMemo(() => {
    return [
      "all",
      ...Array.from(new Set(LEAGUE_FIGHTERS.map((fighter) => fighter.weightClass))).sort()
    ];
  }, []);

  const nationalityOptions = useMemo(() => {
    return [
      "all",
      ...Array.from(new Set(LEAGUE_FIGHTERS.map((fighter) => fighter.nationality))).sort()
    ];
  }, []);

  const recentPicks = useMemo(() => {
    return draftedIds
      .slice(-8)
      .reverse()
      .map((fighterId, index): DraftPickItem => {
        const fighter = LEAGUE_FIGHTERS.find((item) => item.id === fighterId);
        const pickSeatIndex = Math.max(0, currentSeatIndex - index);
        const team = teamSlots[pickSeatIndex % (teamSlots.length || 1)];

        return {
          id: `${fighterId}-${index}`,
          teamName: team?.label ?? "Manager",
          fighterName: fighter?.name ?? "Unknown Fighter",
          pickLabel: `R19-${183 - index}`
        };
      });
  }, [currentSeatIndex, draftedIds, teamSlots]);

  const rosterItems = useMemo(() => {
    return queue
      .map((fighterId) => LEAGUE_FIGHTERS.find((fighter) => fighter.id === fighterId))
      .filter((fighter): fighter is LeagueFighter => Boolean(fighter));
  }, [queue]);

  const draftedTeam = useMemo(() => {
    return draftedIds
      .slice(0, TEAM_DRAFT_TARGET)
      .map((fighterId) => LEAGUE_FIGHTERS.find((fighter) => fighter.id === fighterId))
      .filter((fighter): fighter is LeagueFighter => Boolean(fighter));
  }, [draftedIds]);

  const activeSeat = teamSlots[currentSeatIndex];
  const currentRound = 2;
  const currentPick = currentSeatIndex + 1;
  const isDraftComplete = draftedIds.length >= TEAM_DRAFT_TARGET;

  const draftFromQueue = () => {
    if (isDraftComplete) {
      return;
    }

    const firstQueueId = queue[0];

    if (!firstQueueId || draftedIds.includes(firstQueueId)) {
      return;
    }

    setDraftedIds((previous) => [...previous, firstQueueId]);

    const updatedQueue = queue.filter((fighterId) => fighterId !== firstQueueId);
    setQueue(updatedQueue);
    setLeagueQueue(leagueId, updatedQueue);

    setCurrentSeatIndex((seat) => (teamSlots.length ? (seat + 1) % teamSlots.length : 0));
    setPickClock(PICK_SECONDS);
  };

  const addToQueue = (fighterId: string) => {
    if (queue.includes(fighterId)) {
      return;
    }

    const updatedQueue = [...queue, fighterId];
    setQueue(updatedQueue);
    setLeagueQueue(leagueId, updatedQueue);
  };

  return (
    <>
      <section className="space-y-6">
        <Card className="gap-0 overflow-hidden rounded-none border-none bg-[#0B2450] p-0 text-white">
          <div className="px-4 py-3 text-xs font-semibold text-slate-200 sm:px-5">
            Fantasy MMA Draft - {leagueMeta?.name ?? "MMA League #23"}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto px-3 pb-4 sm:px-4">
            <div className="shrink-0 rounded-sm bg-red-600 px-3 py-3 text-base font-bold sm:text-lg">
              {formatClock(pickClock)}
            </div>
            {teamSlots.map((slot, index) => (
              <div
                key={slot.id}
                className={`min-w-16 shrink-0 rounded-sm px-3 py-3 text-center text-xs sm:min-w-18 sm:px-4 ${
                  index === currentSeatIndex
                    ? "bg-red-600 text-white"
                    : "bg-slate-600 text-slate-100"
                }`}
              >
                <p className="mb-1 text-[10px]">{index + 1}</p>
                <p>{slot.label.split(" ")[0]}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[220px_1fr_280px]">
          <Card className="gap-4 border border-slate-200 bg-white p-4">
            <div>
              <p className="text-base font-semibold text-slate-900 sm:text-lg">Pick Queue</p>
              <div className="mt-2 flex items-center justify-between rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">
                <span>Autopick</span>
                <Switch checked={isAutoPickEnabled} onCheckedChange={setIsAutoPickEnabled} />
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500">
              {queue.length ? `${queue.length} fighters in queue` : "No fighters in queue"}
            </div>

            <Button
              type="button"
              className="w-full bg-[#0E2A57] hover:bg-[#12336b]"
              onClick={draftFromQueue}
            >
              Draft Top Queue Fighter
            </Button>

            <div className="space-y-2 border-t border-slate-200 pt-3">
              <p className="text-sm font-semibold text-slate-700">Roster</p>
              {rosterItems.length ? (
                rosterItems.map((fighter) => (
                  <div
                    key={fighter.id}
                    className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-700"
                  >
                    {fighter.name}
                  </div>
                ))
              ) : (
                <div className="rounded-md bg-slate-100 px-3 py-2 text-xs text-slate-400">
                  Empty
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="items-center justify-center border border-slate-200 bg-[#0E2A57] px-4 py-8 text-center text-white sm:py-10">
              <p className="text-3xl font-bold sm:text-4xl">
                {initials(activeSeat?.label ?? loggedInUserName)}
              </p>
              <p className="mt-2 text-2xl font-semibold sm:text-4xl">
                Your draft is about to start
              </p>
              <p className="text-sm text-slate-300">
                Your first pick: Round {currentRound}, Pick {currentPick}
              </p>
            </Card>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="border-b-2 border-blue-600 px-2 pb-1 font-semibold text-slate-900">
                  Players
                </span>
                <span className="px-2 pb-1 text-slate-500">Pick History</span>
                <span className="px-2 pb-1 text-slate-500">Board</span>
                <span className="px-2 pb-1 text-slate-500">Scoring</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-[180px_180px_1fr]">
                <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="All Divisions" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisionOptions.map((division) => (
                      <SelectItem key={division} value={division}>
                        {division === "all" ? "All Divisions" : division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="All Nationalities" />
                  </SelectTrigger>
                  <SelectContent>
                    {nationalityOptions.map((nationality) => (
                      <SelectItem key={nationality} value={nationality}>
                        {nationality === "all" ? "All Nationalities" : nationality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="bg-white"
                  value={playerSearch}
                  onChange={(event) => setPlayerSearch(event.target.value)}
                  placeholder="Search Player Name"
                />
              </div>

              <Card className="gap-0 overflow-hidden border border-slate-200 bg-white p-0">
                <div className="grid grid-cols-[42px_1fr_42px] gap-2 border-b border-slate-200 px-3 py-3 text-xs font-semibold text-slate-500 uppercase sm:grid-cols-[60px_1.4fr_90px_90px_90px_90px_48px] sm:px-4">
                  <p>RK</p>
                  <p>Player</p>
                  <p className="hidden sm:block">L5</p>
                  <p className="hidden sm:block">Wins</p>
                  <p className="hidden sm:block">Loss</p>
                  <p className="hidden sm:block">Di. rank</p>
                  <p />
                </div>

                {filteredPlayers.slice(0, 8).map((fighter, index) => (
                  <div
                    key={fighter.id}
                    className="grid grid-cols-[42px_1fr_42px] items-center gap-2 border-b border-slate-100 px-3 py-3 text-sm last:border-b-0 sm:grid-cols-[60px_1.4fr_90px_90px_90px_90px_48px] sm:px-4 sm:py-2"
                  >
                    <p>{index + 1}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-4 rounded-full bg-red-600" />
                      <div>
                        <p className="leading-tight">{fighter.name}</p>
                        <p className="text-xs text-slate-500 sm:hidden">
                          W {fighter.wins} | L {fighter.losses} | Rk {fighter.divisionRank}
                        </p>
                      </div>
                    </div>
                    <p className="hidden sm:block">{Math.max(0, fighter.divisionRank - 1)}</p>
                    <p className="hidden sm:block">{fighter.wins}</p>
                    <p className="hidden sm:block">{fighter.losses}</p>
                    <p className="hidden sm:block">{fighter.divisionRank}</p>
                    <Button
                      type="button"
                      size="icon-xs"
                      className="bg-[#0E2A57] hover:bg-[#12336b]"
                      onClick={() => addToQueue(fighter.id)}
                    >
                      <Plus />
                    </Button>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          <Card className="gap-0 border border-slate-200 bg-white p-0">
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <Briefcase className="size-4" />
              Picks
            </div>

            <div className="space-y-1 p-2">
              {recentPicks.length ? (
                recentPicks.map((pick) => (
                  <div
                    key={pick.id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md px-2 py-2 text-xs even:bg-slate-50"
                  >
                    <span className="inline-flex size-3 rounded-full bg-orange-500" />
                    <div>
                      <p className="font-semibold text-slate-800">{pick.teamName}</p>
                      <p className="text-slate-500">{pick.fighterName}</p>
                    </div>
                    <span className="text-slate-400">{pick.pickLabel}</span>
                  </div>
                ))
              ) : (
                <div className="rounded-md border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                  Draft picks will appear here.
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 p-3 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <UserRound className="size-4" />
                Active Seat: {activeSeat?.label ?? "Manager"}
              </p>
            </div>
          </Card>
        </div>
      </section>

      <Dialog open={isDraftCompleteModalOpen} onOpenChange={setIsDraftCompleteModalOpen}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto p-0">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="rounded-xl bg-slate-100 p-2 text-red-700 sm:p-3">
                <Trophy className="size-5 sm:size-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-red-700 sm:text-4xl lg:text-5xl">
                  YOUR DRAFT IS COMPLETE!
                </h2>
                <p className="text-sm font-semibold text-red-700 sm:text-lg">
                  Good luck in your league!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0E2A57] px-4 py-7 text-center text-white sm:px-6 sm:py-8">
            <h3 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {`${loggedInUserName.toUpperCase()}'S GREAT TEAM`}
            </h3>
            <p className="mt-2 text-sm underline underline-offset-2 sm:text-base">Go to My Team</p>
          </div>

          <div className="bg-slate-100 px-4 py-5 sm:px-6 sm:py-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {draftedTeam.map((fighter) => (
                <Card
                  key={fighter.id}
                  className="gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-none"
                >
                  <div className="relative h-36 overflow-hidden rounded-lg sm:h-40">
                    <Image
                      src={fighter.avatarUrl}
                      alt={fighter.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    />
                    <span className="absolute right-2 bottom-2 rounded bg-white px-2 py-0.5 text-xs font-bold text-red-700">
                      {fighter.nationality.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 uppercase">{fighter.weightClass}</p>
                  <p className="text-xl text-slate-700 sm:text-2xl">{fighter.name}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
            <Button
              asChild
              className="h-12 rounded-md bg-[#0E2A57] px-7 text-base hover:bg-[#12336b] sm:text-lg"
            >
              <Link href="/leagues-directory">Go to My Team</Link>
            </Button>
            <p className="text-sm font-bold tracking-[0.12em] text-slate-600 uppercase">
              Share My Top Picks!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
