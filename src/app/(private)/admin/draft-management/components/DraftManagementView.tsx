"use client";

import * as React from "react";
import Link from "next/link";

import { CircleCheck, Eye, Hourglass, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";

import { AdminPageHeader } from "../../components/AdminPageHeader";
import { DraftHistoryDatabase } from "./DraftHistoryDatabase";
import { DraftOverviewSection } from "./DraftOverviewSection";
import { LEAGUE_DRAFT_DETAILS } from "./league-draft-data";

interface DraftManagementViewProps {
  leagueId?: string;
  teamId?: string;
}

function formatCountdown(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(remainingSeconds).padStart(2, "0")}s`;
}

function useCountdown(targetIsoDate: string) {
  const targetMs = React.useMemo(() => new Date(targetIsoDate).getTime(), [targetIsoDate]);
  const [secondsLeft, setSecondsLeft] = React.useState(() => {
    const diffMs = targetMs - Date.now();
    return Math.max(0, Math.floor(diffMs / 1000));
  });

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      const diffMs = targetMs - Date.now();
      setSecondsLeft(Math.max(0, Math.floor(diffMs / 1000)));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [targetMs]);

  return secondsLeft;
}

function EmptyLeagueState() {
  return (
    <Card>
      <CardContent className="py-10 text-center text-sm text-slate-600">
        No league draft data found for this selection.
      </CardContent>
    </Card>
  );
}

function PreDraftContent({ leagueId }: { leagueId: string }) {
  const selectedLeague = LEAGUE_DRAFT_DETAILS.find((league) => league.leagueId === leagueId);
  const secondsLeft = useCountdown(selectedLeague?.draftStartsAt ?? new Date().toISOString());

  if (!selectedLeague) {
    return <EmptyLeagueState />;
  }

  return (
    <section className="space-y-5">
      <Card className="border-amber-300/70 bg-amber-50/60">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase">
              Draft Status
            </p>
            <h3 className="text-xl font-semibold text-slate-900">Draft Is Not Started Yet</h3>
            <p className="text-sm text-slate-600">
              Countdown until draft start: {formatCountdown(secondsLeft)}
            </p>
          </div>
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            <Hourglass className="mr-1 size-4" />
            Pre Draft
          </Badge>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="flex-row items-center justify-between px-5 py-5 sm:px-6">
          <CardTitle className="text-xl font-semibold">Participants</CardTitle>
          <Badge variant="secondary">
            <Users className="mr-1 size-4" />
            {selectedLeague.participants.length} Joined
          </Badge>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="px-5 py-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase sm:px-6">
                  Participant
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                  Team
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                  Email
                </TableHead>
                <TableHead className="pr-5 text-right text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase sm:pr-6">
                  Joined
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedLeague.participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarImage src={getImageUrl(participant.avatarUrl)} alt={participant.name} />
                        <AvatarFallback>{participant.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-900">{participant.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-slate-700">{participant.teamName}</TableCell>
                  <TableCell className="py-4 text-slate-700">{participant.email}</TableCell>
                  <TableCell className="py-4 pr-5 text-right text-slate-700 sm:pr-6">
                    {participant.joinedAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

function CompletedContent({ leagueId, teamId }: { leagueId: string; teamId?: string }) {
  const selectedLeague = LEAGUE_DRAFT_DETAILS.find((league) => league.leagueId === leagueId);

  if (!selectedLeague) {
    return <EmptyLeagueState />;
  }

  const selectedTeam = selectedLeague.teams.find((team) => team.id === teamId);

  return (
    <section className="space-y-5">
      <Card className="border-emerald-300/70 bg-emerald-50/70">
        <CardContent className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase">
              Draft Status
            </p>
            <h3 className="text-xl font-semibold text-slate-900">Draft Is Completed</h3>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            <CircleCheck className="mr-1 size-4" />
            Completed
          </Badge>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0">
        <CardHeader className="px-5 py-5 sm:px-6">
          <CardTitle className="text-xl font-semibold">Teams</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="px-5 py-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase sm:px-6">
                  Team
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                  Owner
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                  Fighters
                </TableHead>
                <TableHead className="pr-5 text-right text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase sm:pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedLeague.teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="px-5 py-4 font-medium text-slate-900 sm:px-6">
                    {team.name}
                  </TableCell>
                  <TableCell className="py-4 text-slate-700">{team.ownerName}</TableCell>
                  <TableCell className="py-4 text-slate-700">{team.fighters.length}</TableCell>
                  <TableCell className="py-4 pr-5 text-right sm:pr-6">
                    <Link
                      href={`/admin/draft-management?leagueId=${leagueId}&teamId=${team.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                    >
                      <Eye className="size-4" />
                      View Team
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedTeam ? (
        <Card className="gap-0 py-0">
          <CardHeader className="px-5 py-5 sm:px-6">
            <CardTitle className="text-xl font-semibold">{selectedTeam.name} Details</CardTitle>
            <p className="text-sm text-slate-600">
              Owner: {selectedTeam.ownerName} ({selectedTeam.ownerEmail})
            </p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="px-5 py-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase sm:px-6">
                    Fighter
                  </TableHead>
                  <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Division
                  </TableHead>
                  <TableHead className="pr-5 text-right text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase sm:pr-6">
                    Rank
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTeam.fighters.map((fighter) => (
                  <TableRow key={fighter.id}>
                    <TableCell className="px-5 py-4 font-medium text-slate-900 sm:px-6">
                      {fighter.name}
                    </TableCell>
                    <TableCell className="py-4 text-slate-700">{fighter.division}</TableCell>
                    <TableCell className="py-4 pr-5 text-right text-slate-700 sm:pr-6">
                      #{fighter.ranking}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}

function DraftingContent({ leagueId }: { leagueId: string }) {
  return (
    <section className="space-y-6">
      <DraftOverviewSection />
      <DraftHistoryDatabase leagueId={leagueId} />
    </section>
  );
}

export function DraftManagementView({ leagueId, teamId }: DraftManagementViewProps) {
  if (!leagueId) {
    return (
      <section className="space-y-6">
        <AdminPageHeader
          title="Draft Management"
          subtitle="Control draft rooms, picks, and draft settings"
        />
        <DraftOverviewSection />
        <DraftHistoryDatabase />
      </section>
    );
  }

  const selectedLeague = LEAGUE_DRAFT_DETAILS.find((league) => league.leagueId === leagueId);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Draft Management"
        subtitle={
          selectedLeague
            ? `${selectedLeague.leagueName} (#${selectedLeague.leagueId})`
            : "League draft overview"
        }
      />

      {!selectedLeague ? <EmptyLeagueState /> : null}
      {selectedLeague?.status === "pre_draft" ? <PreDraftContent leagueId={leagueId} /> : null}
      {selectedLeague?.status === "drafting" ? <DraftingContent leagueId={leagueId} /> : null}
      {selectedLeague?.status === "completed" ? (
        <CompletedContent leagueId={leagueId} teamId={teamId} />
      ) : null}
    </section>
  );
}
