"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { getJoinedLeagueMembers, getLeagueLobbyMeta } from "@/helpers/league-lobby";

import { Button, Card } from "@/components/ui";

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

const TEAM_SUFFIXES = [
  "Magnificent Team",
  "Great Team",
  "Aces",
  "Dominators",
  "Sluggers",
  "Bombers",
  "Champions",
  "Ninjas",
  "Juggernauts",
  "Warriors"
];

const LOBBY_WAIT_SECONDS = 5 * 60;

function getInitials(words: string[]) {
  return words
    .slice(0, 3)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

function getTeamRow(memberName: string, index: number): TeamRow {
  const primaryName = memberName.trim().split(/\s+/)[0] ?? memberName;
  const suffix = TEAM_SUFFIXES[index % TEAM_SUFFIXES.length];
  const teamName = `${primaryName}'s ${suffix}`;
  const abbr = getInitials([primaryName, ...suffix.split(" ")]);

  return {
    teamName,
    abbr,
    dotClassName: DOT_COLORS[index % DOT_COLORS.length] ?? "bg-slate-500"
  };
}

function formatTimer(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `00:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function DraftLobbyBoard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leagueId = searchParams.get("leagueId") ?? "league-023";

  const [secondsLeft, setSecondsLeft] = useState(LOBBY_WAIT_SECONDS);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous > 1) {
          return previous - 1;
        }

        const lobbyMeta = getLeagueLobbyMeta(leagueId);
        const memberLimit = lobbyMeta?.memberLimit ?? 10;
        const memberCount = getJoinedLeagueMembers(leagueId).length;

        if (memberCount < memberLimit) {
          return LOBBY_WAIT_SECONDS;
        }

        return 0;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [leagueId]);

  const leagueMeta = useMemo(() => getLeagueLobbyMeta(leagueId), [leagueId]);
  const leagueName = leagueMeta?.name ?? "MMA League #23";
  const memberLimit = leagueMeta?.memberLimit ?? 10;
  const joinedNames = getJoinedLeagueMembers(leagueId).map((member) => member.name);

  const teamRows = useMemo(() => {
    const rows: TeamRow[] = joinedNames.map((name, index) => getTeamRow(name, index));

    for (let index = rows.length; index < memberLimit; index += 1) {
      rows.push({
        teamName: `Waiting for Manager ${index + 1}`,
        abbr: "---",
        dotClassName: "bg-slate-300"
      });
    }

    return rows.slice(0, memberLimit);
  }, [joinedNames, memberLimit]);

  return (
    <section className="space-y-8">
      <h1 className="text-4xl font-bold text-slate-900">{leagueName} Draft Lobby</h1>

      <Card className="border border-slate-200 bg-slate-100 p-6 sm:p-8">
        <div className="relative rounded-md border border-slate-200 bg-[#F3F4F6] px-4 py-5 text-center">
          <p className="font-mono text-5xl font-black tracking-[0.05em] text-slate-900 sm:text-6xl">
            {formatTimer(secondsLeft)}
          </p>
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <Button
              type="button"
              className="h-8 rounded-sm bg-[#0E2A57] px-4 text-xs hover:bg-[#12336b]"
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
              {teamRows.map((row, index) => (
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
