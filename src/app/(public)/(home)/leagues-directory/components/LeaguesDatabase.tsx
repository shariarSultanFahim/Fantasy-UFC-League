"use client";

import * as React from "react";
import Image from "next/image";

import { Button, Card } from "@/components/ui";

import { LEAGUE_LOBBY_DATA } from "./data";
import { LeaguesPagination } from "./LeaguesPagination";
import { LeaguesTable } from "./LeaguesTable";

const LEAGUES_PER_PAGE = 8;

export function LeaguesDatabase() {
  const [page, setPage] = React.useState(1);

  const allLeagues = LEAGUE_LOBBY_DATA;
  const draftingRooms = allLeagues.length;
  const fullRooms = allLeagues.filter((league) => league.members >= league.memberLimit).length;

  const totalPage = Math.ceil(allLeagues.length / LEAGUES_PER_PAGE);
  const startIndex = (page - 1) * LEAGUES_PER_PAGE;
  const endIndex = startIndex + LEAGUES_PER_PAGE;
  const paginatedLeagues = allLeagues.slice(startIndex, endIndex);

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
          <Button className="h-9 bg-indigo-900 px-5 text-xs font-semibold hover:bg-indigo-800">
            Join a League
          </Button>
          <Button className="h-9 bg-indigo-900 px-5 text-xs font-semibold hover:bg-indigo-800">
            Create League
          </Button>
        </Card>
      </Card>

      <LeaguesTable leagues={paginatedLeagues} />

      <LeaguesPagination
        page={page}
        limit={LEAGUES_PER_PAGE}
        totalCount={allLeagues.length}
        totalPage={totalPage}
        onPageChange={setPage}
      />
    </section>
  );
}
