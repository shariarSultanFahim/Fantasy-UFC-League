"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ILeague, LeagueLobbyEntry, LeagueStatus } from "@/types/league";
import { useAvailableLeagues, useMyLeagues, useJoinLeague, useQuickJoin } from "@/lib/actions/league";
import { useMe } from "@/lib/actions/auth";

import {
  joinLeagueLobby,
  setLeagueDraftStatus,
  upsertLeagueLobbyMeta
} from "@/helpers/league-lobby";

import { Button, Card } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LeaguesPagination } from "./LeaguesPagination";
import { LeaguesTable } from "./LeaguesTable";

const LEAGUES_PER_PAGE = 8;
type LeaguesDirectoryView = "all" | "my";

export function LeaguesDatabase() {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeView, setActiveView] = React.useState<LeaguesDirectoryView>("all");
  const [selectedLeague, setSelectedLeague] = React.useState<LeagueLobbyEntry | null>(null);
  const [enteredPasscode, setEnteredPasscode] = React.useState("");
  const [passcodeError, setPasscodeError] = React.useState("");

  const { data: allLeaguesData, isLoading: isLoadingAll } = useAvailableLeagues({
    searchTerm,
    page,
    limit: LEAGUES_PER_PAGE,
  });

  const { data: myLeaguesData, isLoading: isLoadingMy } = useMyLeagues();
  const { mutate: joinLeague, isPending: isJoining } = useJoinLeague();
  const { mutate: quickJoin, isPending: isQuickJoining } = useQuickJoin();

  const { data: userData } = useMe();
  const userName = userData?.data?.name || "Member";
  const defaultTeamName = `${userName}'s Team`;

  const myLeagueIds = React.useMemo(() => 
    new Set((myLeaguesData?.data || []).map(l => l.id)),
    [myLeaguesData]
  );

  const mapLeagueToLobbyEntry = (league: ILeague): LeagueLobbyEntry => {
    const isMyLeague = myLeagueIds.has(league.id);
    const hasPasscode = typeof league.isPrivate === "boolean" ? league.isPrivate : !!league.passcode;
    
    // Precise draft start check
    const draftTimeMs = league.draftTime ? new Date(league.draftTime).getTime() : 0;
    const isDraftStarted = 
      league.draftSession?.status === "DRAFTING" || 
      (draftTimeMs > 0 && draftTimeMs <= Date.now());

    let actionLabel = isMyLeague ? "View" : "Join";
    if (isMyLeague) {
      actionLabel = isDraftStarted ? "Enter The Draft" : "View";
    }

    return {
      id: league.id,
      code: league.code,
      name: league.name,
      hasPasscode,
      draftTime: league.draftTime ? new Date(league.draftTime).toLocaleString() : "N/A",
      members: league._count?.teams ?? league._count?.members ?? league.teams?.length ?? 0,
      memberLimit: league.memberLimit,
      actionLabel,
      actionStyle: isMyLeague ? "dark" : (league._count?.teams ?? 0) >= league.memberLimit ? "muted" : "dark",
      isDraftStarted,
      categories: ["LEADERBOARD", "MY TEAM", "FREE AGENTS"],
    };
  };

  const leaguesToDisplay = React.useMemo<LeagueLobbyEntry[]>(() => {
    if (activeView === "all") {
      return (allLeaguesData?.data?.data || []).map(l => mapLeagueToLobbyEntry(l));
    }
    return (myLeaguesData?.data || []).map(l => mapLeagueToLobbyEntry(l));
  }, [activeView, allLeaguesData, myLeaguesData, myLeagueIds]);

  const totalCount = activeView === "all" ? (allLeaguesData?.data?.meta.total || 0) : leaguesToDisplay.length;
  const totalPage = activeView === "all" ? (allLeaguesData?.data?.meta.totalPage || 1) : 1;

  const paginatedLeagues = leaguesToDisplay;

  const draftingRooms = allLeaguesData?.data?.meta.total || 0;
  const fullRooms = (allLeaguesData?.data?.data || []).filter(
    (league) => (league._count?.teams || 0) >= league.memberLimit
  ).length;

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
    // If joined, determine if we go to the lobby (countdown) or the active draft
    if (activeView === "my" || myLeagueIds.has(league.id)) {
      if (league.isDraftStarted) {
        router.push(`/leagues-directory/snake-draft?leagueId=${league.id}`);
      } else {
        router.push(`/leagues-directory/draft-lobby?leagueId=${league.id}`);
      }
      return;
    }

    if (league.actionStyle === "muted") {
      return;
    }

    if (!league.hasPasscode) {
      joinLeague({
        code: league.code,
        teamName: defaultTeamName
      }, {
        onSuccess: () => {
          navigateToDraftLobby(league);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to join league.");
        }
      });
      return;
    }

    setSelectedLeague(league);
    setEnteredPasscode("");
    setPasscodeError("");
  };

  const handlePasscodeSubmit = () => {
    if (!selectedLeague) return;

    joinLeague({
      code: selectedLeague.code,
      passcode: enteredPasscode,
      teamName: defaultTeamName
    }, {
      onSuccess: () => {
        navigateToDraftLobby(selectedLeague);
        setSelectedLeague(null);
      },
      onError: (err: any) => {
        setPasscodeError(err?.response?.data?.message || "Failed to join league.");
      }
    });
  };

  const handleInstantLeagueJoin = () => {
    quickJoin({ teamName: defaultTeamName }, {
      onSuccess: (res) => {
        const league = res.data;
        const entry = mapLeagueToLobbyEntry(league);
        navigateToDraftLobby(entry);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to quick join.");
      }
    });
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeView}
          onValueChange={(value) => {
            setActiveView(value as LeaguesDirectoryView);
            setPage(1);
          }}
          className="w-full sm:w-auto"
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

        {activeView === "all" && (
          <div className="relative w-full sm:max-w-xs">
            <Input
              type="text"
              placeholder="Search leagues..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="bg-white pr-10"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}
      </div>

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
          totalCount={totalCount}
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
