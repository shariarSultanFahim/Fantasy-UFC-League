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

type LeagueTeamTab = "my-team" | "free-agents" | "leaderboard";

function decimalToPointString(value: number) {
  return value.toFixed(3).replace("0.", ".");
}

function mapFighterToTeamRow(fighter: LeagueFighter): TeamFighterRow {
  const championship = fighter.divisionRank <= 3 ? 1 : 0;
  const finishWins = Math.max(1, Math.floor(fighter.wins * 0.4));
  const regularWins = Math.max(0, fighter.wins - finishWins);
  const fin = Math.max(0, finishWins - 1);
  const cc = championship;

  return {
    id: fighter.id,
    fighterName: fighter.name,
    weightClass: fighter.weightClass,
    avatarUrl: fighter.avatarUrl,
    championship,
    wins: fighter.wins,
    fiveRw: finishWins,
    rw: regularWins,
    fin,
    cc,
    totalPoints: decimalToPointString(fighter.avgPoints / 100)
  };
}

export function MyLeagueTeamBoard() {
  const searchParams = useSearchParams();
  const leagueId = searchParams.get("leagueId") ?? "league-001";
  const leagueMeta = useMemo(() => getLeagueLobbyMeta(leagueId), [leagueId]);

  const [activeTab, setActiveTab] = useState<LeagueTeamTab>("my-team");
  const [freeAgentSearch, setFreeAgentSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [nationalityFilter, setNationalityFilter] = useState("all");
  const [rankFilter, setRankFilter] = useState<RankFilter>("all");

  const teamFighters = useMemo(() => LEAGUE_FIGHTERS.slice(0, 5), []);
  const initialTeamRows = useMemo(() => {
    return teamFighters.map((fighter) => mapFighterToTeamRow(fighter));
  }, [teamFighters]);

  const [teamRows, setTeamRows] = useState<TeamFighterRow[]>(initialTeamRows);
  const [fighterToRemove, setFighterToRemove] = useState<TeamFighterRow | null>(null);
  const [fighterToAdd, setFighterToAdd] = useState<LeagueFighter | null>(null);

  const rosterFighterIdSet = useMemo(() => {
    return new Set(teamRows.map((fighter) => fighter.id));
  }, [teamRows]);

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

  const freeAgents = useMemo(() => {
    return LEAGUE_FIGHTERS.filter((fighter) => {
      if (rosterFighterIdSet.has(fighter.id)) {
        return false;
      }

      const matchesSearch = fighter.name.toLowerCase().includes(freeAgentSearch.toLowerCase());
      const matchesDivision = divisionFilter === "all" || fighter.weightClass === divisionFilter;
      const matchesNationality =
        nationalityFilter === "all" || fighter.nationality === nationalityFilter;
      const matchesRank =
        rankFilter === "all" ||
        (rankFilter === "top-3" && fighter.divisionRank <= 3) ||
        (rankFilter === "top-5" && fighter.divisionRank <= 5);

      return matchesSearch && matchesDivision && matchesNationality && matchesRank;
    });
  }, [divisionFilter, freeAgentSearch, nationalityFilter, rankFilter, rosterFighterIdSet]);

  const handleConfirmRemove = () => {
    if (!fighterToRemove) {
      return;
    }

    setTeamRows((previousRows) => {
      return previousRows.filter((fighter) => fighter.id !== fighterToRemove.id);
    });
    setFighterToRemove(null);
  };

  const handleConfirmAdd = () => {
    if (!fighterToAdd) {
      return;
    }

    setTeamRows((previousRows) => {
      if (previousRows.some((fighter) => fighter.id === fighterToAdd.id)) {
        return previousRows;
      }

      return [...previousRows, mapFighterToTeamRow(fighterToAdd)];
    });

    setFighterToAdd(null);
    setActiveTab("my-team");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {leagueMeta?.name ?? "My League Team"}
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
            leagueName={leagueMeta?.name ?? "MMA League #23"}
            freeAgentSearch={freeAgentSearch}
            divisionFilter={divisionFilter}
            nationalityFilter={nationalityFilter}
            rankFilter={rankFilter}
            divisionOptions={divisionOptions}
            nationalityOptions={nationalityOptions}
            freeAgents={freeAgents}
            onSearchChange={setFreeAgentSearch}
            onDivisionChange={setDivisionFilter}
            onNationalityChange={setNationalityFilter}
            onRankChange={setRankFilter}
            onAddClick={setFighterToAdd}
          />
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <LeaderboardTab leagueId={leagueId} leaderboardRows={LEADERBOARD_ROWS} />
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
