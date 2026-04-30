import { Minus } from "lucide-react";

import type { TeamFighterRow } from "@/types/my-team";

import { Button, Card } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface MyTeamTabProps {
  teamRows: TeamFighterRow[];
  onRemoveClick: (fighter: TeamFighterRow) => void;
}

export function MyTeamTab({ teamRows, onRemoveClick }: MyTeamTabProps) {
  return (
    <Card className="gap-5 border border-slate-200 bg-white p-0">
      <div className="px-6 pt-6">
        <h2 className="text-4xl font-black tracking-tight text-slate-900">MY TEAM</h2>
      </div>

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
          {teamRows.map((row, index) => (
            <TableRow key={row.id} className={index % 2 ? "bg-slate-50" : "bg-white"}>
              <TableCell className="px-6 py-5 font-medium text-blue-600">
                {row.fighterName}
              </TableCell>
              <TableCell className="py-5 text-slate-700">{row.championship}</TableCell>
              <TableCell className="py-5 text-emerald-700">{row.wins}</TableCell>
              <TableCell className="py-5 text-slate-700">{row.fiveRw}</TableCell>
              <TableCell className="py-5 text-slate-700">{row.rw}</TableCell>
              <TableCell className="py-5 text-slate-700">{row.fin}</TableCell>
              <TableCell className="py-5 text-slate-700">{row.cc}</TableCell>
              <TableCell className="py-5 text-slate-700">{row.totalPoints}</TableCell>
              <TableCell className="py-5 pr-6 text-right">
                <Button
                  type="button"
                  size="icon-sm"
                  className="bg-[#0E172B] text-white hover:bg-[#1A2A50]"
                  aria-label={`Remove ${row.fighterName}`}
                  onClick={() => onRemoveClick(row)}
                >
                  <Minus className="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {teamRows.length === 0 ? (
        <div className="px-6 pb-6 text-sm text-slate-500">No fighters in your roster.</div>
      ) : null}
    </Card>
  );
}
