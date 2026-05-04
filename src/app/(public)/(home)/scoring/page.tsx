"use client";

import { SCORING_CRITERIA } from "@/constants/scoring-criteria";
import { useScoringSettings } from "@/lib/actions/scoring";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function ScoringPage() {
  const { data: scoringData, isLoading } = useScoringSettings();

  const settings = scoringData?.data;

  const scoringRows = SCORING_CRITERIA.map((criterion) => ({
    action: criterion.title,
    description: criterion.description,
    points: settings ? (settings[criterion.key as keyof typeof settings] as number) : 0,
    key: criterion.key
  }));

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-primary sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-6xl">
          <section className="rounded-sm bg-[#0A192F] px-6 py-14 text-center text-white sm:px-10 lg:py-16">
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Scoring & Rules</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Understand the point system used by the admin scoring settings.
            </p>
          </section>

          <section className="mt-12 flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-primary sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <section className="rounded-sm bg-[#0A192F] px-6 py-14 text-center text-white sm:px-10 lg:py-16">
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Scoring & Rules</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Understand the point system used by the admin scoring settings.
          </p>
        </section>

        <section className="mt-12">
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/80 hover:bg-slate-100/80">
                  <TableHead className="w-[64%] px-6 py-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Scoring Rule
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Notes
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Point
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {scoringRows.map((row, index) => (
                  <TableRow
                    key={row.key}
                    className={index === scoringRows.length - 1 ? "bg-slate-50/70" : ""}
                  >
                    <TableCell className="px-6 py-4 text-base font-medium text-slate-800">
                      {row.action}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm leading-6 text-slate-600">
                      {row.description}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base font-bold text-emerald-500">
                      +{row.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {settings && (
          <section className="mt-10 rounded-xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600 shadow-sm">
            The current highlighted rare bonus is{" "}
            <span className="font-semibold text-slate-900">Champion vs Champion Win</span>, set to{" "}
            <span className="font-semibold text-emerald-600">
              +{settings.championVsChampionWin}
            </span>
            .
          </section>
        )}
      </div>
    </main>
  );
}
