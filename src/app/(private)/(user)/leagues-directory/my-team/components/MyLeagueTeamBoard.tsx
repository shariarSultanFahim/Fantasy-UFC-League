"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import type { LeagueFighter } from "@/types/league-simulation";
import type { RankFilter, TeamFighterRow } from "@/types/my-team";

import { getLeagueLobbyMeta } from "@/helpers/league-lobby";

import { LEAGUE_FIGHTERS } from "@/data/league-fighters";

import { Button } from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LEADERBOARD_ROWS } from "./data/leaderboard-rows";
import { AddFighterModal } from "./modals/AddFighterModal";
import { RemoveFighterModal } from "./modals/RemoveFighterModal";
import { FreeAgentsTab } from "./tabs/FreeAgentsTab";
import { LeaderboardTab } from "./tabs/LeaderboardTab";
import { MyTeamTab } from "./tabs/MyTeamTab";

import { useLeague, useAvailableFighters, useAddFighter, useRemoveFighter } from "@/lib/actions/league";
import { useMe } from "@/lib/actions/auth";
import { useDivisions } from "@/hooks/use-divisions";
import { IFighter } from "@/types/fighter";
import { ITeam, LeaderboardRow } from "@/types/league";

type LeagueTeamTab = "my-team" | "free-agents" | "leaderboard";

function decimalToPointString(value: number) {
  return value.toFixed(3).replace("0.", ".");
}

function mapFighterToTeamRow(fighter: IFighter): TeamFighterRow {
  const championship = (fighter.rank && fighter.rank <= 3) ? 1 : 0;
  const finishWins = Math.max(1, Math.floor(fighter.wins * 0.4));
  const regularWins = Math.max(0, fighter.wins - finishWins);
  const fin = Math.max(0, finishWins - 1);
  const cc = championship;

  return {
    id: fighter.id,
    fighterName: fighter.name,
    weightClass: fighter.division?.name || "Unknown",
    avatarUrl: fighter.avatarUrl || "/fighter-placeholder.png",
    championship,
    wins: fighter.wins,
    fiveRw: finishWins,
    rw: regularWins,
    fin,
    cc,
    totalPoints: (fighter.avgL5 / 10).toFixed(1)
  };
}

function mapFighterToLeagueFighter(fighter: IFighter): LeagueFighter {
  return {
    id: fighter.id,
    name: fighter.name,
    weightClass: fighter.division?.name || "Unknown",
    nationality: fighter.nationality,
    wins: fighter.wins,
    losses: fighter.losses,
    avgPoints: fighter.avgL5,
    divisionRank: fighter.rank || 0,
    avatarUrl: fighter.avatarUrl || "/fighter-placeholder.png"
  };
}

export function MyLeagueTeamBoard() {
  const searchParams = useSearchParams();
  const leagueId = searchParams.get("leagueId") ?? "league-001";
  
  const { data: leagueResponse, isLoading: isLoadingLeague } = useLeague(leagueId);
  const { data: userResponse } = useMe();
  const { divisions } = useDivisions();
  
  const [activeTab, setActiveTab] = useState<LeagueTeamTab>("my-team");
  const [freeAgentSearch, setFreeAgentSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [nationalityFilter, setNationalityFilter] = useState("all");
  const [rankFilter, setRankFilter] = useState<RankFilter>("all");

  const { data: availableFightersResponse, isLoading: isLoadingFighters } = useAvailableFighters(leagueId, {
    searchTerm: freeAgentSearch,
    divisionId: divisionFilter === "all" ? undefined : divisionFilter,
    page: 1,
    limit: 100,
  });

  const { mutate: addFighter, isPending: isAdding } = useAddFighter(leagueId);
  const { mutate: removeFighter, isPending: isRemoving } = useRemoveFighter(leagueId);

  const league = leagueResponse?.data;
  const user = userResponse?.data;
  const myTeam = useMemo(() => {
    if (!league?.teams || !user) return null;
    return league.teams.find(t => t.ownerId === user.id);
  }, [league, user]);

  const [fighterToRemove, setFighterToRemove] = useState<TeamFighterRow | null>(null);
  const [fighterToAdd, setFighterToAdd] = useState<LeagueFighter | null>(null);

  const teamRows = useMemo(() => {
    if (!myTeam?.fighters) return [];
    return myTeam.fighters.map(mapFighterToTeamRow);
  }, [myTeam]);

  const freeAgents = useMemo(() => {
    const fighters = (availableFightersResponse?.data?.data || []) as IFighter[];
    return fighters.map(mapFighterToLeagueFighter);
  }, [availableFightersResponse]);

  const leaderboardRows = useMemo<any[]>(() => {
    if (!league?.teams) return [];
    // Sort teams by points for leaderboard
    const sortedTeams = [...league.teams].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    
    return sortedTeams.map((team, index) => {
      const topTeamPoints = sortedTeams[0].totalPoints || 0;
      const ptsBack = index === 0 ? 0 : topTeamPoints - (team.totalPoints || 0);

      return {
        teamId: team.id,
        rank: index + 1,
        teamName: team.name,
        iconClassName: "bg-indigo-600",
        iconGlyph: team.name.charAt(0).toUpperCase(),
        totals: {
          r: 0, hr: 0, rbi: 0, sb: 0, avg: 0, k: 0, w: 0, sv: 0, hd: 0, era: 0, whip: 0,
          tot: team.totalPoints || 0,
          chg: 0
        }
      };
    });
  }, [league]);

  const handleConfirmRemove = () => {
    if (!fighterToRemove) return;
    removeFighter({ fighterId: fighterToRemove.id }, {
      onSuccess: () => setFighterToRemove(null)
    });
  };

  const handleConfirmAdd = () => {
    if (!fighterToAdd) return;
    addFighter({ fighterId: fighterToAdd.id }, {
      onSuccess: () => {
        setFighterToAdd(null);
        setActiveTab("my-team");
      }
    });
  };

  if (isLoadingLeague) {
    return <div className="flex h-64 items-center justify-center">Loading league data...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {league?.name ?? "My League Team"}
        </h1>
        <Button asChild variant="outline" className="bg-white">
          <Link href="/leagues-directory">Back to Leagues</Link>
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as LeagueTeamTab)}
        className="w-full"
      >
        <TabsList className="h-11 rounded-sm bg-slate-100 p-1">
          <TabsTrigger value="my-team" className="px-5 text-xs font-bold tracking-wide uppercase">
            My Team
          </TabsTrigger>
          <TabsTrigger
            value="free-agents"
            className="px-5 text-xs font-bold tracking-wide uppercase"
          >
            Free Agents
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="px-5 text-xs font-bold tracking-wide uppercase"
          >
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-team" className="mt-6">
          <MyTeamTab teamRows={teamRows} onRemoveClick={setFighterToRemove} />
        </TabsContent>

        <TabsContent value="free-agents" className="mt-6">
          <FreeAgentsTab
            leagueName={league?.name ?? "MMA League"}
            freeAgentSearch={freeAgentSearch}
            divisionFilter={divisionFilter}
            nationalityFilter={nationalityFilter}
            rankFilter={rankFilter}
            divisionOptions={["all", ...(divisions?.map(d => d.name) || [])]}
            nationalityOptions={["all"]}
            freeAgents={freeAgents}
            onSearchChange={setFreeAgentSearch}
            onDivisionChange={setDivisionFilter}
            onNationalityChange={setNationalityFilter}
            onRankChange={setRankFilter}
            onAddClick={setFighterToAdd}
          />
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <LeaderboardTab leagueId={leagueId} leaderboardRows={leaderboardRows} />
        </TabsContent>
      </Tabs>

      <RemoveFighterModal
        fighter={fighterToRemove}
        onClose={() => setFighterToRemove(null)}
        onConfirm={handleConfirmRemove}
      />

      <AddFighterModal
        fighter={fighterToAdd}
        onClose={() => setFighterToAdd(null)}
        onConfirm={handleConfirmAdd}
      />
    </section>
  );
}
