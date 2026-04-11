import { ListChecks, PenSquare } from "lucide-react";

import {
  Button,
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
import type { DraftPickHistory } from "@/types";

interface DraftHistoryTableProps {
  picks: DraftPickHistory[];
}

export function DraftHistoryTable({ picks }: DraftHistoryTableProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between px-5 py-5 sm:px-6">
        <CardTitle className="text-2xl font-semibold">Recent Draft History</CardTitle>
        <Button variant="ghost" size="sm" type="button">
          View All
        </Button>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-5 py-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase sm:px-6">
                Pick #
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                Fighter
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                Team
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                Round
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                Pick Time
              </TableHead>
              <TableHead className="pr-5 text-right text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase sm:pr-6">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {picks.length === 0 ? (
              <TableRow>
                <TableCell
                  className="px-5 py-10 text-center text-sm text-slate-500 sm:px-6"
                  colSpan={6}
                >
                  No draft picks available.
                </TableCell>
              </TableRow>
            ) : null}

            {picks.map((pick) => (
              <TableRow key={pick.id}>
                <TableCell className="px-5 py-4 font-semibold text-slate-900 sm:px-6">
                  {pick.pickNo}
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar>
                      <AvatarImage src={pick.fighterImageUrl} alt={pick.fighterName} />
                      <AvatarFallback>{pick.fighterName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="font-medium text-slate-900">{pick.fighterName}</p>
                      <p className="text-xs text-slate-500">{pick.division}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4 text-slate-700">{pick.teamName}</TableCell>
                <TableCell className="py-4 text-slate-700">Round {pick.round}</TableCell>
                <TableCell className="py-4 text-slate-700">{pick.pickTime}</TableCell>

                <TableCell className="py-4 pr-5 text-right sm:pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      type="button"
                      aria-label="View pick details"
                    >
                      <ListChecks className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      type="button"
                      aria-label="Edit draft pick"
                    >
                      <PenSquare className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
