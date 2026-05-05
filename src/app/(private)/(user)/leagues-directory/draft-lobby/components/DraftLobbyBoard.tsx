"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLeague } from "@/lib/actions/league";
import { useMe } from "@/lib/actions/auth";

import { Button, Card } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamRow {
  teamName: string;
  abbr: string;
  dotClassName: string;
}

const DOT_COLORS = [
  "bg-blue-600",
  "bg-red-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-violet-600",
  "bg-indigo-600",
  "bg-pink-600",
  "bg-orange-600",
  "bg-cyan-600",
  "bg-slate-600"
];

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function formatTimer(totalSeconds: number) {
  if (totalSeconds <= 0) return "00:00:00:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `00:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function DraftLobbyBoard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leagueId = searchParams.get("leagueId");

  const { data: leagueData, isLoading: isLoadingLeague } = useLeague(leagueId || "");
  const { data: userData } = useMe();
  const currentUserId = userData?.data?.id;

  const league = leagueData?.data;
  const leagueName = league?.name ?? "MMA League";
  const memberLimit = league?.memberLimit ?? 10;

  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!league?.draftTime) return;

    const calculateSecondsLeft = () => {
      if (!league?.draftTime) return 0;
      const now = new Date().getTime();
      const draftTimeMs = new Date(league.draftTime).getTime();
      const diff = Math.floor((draftTimeMs - now) / 1000);
      return diff > 0 ? diff : 0;
    };

    setSecondsLeft(calculateSecondsLeft());

    const interval = window.setInterval(() => {
      setSecondsLeft(calculateSecondsLeft());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [league?.draftTime]);

  const draftTimeMs = league?.draftTime ? new Date(league.draftTime).getTime() : 0;
  const isDraftRoomOpen =
    league?.status === "DRAFTING" || (draftTimeMs > 0 && draftTimeMs <= new Date().getTime());

  const teamRows = useMemo(() => {
    const joinedTeams = league?.teams || [];
    const rows: TeamRow[] = joinedTeams.map((team, index) => ({
      teamName: team.name,
      abbr: getInitials(team.name),
      dotClassName: DOT_COLORS[index % DOT_COLORS.length] ?? "bg-slate-500",
      ownerId: team.ownerId
    })) as (TeamRow & { ownerId: string })[];

    const remainingSlots = memberLimit - rows.length;
    for (let index = 0; index < remainingSlots; index += 1) {
      rows.push({
        teamName: `Waiting for Manager ${rows.length + 1}`,
        abbr: "---",
        dotClassName: "bg-slate-300",
        ownerId: ""
      } as any);
    }

    return rows;
  }, [league?.teams, memberLimit]);

  if (!leagueId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-500">No league ID provided.</p>
      </div>
    );
  }

  if (isLoadingLeague) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          {leagueName} Waiting Room
        </h1>
        <p className="max-w-3xl text-sm text-slate-600">
          This is a {league?.isSystemGenerated ? "public" : "private"} league with custom settings. The draft will begin at the scheduled time.
          Make sure to review your pre-draft rankings and be ready when the timer reaches zero.
        </p>
      </div>

      <Card className="border border-slate-200 bg-slate-100 p-6 sm:p-8">
        <div className="relative rounded-md border border-slate-200 bg-[#F3F4F6] px-4 py-7 text-center">
          {isDraftRoomOpen ? (
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <p className="text-2xl font-medium text-[#0E2A57] sm:text-4xl">The Draft room is now open!</p>
              <Button
                type="button"
                className="h-10 rounded-sm bg-[#0E2A57] px-8 text-base hover:bg-[#12336b]"
                onClick={() => {
                  router.push(`/leagues-directory/snake-draft?leagueId=${leagueId}`);
                }}
              >
                Enter The Draft
              </Button>
            </div>
          ) : (
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <p className="flex-1 font-mono text-4xl font-black text-slate-900 sm:text-6xl md:text-5xl">
                {formatTimer(secondsLeft)}
              </p>
              <div className="flex flex-col justify-center gap-2">
                <Button
                  type="button"
                  className="h-8 rounded-sm bg-[#0E2A57] px-4 text-xs hover:bg-[#12336b]"
                  onClick={() =>
                    router.push(`/leagues-directory/pre-draft-rankings?leagueId=${leagueId}`)
                  }
                >
                  Edit Pre-Draft Rankings
                </Button>
                <button
                  type="button"
                  className="text-xs text-sky-700 hover:text-sky-800"
                  onClick={() => router.push("/leagues-directory")}
                >
                  Leave This League
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 overflow-hidden border-2 border-[#1B9AF5] bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-white">
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  TEAM
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  ABBR
                </th>
              </tr>
            </thead>
            <tbody>
              {teamRows.map((row: any, index) => (
                <tr
                  key={`${row.teamName}-${index}`}
                  className={index % 2 === 0 ? "bg-[#F3F4F6]" : "bg-[#E5E7EB]"}
                >
                  <td className="px-4 py-3 text-sm text-slate-800">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${row.dotClassName}`}
                      >
                        {row.abbr === "---" ? "-" : row.abbr[0]}
                      </span>
                      <span>{row.teamName}</span>
                      {row.ownerId === currentUserId ? (
                        <button
                          type="button"
                          className="text-xs text-blue-600 hover:text-blue-700"
                          onClick={() =>
                            router.push(
                              `/leagues-directory/pre-draft-rankings?leagueId=${leagueId}`
                            )
                          }
                        >
                          (Edit Team Settings)
                        </button>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">
                    {row.abbr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
