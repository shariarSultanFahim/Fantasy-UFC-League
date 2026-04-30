import Link from "next/link";

import {
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
import { getImageUrl } from "@/lib/utils";
import type { Fighter } from "@/types";

interface FightersTableProps {
  fighters: Fighter[];
}

function recordLabel(fighter: Fighter) {
  return `${fighter.wins}-${fighter.losses}-${fighter.draws}`;
}

export function FightersTable({ fighters }: FightersTableProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-5 py-5 sm:px-6">
        <CardTitle className="text-2xl font-semibold">Fighter</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-5 py-3 sm:px-6">Fighter</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Record</TableHead>
              <TableHead>Avg Points</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fighters.map((fighter) => (
              <TableRow key={fighter.id}>
                <TableCell className="px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={getImageUrl(fighter.avatarUrl)} alt={fighter.name} />
                      <AvatarFallback>{fighter.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{fighter.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">{fighter.division}</TableCell>
                <TableCell className="py-4">{recordLabel(fighter)}</TableCell>
                <TableCell className="py-4 font-medium">
                  {fighter.points.toLocaleString()}
                </TableCell>
                <TableCell className="py-4">{fighter.rank ? `#${fighter.rank}` : "-"}</TableCell>
                <TableCell className="py-4 pr-5 text-right sm:pr-6">
                  <Link
                    href={`/admin/fighters/edit?fighterId=${fighter.id}`}
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
