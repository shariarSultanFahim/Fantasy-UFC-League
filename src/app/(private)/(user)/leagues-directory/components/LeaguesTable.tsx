import type { LeagueLobbyEntry } from "@/types/league";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface LeaguesTableProps {
  leagues: LeagueLobbyEntry[];
  onActionClick: (league: LeagueLobbyEntry) => void;
}

function membersLabel(league: LeagueLobbyEntry) {
  return `${league.members}/${league.memberLimit}`;
}

export function LeaguesTable({ leagues, onActionClick }: LeaguesTableProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-5 py-5 sm:px-6">
        <CardTitle className="text-base font-semibold text-slate-700">
          Leagues Drafting Soon
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-5 py-3 text-xs sm:px-6">LEAGUE NAME</TableHead>
              <TableHead className="text-xs">PASSCODE</TableHead>
              <TableHead className="text-xs">DRAFT TIME</TableHead>
              <TableHead className="text-xs">MEMBERS</TableHead>
              <TableHead className="pr-5 text-right text-xs sm:pr-6">ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leagues.map((league) => (
              <TableRow key={league.id}>
                <TableCell className="px-5 py-4 font-semibold text-blue-600 sm:px-6">
                  {league.name}
                </TableCell>
                <TableCell className="py-4 text-sm font-medium text-slate-600">
                  {league.hasPasscode ? "Yes" : "No"}
                </TableCell>
                <TableCell className="py-4 text-sm text-slate-600">{league.draftTime}</TableCell>
                <TableCell className="py-4 text-sm text-slate-600">
                  {membersLabel(league)}
                </TableCell>
                <TableCell className="py-4 pr-5 text-right sm:pr-6">
                  <Button
                    type="button"
                    size="sm"
                    disabled={league.actionStyle === "muted"}
                    onClick={() => onActionClick(league)}
                    className={
                      league.actionStyle === "dark"
                        ? "h-8 rounded-md bg-[#0E172B] px-4 text-xs font-semibold hover:bg-[#16254A]"
                        : "h-8 rounded-md bg-slate-500 px-4 text-xs font-semibold hover:bg-slate-600"
                    }
                  >
                    {league.actionLabel}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
