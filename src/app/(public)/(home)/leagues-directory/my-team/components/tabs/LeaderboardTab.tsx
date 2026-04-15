import Image from "next/image";
import Link from "next/link";

import type { LeaderboardRow } from "@/types/my-team";

import { Card } from "@/components/ui";

interface LeaderboardTabProps {
  leagueId: string;
  leaderboardRows: LeaderboardRow[];
}

export function LeaderboardTab({ leagueId, leaderboardRows }: LeaderboardTabProps) {
  return (
    <section className="space-y-7">
      <Card className="relative overflow-hidden rounded-md border border-slate-200 bg-white p-0">
        <div className="relative h-48 w-full sm:h-56">
          <Image
            src="/animated.png"
            alt="League leaderboard banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#0A1735]/68" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <h3 className="text-5xl font-black tracking-tight">League Leaderboard</h3>
            <p className="mt-3 max-w-2xl text-base text-slate-200">
              See which teams are dominating the competition and fighting for the ultimate
              championship glory.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-4xl font-black tracking-tight text-slate-900">Rotisserie Stats</h3>

        <Card className="gap-0 overflow-hidden rounded-md border border-slate-200 bg-white p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-7xl border-collapse text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th
                    rowSpan={2}
                    className="w-14 px-4 py-3 text-[10px] font-bold text-slate-400 uppercase"
                  >
                    RK
                  </th>
                  <th
                    rowSpan={2}
                    className="min-w-44 px-4 py-3 text-[10px] font-bold text-slate-400 uppercase"
                  >
                    TEAM
                  </th>
                  <th
                    colSpan={4}
                    className="px-2 py-2 text-center text-[10px] font-bold text-slate-400 uppercase"
                  >
                    BATTING
                  </th>
                  <th
                    colSpan={7}
                    className="px-2 py-2 text-center text-[10px] font-bold text-slate-400 uppercase"
                  >
                    PITCHING
                  </th>
                  <th
                    colSpan={2}
                    className="px-2 py-2 text-center text-[10px] font-bold text-slate-400 uppercase"
                  >
                    TOTAL
                  </th>
                </tr>
                <tr className="bg-slate-50">
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    R
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    HR
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    RBI
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    SB
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    AVG
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    K
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    W
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    SV
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    HD
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    ERA
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    WHIP
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    TOT
                  </th>
                  <th className="px-2 pb-3 text-center text-[10px] font-semibold text-slate-500">
                    CHG
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboardRows.map((row) => (
                  <tr
                    key={`${row.rank}-${row.teamName}`}
                    className={row.rank === 5 ? "bg-violet-50" : "bg-white odd:bg-slate-50"}
                  >
                    <td className="px-4 py-3 text-sm text-slate-700">{row.rank}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${row.iconClassName}`}
                        >
                          {row.iconGlyph}
                        </span>
                        <Link
                          href={`/leagues-directory/team-details?leagueId=${leagueId}&team=${encodeURIComponent(row.teamName)}`}
                          className="text-slate-900 hover:text-blue-700"
                        >
                          {row.teamName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">{row.totals.r}</td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">
                      {row.totals.hr}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">
                      {row.totals.rbi}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">
                      {row.totals.sb}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">
                      {row.totals.avg}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">{row.totals.k}</td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">{row.totals.w}</td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">
                      {row.totals.sv}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">
                      {row.totals.hd}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">
                      {row.totals.era}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-slate-700">
                      {row.totals.whip}
                    </td>
                    <td className="px-2 py-3 text-center text-sm font-semibold text-slate-900">
                      {row.totals.tot}
                    </td>
                    <td className="px-2 py-3 text-center text-sm text-slate-400">
                      {row.totals.chg.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}
