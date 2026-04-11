"use client";

import * as React from "react";

import { CircleEllipsis, Pause, PlayIcon, RotateCcw, SkipForward, TimerReset } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button, Card, CardContent } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { DRAFT_ROOM_SNAPSHOT, DRAFT_TEAMS } from "./draft-data";

const currentPickCards = [
  {
    pick: "Pick 1.01",
    fighterName: "Jon Jones",
    division: "Heavyweight",
    imageUrl: "/demo.jpeg"
  },
  {
    pick: "Pick 1.02",
    fighterName: "Islam Makhachev",
    division: "Lightweight",
    imageUrl: "/demo.jpeg"
  },
  {
    pick: "Pick 1.03",
    fighterName: "Leon Edwards",
    division: "Welterweight",
    imageUrl: "/demo.jpeg"
  },
  {
    pick: "Pick 1.04",
    fighterName: "Alex Pereira",
    division: "Light Heavyweight",
    imageUrl: "/demo.jpeg"
  }
];

const ringSegments = ["w-full", "w-11/12", "w-4/5", "w-3/4", "w-3/5", "w-1/2"];
const INITIAL_SECONDS = DRAFT_ROOM_SNAPSHOT.secondsLeft;
const INITIAL_PICK_NUMBER = Number(DRAFT_ROOM_SNAPSHOT.activePickLabel.replace(/\D/g, "")) || 1;

export function DraftOverviewSection() {
  const [isPaused, setIsPaused] = React.useState(false);
  const [secondsLeft, setSecondsLeft] = React.useState(INITIAL_SECONDS);
  const [activePickNumber, setActivePickNumber] = React.useState(INITIAL_PICK_NUMBER);

  React.useEffect(() => {
    if (isPaused || secondsLeft === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((currentSeconds) => Math.max(0, currentSeconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPaused, secondsLeft]);

  const handlePauseToggle = () => {
    setIsPaused((currentPaused) => !currentPaused);
  };

  const handleSkipPick = () => {
    setActivePickNumber((currentPick) => currentPick + 1);
    setSecondsLeft(INITIAL_SECONDS);
    setIsPaused(false);
  };

  const handleResetDraft = () => {
    setActivePickNumber(INITIAL_PICK_NUMBER);
    setSecondsLeft(INITIAL_SECONDS);
    setIsPaused(false);
  };

  const countdownBandClass = ringSegments[Math.min(5, Math.floor(secondsLeft / 10))];

  return (
    <section className="space-y-5">
      <div className="grid items-center gap-4 xl:grid-cols-[1.2fr_0.95fr_1fr]">
        <Card className="gap-0 border-indigo-300/60 py-0">
          <CardContent className="px-5 py-5">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                <TimerReset className="size-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex rounded-md bg-indigo-900 px-2 py-0.5 text-[10px] font-semibold tracking-[0.16em] text-indigo-100 uppercase">
                  On The Clock
                </span>
                <h3 className="text-3xl leading-tight font-semibold tracking-tight text-slate-900">
                  {DRAFT_ROOM_SNAPSHOT.roomName}
                </h3>
                <p className="text-sm text-slate-600">
                  {DRAFT_ROOM_SNAPSHOT.roundLabel}, Pick {activePickNumber}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 border-none bg-transparent py-0 shadow-none">
          <CardContent className="bg-transparent px-5 py-5">
            <div className="mx-auto flex size-32 flex-col items-center justify-center rounded-full border-4 border-indigo-900/20 bg-transparent p-20">
              <div className="h-2 w-full rounded-full bg-transparent">
                <div className={cn("h-full rounded-full bg-indigo-900", countdownBandClass)} />
              </div>
              <p className="mt-4 text-5xl leading-none font-semibold tracking-tight text-slate-900">
                00:{String(secondsLeft).padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                Seconds Left
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="space-y-3 px-5 py-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                Admin Controls
              </p>
              <span className="size-2 rounded-full bg-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button type="button" className="w-full" onClick={handlePauseToggle}>
                {isPaused ? <PlayIcon className="size-4" /> : <Pause className="size-4" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full bg-muted text-muted-foreground hover:bg-muted/80"
                onClick={handleSkipPick}
              >
                <SkipForward className="size-4" />
                Skip
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="col-span-2 justify-center bg-muted text-muted-foreground hover:bg-muted/80"
                onClick={handleResetDraft}
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Live Draft Board</h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {DRAFT_TEAMS.map((team) => (
            <Card
              key={team.id}
              className={cn(
                "gap-0 py-0",
                team.isActive ? "border-indigo-400/70 shadow-sm" : "border-border/70"
              )}
            >
              <CardContent className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-md bg-linear-to-br from-slate-900 to-indigo-800 text-xs font-semibold text-white">
                    {team.code}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                      {team.slotLabel}
                    </p>
                    <p className="font-semibold text-slate-900">{team.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {currentPickCards.map((pickCard) => (
            <Card key={pickCard.pick} className="gap-0 py-0">
              <CardContent className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={pickCard.imageUrl} alt={pickCard.fighterName} />
                    <AvatarFallback>{pickCard.fighterName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-indigo-700 uppercase">
                      {pickCard.pick}
                    </p>
                    <p className="font-semibold text-slate-900">{pickCard.fighterName}</p>
                    <p className="text-xs text-slate-500">{pickCard.division}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="border-dashed border-indigo-300/70 bg-indigo-50/40 py-0">
            <CardContent className="flex h-full min-h-24 items-center justify-center px-4 py-3 text-indigo-800">
              <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.12em] uppercase">
                <CircleEllipsis className="size-4" />
                Picking Now...
              </span>
            </CardContent>
          </Card>
        </div>
      </section>
    </section>
  );
}
