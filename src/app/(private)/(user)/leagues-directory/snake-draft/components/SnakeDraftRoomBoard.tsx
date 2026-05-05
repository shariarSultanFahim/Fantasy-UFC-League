"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Briefcase, Plus, Trophy, UserRound } from "lucide-react";

import type { DraftPickItem } from "@/types/league-simulation";
import { useLeague, useAvailableFighters, useAddFighter } from "@/lib/actions/league";
import { useDivisions } from "@/hooks/use-divisions";
import { useMe } from "@/lib/actions/auth";

import {
  getLeagueQueue,
  setLeagueQueue
} from "@/helpers/league-lobby";

import { getImageUrl } from "@/lib/utils";
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
import { IFighter } from "@/types/fighter";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamSlot {
  id: string;
  label: string;
  ownerId?: string;
}

const PICK_SECONDS = 161;
const TEAM_DRAFT_TARGET = 4;

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function buildTeamSlots(teams: any[], memberLimit: number) {
  const slots: TeamSlot[] = teams.map((team, index) => ({
    id: team.id,
    label: team.name,
    ownerId: team.ownerId
  }));

  for (let index = slots.length; index < memberLimit; index += 1) {
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
  const leagueId = searchParams.get("leagueId") || "";

  const { data: userData } = useMe();
  const currentUserId = userData?.data?.id;
  const loggedInUserName = userData?.data?.name || "Member";

  const { data: leagueData, isLoading: isLoadingLeague } = useLeague(leagueId);
  const league = leagueData?.data;
  const memberLimit = league?.memberLimit ?? 10;
  const teams = league?.teams || [];

  const teamSlots = useMemo(
    () => buildTeamSlots(teams, memberLimit),
    [teams, memberLimit]
  );

  const [pickClock, setPickClock] = useState(PICK_SECONDS);
  const [currentSeatIndex, setCurrentSeatIndex] = useState(0);
  const [queue, setQueue] = useState<string[]>([]);
  const [playerSearch, setPlayerSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [isAutoPickEnabled, setIsAutoPickEnabled] = useState(true);
  const [isDraftCompleteModalOpen, setIsDraftCompleteModalOpen] = useState(false);
  const [hasShownDraftCompleteModal, setHasShownDraftCompleteModal] = useState(false);

  const { data: availableFightersData, isLoading: isLoadingFighters } = useAvailableFighters(leagueId, {
    searchTerm: playerSearch,
    divisionId: divisionFilter === "all" ? undefined : divisionFilter,
    limit: 100
  });

  const { divisions: divisionsData } = useDivisions();
  const { mutate: addFighter, isPending: isAdding } = useAddFighter(leagueId);

  useEffect(() => {
    if (leagueId) {
      setQueue(getLeagueQueue(leagueId));
    }
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

  const myTeam = useMemo(() => {
    return teams.find(t => t.ownerId === currentUserId);
  }, [teams, currentUserId]);

  const draftedFighters = myTeam?.fighters || [];

  useEffect(() => {
    if (hasShownDraftCompleteModal) {
      return;
    }

    if (draftedFighters.length >= TEAM_DRAFT_TARGET) {
      setIsDraftCompleteModalOpen(true);
      setHasShownDraftCompleteModal(true);
    }
  }, [draftedFighters.length, hasShownDraftCompleteModal]);

  const filteredPlayers = availableFightersData?.data?.data || [];

  const divisionOptions = useMemo(() => {
    return [
      { id: "all", name: "All Divisions" },
      ...(divisionsData || [])
    ];
  }, [divisionsData]);

  const activeSeat = teamSlots[currentSeatIndex];
  const isMyTurn = activeSeat?.ownerId === currentUserId;

  const handleAddFighter = (fighterId: string) => {
    if (isAdding) return;

    addFighter({ fighterId }, {
      onSuccess: () => {
        const updatedQueue = queue.filter(id => id !== fighterId);
        setQueue(updatedQueue);
        setLeagueQueue(leagueId, updatedQueue);

        // Move to next seat in simulation
        setCurrentSeatIndex((seat) => (teamSlots.length ? (seat + 1) % teamSlots.length : 0));
        setPickClock(PICK_SECONDS);
      }
    });
  };

  const draftFromQueue = () => {
    const firstQueueId = queue[0];
    if (firstQueueId) {
      handleAddFighter(firstQueueId);
    }
  };

  const addToQueue = (fighterId: string) => {
    if (queue.includes(fighterId)) {
      return;
    }

    const updatedQueue = [...queue, fighterId];
    setQueue(updatedQueue);
    setLeagueQueue(leagueId, updatedQueue);
  };

  if (isLoadingLeague) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-6 xl:grid-cols-[220px_1fr_280px]">
          <Skeleton className="h-64" />
          <Skeleton className="h-[600px]" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-6">
        <Card className="gap-0 overflow-hidden rounded-none border-none bg-[#0B2450] p-0 text-white">
          <div className="px-4 py-3 text-xs font-semibold text-slate-200 sm:px-5">
            Fantasy MMA Draft - {league?.name ?? "MMA League"}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto px-3 pb-4 sm:px-4">
            <div className="shrink-0 rounded-sm bg-red-600 px-3 py-3 text-base font-bold sm:text-lg">
              {formatClock(pickClock)}
            </div>
            {teamSlots.map((slot, index) => (
              <div
                key={slot.id}
                className={`min-w-16 shrink-0 rounded-sm px-3 py-3 text-center text-xs sm:min-w-18 sm:px-4 ${index === currentSeatIndex
                  ? "bg-red-600 text-white"
                  : "bg-slate-600 text-slate-100"
                  }`}
              >
                <p className="mb-1 text-[10px]">{index + 1}</p>
                <p className="truncate max-w-[80px]">{slot.label.split(" ")[0]}</p>
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
              disabled={!isMyTurn || queue.length === 0 || isAdding}
              className="w-full bg-[#0E2A57] hover:bg-[#12336b]"
              onClick={draftFromQueue}
            >
              {isAdding ? "Drafting..." : "Draft Top Queue"}
            </Button>

            <div className="space-y-2 border-t border-slate-200 pt-3">
              <p className="text-sm font-semibold text-slate-700">Roster ({draftedFighters.length}/{league?.rosterSize || 5})</p>
              {draftedFighters.length ? (
                draftedFighters.map((fighter) => (
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
            <Card className={`items-center justify-center border border-slate-200 px-4 py-8 text-center text-white sm:py-10 ${isMyTurn ? "bg-red-700" : "bg-[#0E2A57]"}`}>
              <p className="text-3xl font-bold sm:text-4xl">
                {initials(activeSeat?.label ?? loggedInUserName)}
              </p>
              <p className="mt-2 text-2xl font-semibold sm:text-4xl">
                {isMyTurn ? "Your turn to pick!" : "Waiting for pick..."}
              </p>
              <p className="text-sm text-slate-300">
                Seat {currentSeatIndex + 1} of {memberLimit}
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

              <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
                <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="All Divisions" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisionOptions.map((division) => (
                      <SelectItem key={division.id} value={division.id}>
                        {division.name}
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

                {isLoadingFighters ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-4 py-3"><Skeleton className="h-8 w-full" /></div>
                  ))
                ) : filteredPlayers.length > 0 ? (
                  filteredPlayers.slice(0, 10).map((fighter, index) => (
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
                      <p className="hidden sm:block">{Math.max(0, (fighter.divisionRank || 1) - 1)}</p>
                      <p className="hidden sm:block">{fighter.wins}</p>
                      <p className="hidden sm:block">{fighter.losses}</p>
                      <p className="hidden sm:block">{fighter.divisionRank}</p>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="outline"
                          onClick={() => addToQueue(fighter.id)}
                        >
                          <Plus />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={!isMyTurn || isAdding}
                          className="bg-[#0E2A57] hover:bg-[#12336b] text-[10px]"
                          onClick={() => handleAddFighter(fighter.id)}
                        >
                          DRAFT
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400">No fighters found.</div>
                )}
              </Card>
            </div>
          </div>

          <Card className="gap-0 border border-slate-200 bg-white p-0">
            <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <Briefcase className="size-4" />
              Picks
            </div>

            <div className="space-y-1 p-2">
              <div className="rounded-md border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                Recent picks will appear here as they are made.
              </div>
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
              {draftedFighters.map((fighter) => (
                <Card
                  key={fighter.id}
                  className="gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-none"
                >
                  <div className="relative h-36 overflow-hidden rounded-lg sm:h-40">
                    <Image
                      src={getImageUrl(fighter.avatarUrl)}
                      alt={fighter.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    />
                    <span className="absolute right-2 bottom-2 rounded bg-white px-2 py-0.5 text-xs font-bold text-red-700">
                      {fighter.nationality?.slice(0, 3).toUpperCase() || "USA"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 uppercase">{fighter.division?.name || "MMA"}</p>
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
              <Link href={`/leagues-directory/my-team?leagueId=${leagueId}`}>Go to My Team</Link>
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
