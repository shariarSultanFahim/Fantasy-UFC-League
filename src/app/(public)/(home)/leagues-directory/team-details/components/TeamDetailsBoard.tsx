"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { toast } from "sonner";

import type { LeagueFighter } from "@/types/league-simulation";
import type { TeamStatRow } from "@/types/team-details";

import { LEAGUE_FIGHTERS } from "@/data/league-fighters";

import { Button, Card } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { TradeProposalModal } from "./modals/TradeProposalModal";

function formatTeamTitle(teamName: string) {
  if (teamName.toLowerCase().includes("team")) {
    return teamName;
  }

  return `${teamName} Team`;
}

function mapToTeamRow(fighter: LeagueFighter): TeamStatRow {
  const championships = fighter.divisionRank <= 3 ? 1 : 0;
  const fiveRw = Math.max(1, Math.floor(fighter.wins * 0.4));
  const rw = Math.max(0, fighter.wins - fiveRw);
  const fin = Math.max(0, fiveRw - 1);

  return {
    id: fighter.id,
    fighterName: fighter.name,
    weightClass: fighter.weightClass,
    championships,
    wins: fighter.wins,
    fiveRw,
    rw,
    fin,
    cc: championships,
    totalPoints: (fighter.avgPoints / 100).toFixed(3).replace("0.", ".")
  };
}

export function TeamDetailsBoard() {
  const searchParams = useSearchParams();
  const teamName = searchParams.get("team") ?? "Opposing Team";
  const [searchFighter, setSearchFighter] = useState("");
  const [ownerMessage, setOwnerMessage] = useState("");
  const [targetFighter, setTargetFighter] = useState<TeamStatRow | null>(null);
  const [selectedYourFighterId, setSelectedYourFighterId] = useState<string>("");

  const opposingTeamFighters = useMemo(() => {
    return [
      {
        id: "opp-01",
        fighterName: "Islam Makhachev",
        weightClass: "Lightweight",
        championships: 2,
        wins: 1,
        fiveRw: 1,
        rw: 2,
        fin: 1,
        cc: 0,
        totalPoints: ".285"
      },
      {
        id: "opp-02",
        fighterName: "Ilia Topuria",
        weightClass: "Featherweight",
        championships: 1,
        wins: 3,
        fiveRw: 2,
        rw: 2,
        fin: 1,
        cc: 0,
        totalPoints: ".322"
      },
      {
        id: "opp-03",
        fighterName: "Khamzat Chimaev",
        weightClass: "Middleweight",
        championships: 0,
        wins: 1,
        fiveRw: 2,
        rw: 0,
        fin: 1,
        cc: 1,
        totalPoints: ".298"
      },
      {
        id: "opp-04",
        fighterName: "Alex Pereira",
        weightClass: "Light Heavyweight",
        championships: 3,
        wins: 2,
        fiveRw: 1,
        rw: 1,
        fin: 1,
        cc: 0,
        totalPoints: ".273"
      },
      {
        id: "opp-05",
        fighterName: "Petr Yan",
        weightClass: "Bantamweight",
        championships: 0,
        wins: 1,
        fiveRw: 0,
        rw: 2,
        fin: 1,
        cc: 1,
        totalPoints: ".337"
      }
    ] satisfies TeamStatRow[];
  }, []);

  const yourFighters = useMemo(() => {
    return LEAGUE_FIGHTERS.slice(0, 6).map((fighter) => mapToTeamRow(fighter));
  }, []);

  const selectedYourFighter = useMemo(() => {
    return yourFighters.find((fighter) => fighter.id === selectedYourFighterId) ?? null;
  }, [selectedYourFighterId, yourFighters]);

  const filteredOpposingTeamFighters = useMemo(() => {
    return opposingTeamFighters.filter((fighter) =>
      fighter.fighterName.toLowerCase().includes(searchFighter.toLowerCase())
    );
  }, [opposingTeamFighters, searchFighter]);

  const handleSendTradeOffer = () => {
    if (!targetFighter || !selectedYourFighter) {
      return;
    }

    setTargetFighter(null);
    setSelectedYourFighterId("");
    setOwnerMessage("");

    toast.success("Trade offer sent successfully!", {
      position: "top-center"
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-5xl font-black tracking-tight text-slate-900">
          The {formatTeamTitle(teamName)}
        </h1>
        <Button asChild variant="outline" className="bg-white">
          <Link href="/leagues-directory/my-team">Back</Link>
        </Button>
      </div>

      <Card className="gap-0 overflow-hidden border border-slate-200 bg-white p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-700">Fighters</TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700">Championship</TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700">WINS</TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700">5RW</TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700">RW</TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700">FIN</TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700">CC</TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700">Total points</TableHead>
              <TableHead className="py-4 pr-6 text-right text-xs font-bold text-slate-700">
                ACTION
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOpposingTeamFighters.map((row, index) => (
              <TableRow key={row.id} className={index % 2 ? "bg-slate-50" : "bg-white"}>
                <TableCell className="px-6 py-5 font-medium text-blue-600">
                  {row.fighterName}
                </TableCell>
                <TableCell className="py-5 text-slate-700">{row.championships}</TableCell>
                <TableCell className="py-5 text-slate-700">{row.wins}</TableCell>
                <TableCell className="py-5 text-slate-700">{row.fiveRw}</TableCell>
                <TableCell className="py-5 text-slate-700">{row.rw}</TableCell>
                <TableCell className="py-5 text-slate-700">{row.fin}</TableCell>
                <TableCell className="py-5 text-slate-700">{row.cc}</TableCell>
                <TableCell className="py-5 text-slate-700">{row.totalPoints}</TableCell>
                <TableCell className="py-5 pr-6 text-right">
                  <Button
                    type="button"
                    className="h-8 rounded-md bg-[#0E2A57] px-4 text-xs font-semibold hover:bg-[#12336b]"
                    onClick={() => setTargetFighter(row)}
                  >
                    Propose Trade
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <TradeProposalModal
        isOpen={Boolean(targetFighter)}
        searchFighter={searchFighter}
        ownerMessage={ownerMessage}
        targetFighter={targetFighter}
        yourFighters={yourFighters}
        selectedYourFighter={selectedYourFighter}
        selectedYourFighterId={selectedYourFighterId}
        onClose={() => setTargetFighter(null)}
        onSearchChange={setSearchFighter}
        onMessageChange={setOwnerMessage}
        onYourFighterChange={setSelectedYourFighterId}
        onSendTradeOffer={handleSendTradeOffer}
      />
    </section>
  );
}
