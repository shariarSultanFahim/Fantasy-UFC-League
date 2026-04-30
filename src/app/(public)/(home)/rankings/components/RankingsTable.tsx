import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import type { Fighter } from "@/types";

interface RankingsTableProps {
  fighters: Fighter[];
  onFighterClick?: (fighter: Fighter) => void;
}

// function recordLabel(fighter: Fighter) {
//   return `${fighter.wins}-${fighter.losses}-${fighter.draws}`;
// }

export function RankingsTable({ fighters, onFighterClick }: RankingsTableProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-5 py-5 sm:px-6">
        <CardTitle className="text-2xl font-semibold">Fantasy MMA Rankings</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[5%] px-5 py-3 sm:px-6">Rank</TableHead>
              <TableHead className="w-[25%] px-5 py-3 sm:px-6">Player</TableHead>
              <TableHead className="w-[15%]">Division</TableHead>
              <TableHead className="w-[15%]">Nationality</TableHead>
              <TableHead className="w-[10%] text-right">L5</TableHead>
              <TableHead className="w-[10%] text-right">W</TableHead>
              <TableHead className="w-[10%] pr-5 text-right sm:pr-6">L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fighters.map((fighter) => (
              <TableRow
                key={fighter.id}
                onClick={() => onFighterClick?.(fighter)}
                className="cursor-pointer transition-colors hover:bg-slate-50"
              >
                <TableCell className="px-5 py-4 sm:px-6">
                  <span className="font-bold text-[#EC5B13]">
                    {fighter.rank ? `#${fighter.rank}` : "-"}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getImageUrl(fighter.avatarUrl)} alt={fighter.name} />
                      <AvatarFallback>{fighter.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-slate-900">{fighter.name}</p>
                      <p className="text-xs text-slate-500">{fighter.nickname}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-sm">{fighter.division}</TableCell>
                <TableCell className="py-4 text-sm">{fighter.nationality}</TableCell>
                <TableCell className="py-4 text-right font-semibold text-emerald-600">
                  {fighter.points}
                </TableCell>
                <TableCell className="py-4 text-right font-semibold">{fighter.wins}</TableCell>
                <TableCell className="py-4 pr-5 text-right font-semibold sm:pr-6">
                  {fighter.losses}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
