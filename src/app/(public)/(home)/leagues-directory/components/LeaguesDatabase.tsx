"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { LeagueLobbyEntry } from "@/types/league";

import { joinLeagueLobby, upsertLeagueLobbyMeta } from "@/helpers/league-lobby";

import { Button, Card } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { LEAGUE_LOBBY_DATA } from "./data";
import { LeaguesPagination } from "./LeaguesPagination";
import { LeaguesTable } from "./LeaguesTable";

const LEAGUES_PER_PAGE = 8;
const INSTANT_LEAGUE_ID = "instant-league";
const INSTANT_LEAGUE_NAME = "Instant League";
const INSTANT_LEAGUE_MEMBER_LIMIT = 10;

export function LeaguesDatabase() {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [selectedLeague, setSelectedLeague] = React.useState<LeagueLobbyEntry | null>(null);
  const [enteredPasscode, setEnteredPasscode] = React.useState("");
  const [passcodeError, setPasscodeError] = React.useState("");

  const allLeagues = LEAGUE_LOBBY_DATA;
  const draftingRooms = allLeagues.length;
  const fullRooms = allLeagues.filter((league) => league.members >= league.memberLimit).length;

  const totalPage = Math.ceil(allLeagues.length / LEAGUES_PER_PAGE);
  const startIndex = (page - 1) * LEAGUES_PER_PAGE;
  const endIndex = startIndex + LEAGUES_PER_PAGE;
  const paginatedLeagues = allLeagues.slice(startIndex, endIndex);

  const navigateToDraftLobby = (league: LeagueLobbyEntry) => {
    upsertLeagueLobbyMeta({
      id: league.id,
      name: league.name,
      memberLimit: league.memberLimit
    });
    joinLeagueLobby(league.id);
    router.push(`/leagues-directory/draft-lobby?leagueId=${league.id}`);
  };

  const handleLeagueAction = (league: LeagueLobbyEntry) => {
    if (league.actionStyle === "muted") {
      return;
    }

    if (!league.hasPasscode) {
      navigateToDraftLobby(league);
      return;
    }

    setSelectedLeague(league);
    setEnteredPasscode("");
    setPasscodeError("");
  };

  const handlePasscodeSubmit = () => {
    if (!selectedLeague) {
      return;
    }

    if (enteredPasscode.trim() !== (selectedLeague.passcode ?? "")) {
      setPasscodeError("Incorrect passcode. Please try again.");
      return;
    }

    navigateToDraftLobby(selectedLeague);
    setSelectedLeague(null);
    setEnteredPasscode("");
    setPasscodeError("");
  };

  const handleInstantLeagueJoin = () => {
    upsertLeagueLobbyMeta({
      id: INSTANT_LEAGUE_ID,
      name: INSTANT_LEAGUE_NAME,
      memberLimit: INSTANT_LEAGUE_MEMBER_LIMIT
    });
    joinLeagueLobby(INSTANT_LEAGUE_ID);
    router.push(`/leagues-directory/draft-lobby?leagueId=${INSTANT_LEAGUE_ID}`);
  };

  return (
    <section className="space-y-4">
      <Card className="overflow-hidden border border-slate-200 bg-white p-0">
        <div className="relative h-48 w-full sm:h-56 lg:h-64">
          <Image
            src="/animated.png"
            alt="Mock draft lobby banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0E172B]/80 via-[#0E172B]/45 to-[#0E172B]/80" />
        </div>
      </Card>

      <Card className="gap-4 border border-slate-200 p-4 sm:p-5">
        <h2 className="text-xl font-semibold text-slate-900">Mock Draft Lobby</h2>

        <div className="h-0.5 w-full bg-[#EC5B13]" />

        <Card className="grid grid-cols-1 gap-4 rounded-md border border-slate-200 p-4 lg:grid-cols-[180px_180px_1fr_auto_auto] lg:items-center">
          <div className="rounded-md bg-slate-100 px-4 py-3 text-center">
            <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              Drafting Rooms
            </p>
            <p className="text-3xl font-black text-slate-900">{draftingRooms}</p>
          </div>
          <div className="rounded-md bg-slate-100 px-4 py-3 text-center">
            <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              Full Rooms
            </p>
            <p className="text-3xl font-black text-slate-900">{fullRooms}</p>
          </div>
          <p className="text-center text-sm font-medium text-slate-700 lg:text-right">
            Don&apos;t want to wait? Enter a room here and draft now!
          </p>
          <Button
            type="button"
            onClick={handleInstantLeagueJoin}
            className="h-9 bg-indigo-900 px-5 text-xs font-semibold hover:bg-indigo-800"
          >
            Join a League
          </Button>
          <Button
            asChild
            className="h-9 bg-indigo-900 px-5 text-xs font-semibold hover:bg-indigo-800"
          >
            <Link href="/leagues-directory/create">Create League</Link>
          </Button>
        </Card>
      </Card>

      <LeaguesTable leagues={paginatedLeagues} onActionClick={handleLeagueAction} />

      <LeaguesPagination
        page={page}
        limit={LEAGUES_PER_PAGE}
        totalCount={allLeagues.length}
        totalPage={totalPage}
        onPageChange={setPage}
      />

      <Dialog
        open={Boolean(selectedLeague)}
        onOpenChange={(isOpen: boolean) => !isOpen && setSelectedLeague(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enter League Passcode</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              This is a private league. Enter passcode to join {selectedLeague?.name}.
            </p>
            <Input
              value={enteredPasscode}
              onChange={(event) => {
                setEnteredPasscode(event.target.value);
                setPasscodeError("");
              }}
              placeholder="Enter passcode"
              autoFocus
            />
            {passcodeError ? <p className="text-sm text-red-600">{passcodeError}</p> : null}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setSelectedLeague(null)}>
                Cancel
              </Button>
              <Button type="button" onClick={handlePasscodeSubmit}>
                Join League
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
