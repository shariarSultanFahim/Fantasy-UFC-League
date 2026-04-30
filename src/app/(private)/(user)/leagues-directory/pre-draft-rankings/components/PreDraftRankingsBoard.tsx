"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { ChevronDown, ChevronUp, Clock3, GripVertical, Plus, Search, X } from "lucide-react";

import type { LeagueFighter } from "@/types/league-simulation";

import { getLeagueQueue, setLeagueQueue } from "@/helpers/league-lobby";

import { LEAGUE_FIGHTERS } from "@/data/league-fighters";

import { Button, Card, Input } from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const MAX_QUEUE_SIZE = 20;
const PRE_DRAFT_SECONDS = 15 * 60 + 30;

function formatCountDown(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function PreDraftRankingsBoard() {
  const searchParams = useSearchParams();
  const leagueId = searchParams.get("leagueId") ?? "instant-league";

  const [secondsLeft, setSecondsLeft] = useState(PRE_DRAFT_SECONDS);
  const [nameSearch, setNameSearch] = useState("");
  const [queueSearch, setQueueSearch] = useState("");
  const [weightClassFilter, setWeightClassFilter] = useState("all");
  const [rankFilter, setRankFilter] = useState("all");
  const [queue, setQueue] = useState<string[]>(() => {
    const existingQueue = getLeagueQueue(leagueId);

    if (existingQueue.length) {
      return existingQueue;
    }

    const fallbackQueue = LEAGUE_FIGHTERS.slice(0, 3).map((fighter) => fighter.id);
    setLeagueQueue(leagueId, fallbackQueue);
    return fallbackQueue;
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const queueFighterIdSet = useMemo(() => new Set(queue), [queue]);

  const availableFighters = useMemo(() => {
    return LEAGUE_FIGHTERS.filter((fighter) => {
      if (queueFighterIdSet.has(fighter.id)) {
        return false;
      }

      const matchesSearch = fighter.name.toLowerCase().includes(nameSearch.toLowerCase());
      const matchesWeightClass =
        weightClassFilter === "all" || fighter.weightClass.toLowerCase() === weightClassFilter;
      const matchesRank =
        rankFilter === "all" ||
        (rankFilter === "top-3" && fighter.divisionRank <= 3) ||
        (rankFilter === "top-5" && fighter.divisionRank <= 5);

      return matchesSearch && matchesWeightClass && matchesRank;
    });
  }, [nameSearch, queueFighterIdSet, rankFilter, weightClassFilter]);

  const queueFighters = useMemo(() => {
    return queue
      .map((id) => LEAGUE_FIGHTERS.find((fighter) => fighter.id === id))
      .filter((fighter): fighter is LeagueFighter => Boolean(fighter))
      .filter((fighter) => fighter.name.toLowerCase().includes(queueSearch.toLowerCase()));
  }, [queue, queueSearch]);

  const addToQueue = (fighterId: string) => {
    setQueue((previous) => {
      if (previous.includes(fighterId) || previous.length >= MAX_QUEUE_SIZE) {
        return previous;
      }

      const updated = [...previous, fighterId];
      setLeagueQueue(leagueId, updated);
      return updated;
    });
  };

  const addFirstAvailableToQueue = () => {
    const firstFighter = availableFighters[0];

    if (!firstFighter) {
      return;
    }

    addToQueue(firstFighter.id);
  };

  const clearQueue = () => {
    setLeagueQueue(leagueId, []);
    setQueue([]);
  };

  const removeFromQueue = (fighterId: string) => {
    setQueue((previous) => {
      const updated = previous.filter((id) => id !== fighterId);
      setLeagueQueue(leagueId, updated);
      return updated;
    });
  };

  const moveQueueItem = (fighterId: string, direction: "up" | "down") => {
    setQueue((previous) => {
      const index = previous.findIndex((id) => id === fighterId);

      if (index < 0) {
        return previous;
      }

      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= previous.length) {
        return previous;
      }

      const updated = [...previous];
      const current = updated[index];
      updated[index] = updated[targetIndex] ?? current;
      updated[targetIndex] = current;

      setLeagueQueue(leagueId, updated);
      return updated;
    });
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          Pre-Draft Rankings & Queue
        </h1>
        <p className="text-base text-slate-600">
          Set your priority list. Fighters will be drafted in this order when it&apos;s your turn.
        </p>
        <p className="flex items-center gap-2 text-xl font-semibold text-red-600">
          <Clock3 className="size-5" />
          Time Remaining: {formatCountDown(secondsLeft)}
        </p>
      </div>

      <div className="h-px w-full bg-slate-300" />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="gap-0 border border-slate-300 bg-slate-100 p-0">
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-3xl font-semibold text-slate-900">Available Fighters</h2>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                Not in Queue: {availableFighters.length}
              </span>
            </div>

            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-11 bg-white pl-10"
                placeholder="Search by Name..."
                value={nameSearch}
                onChange={(event) => setNameSearch(event.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <Select value={weightClassFilter} onValueChange={setWeightClassFilter}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Weight Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Weight Class</SelectItem>
                  <SelectItem value="featherweight">Featherweight</SelectItem>
                  <SelectItem value="heavyweight">Heavyweight</SelectItem>
                  <SelectItem value="bantamweight">Bantamweight</SelectItem>
                  <SelectItem value="lightweight">Lightweight</SelectItem>
                  <SelectItem value="flyweight">Flyweight</SelectItem>
                </SelectContent>
              </Select>

              <Select value={rankFilter} onValueChange={setRankFilter}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Division Rank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Division Rank</SelectItem>
                  <SelectItem value="top-3">Top 3</SelectItem>
                  <SelectItem value="top-5">Top 5</SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="button"
                className="h-11 bg-[#0E2A57] px-6 hover:bg-[#12336b]"
                onClick={addFirstAvailableToQueue}
              >
                Add to Queue
              </Button>
            </div>
          </div>

          <div className="border-t border-slate-300">
            {availableFighters.slice(0, 6).map((fighter) => (
              <div
                key={fighter.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-slate-200 bg-[#f3f4f6] px-4 py-3 last:border-b-0 even:bg-[#e5e7eb]"
              >
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-300 px-2 text-sm font-semibold text-slate-700">
                  #{fighter.divisionRank}
                </span>

                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <Image
                    src={fighter.avatarUrl}
                    alt={fighter.name}
                    width={42}
                    height={42}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{fighter.name}</p>
                    <p className="text-sm text-slate-500">{fighter.weightClass}</p>
                  </div>
                  <div className="hidden gap-6 text-sm text-slate-600 md:flex">
                    <p>
                      Wins <span className="font-semibold text-slate-800">{fighter.wins}</span>
                    </p>
                    <p>
                      Losses <span className="font-semibold text-slate-800">{fighter.losses}</span>
                    </p>
                    <p>
                      Avg Pts{" "}
                      <span className="font-semibold text-slate-800">{fighter.avgPoints}</span>
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="icon-sm"
                  className="bg-[#0E2A57] hover:bg-[#12336b]"
                  onClick={() => addToQueue(fighter.id)}
                >
                  <Plus />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="gap-0 border border-slate-300 bg-slate-100 p-0">
          <div className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-3xl font-semibold text-slate-900">My Pick Queue</h2>
              <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                Queue Size: {queue.length}/{MAX_QUEUE_SIZE}
              </span>
            </div>

            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-11 bg-white pl-10"
                placeholder="Search your queue..."
                value={queueSearch}
                onChange={(event) => setQueueSearch(event.target.value)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button type="button" className="h-11 bg-[#0E2A57] hover:bg-[#12336b]">
                Save Ranking
              </Button>
              <Button type="button" variant="outline" className="h-11" onClick={clearQueue}>
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-300 p-3">
            {queueFighters.length ? (
              queueFighters.map((fighter, index) => (
                <div
                  key={fighter.id}
                  className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 rounded-lg border border-slate-200 bg-[#e5e7eb] px-3 py-2"
                >
                  <GripVertical className="size-4 text-slate-400" />
                  <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-teal-500 px-2 text-sm font-semibold text-white">
                    #{index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <Image
                      src={fighter.avatarUrl}
                      alt={fighter.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="text-base font-semibold text-slate-900">{fighter.name}</p>
                      <p className="text-xs text-slate-500">{fighter.weightClass}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-slate-300"
                      onClick={() => moveQueueItem(fighter.id, "up")}
                      aria-label="Move up"
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-slate-300"
                      onClick={() => moveQueueItem(fighter.id, "down")}
                      aria-label="Move down"
                    >
                      <ChevronDown className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1 text-red-500 hover:bg-red-50"
                      onClick={() => removeFromQueue(fighter.id)}
                      aria-label="Remove"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                No fighters in queue.
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
