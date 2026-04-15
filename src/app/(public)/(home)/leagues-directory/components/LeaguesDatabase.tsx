"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { LeagueLobbyEntry } from "@/types/league";

import {
  getCurrentLoggedInUserName,
  getJoinedLeagueMembers,
  joinLeagueLobby,
  setLeagueDraftStatus,
  upsertLeagueLobbyMeta
} from "@/helpers/league-lobby";

import { Button, Card } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LEAGUE_LOBBY_DATA } from "./data";
import { LeaguesPagination } from "./LeaguesPagination";
import { LeaguesTable } from "./LeaguesTable";

const LEAGUES_PER_PAGE = 8;
const INSTANT_LEAGUE_ID = "instant-league";
const INSTANT_LEAGUE_NAME = "Instant League";
const INSTANT_LEAGUE_MEMBER_LIMIT = 10;
type LeaguesDirectoryView = "all" | "my";

export function LeaguesDatabase() {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [activeView, setActiveView] = React.useState<LeaguesDirectoryView>("all");
  const [myLeagueIds, setMyLeagueIds] = React.useState<string[]>([]);
  const [selectedLeague, setSelectedLeague] = React.useState<LeagueLobbyEntry | null>(null);
  const [enteredPasscode, setEnteredPasscode] = React.useState("");
  const [passcodeError, setPasscodeError] = React.useState("");

  const allLeagues = LEAGUE_LOBBY_DATA;
  const refreshMyLeagues = React.useCallback(() => {
    const currentUserName = getCurrentLoggedInUserName().toLowerCase();

    const joinedLeagueIds = allLeagues
      .filter((league) =>
        getJoinedLeagueMembers(league.id).some(
          (member) => member.name.toLowerCase() === currentUserName
        )
      )
      .map((league) => league.id);

    setMyLeagueIds(joinedLeagueIds);
  }, [allLeagues]);

  React.useEffect(() => {
    refreshMyLeagues();
  }, [refreshMyLeagues]);

  React.useEffect(() => {
    setPage(1);
  }, [activeView]);

  const leaguesToDisplay = React.useMemo(() => {
    if (activeView === "all") {
      return allLeagues;
    }

    const joinedLeagues = new Set(myLeagueIds);
    return allLeagues
      .filter((league) => joinedLeagues.has(league.id))
      .map((league) => ({
        ...league,
        actionLabel: "View",
        actionStyle: "dark",
        hasPasscode: false,
        passcode: undefined
      }));
  }, [activeView, allLeagues, myLeagueIds]);

  React.useEffect(() => {
    const totalPageCount = Math.max(1, Math.ceil(leaguesToDisplay.length / LEAGUES_PER_PAGE));

    if (page > totalPageCount) {
      setPage(1);
    }
  }, [leaguesToDisplay.length, page]);

  const draftingRooms = leaguesToDisplay.length;
  const fullRooms = leaguesToDisplay.filter(
    (league) => league.members >= league.memberLimit
  ).length;

  const totalPage = Math.ceil(leaguesToDisplay.length / LEAGUES_PER_PAGE);
  const startIndex = (page - 1) * LEAGUES_PER_PAGE;
  const endIndex = startIndex + LEAGUES_PER_PAGE;
  const paginatedLeagues = leaguesToDisplay.slice(startIndex, endIndex);

  const navigateToDraftLobby = (league: LeagueLobbyEntry) => {
    upsertLeagueLobbyMeta({
      id: league.id,
      name: league.name,
      memberLimit: league.memberLimit
    });
    setLeagueDraftStatus(league.id, "waiting");
    joinLeagueLobby(league.id);
    router.push(`/leagues-directory/draft-lobby?leagueId=${league.id}`);
  };

  const handleLeagueAction = (league: LeagueLobbyEntry) => {
    if (activeView === "my") {
      router.push(`/leagues-directory/my-team?leagueId=${league.id}`);
      return;
    }

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
    setLeagueDraftStatus(INSTANT_LEAGUE_ID, "waiting");
    joinLeagueLobby(INSTANT_LEAGUE_ID);
    refreshMyLeagues();
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

      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value as LeaguesDirectoryView)}
        className="w-full"
      >
        <TabsList className="h-11 rounded-md bg-slate-100 p-1">
          <TabsTrigger value="all" className="px-5 text-sm font-semibold">
            Leagues Directory
          </TabsTrigger>
          <TabsTrigger value="my" className="px-5 text-sm font-semibold">
            My Leagues
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {activeView === "my" && leaguesToDisplay.length === 0 ? (
        <Card className="border border-dashed border-slate-200 bg-white p-10 text-center">
          <h3 className="text-base font-semibold text-slate-900">No joined leagues yet</h3>
          <p className="mt-2 text-sm text-slate-600">
            Join a league from the directory tab and it will appear here.
          </p>
        </Card>
      ) : (
        <LeaguesTable leagues={paginatedLeagues} onActionClick={handleLeagueAction} />
      )}

      {leaguesToDisplay.length > 0 ? (
        <LeaguesPagination
          page={page}
          limit={LEAGUES_PER_PAGE}
          totalCount={leaguesToDisplay.length}
          totalPage={totalPage}
          onPageChange={setPage}
        />
      ) : null}

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
