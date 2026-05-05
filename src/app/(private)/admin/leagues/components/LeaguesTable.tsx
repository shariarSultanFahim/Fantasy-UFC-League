import Link from "next/link";

import { Eye } from "lucide-react";

import { cn, getImageUrl } from "@/lib/utils";

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ILeague, LeagueStatus } from "@/types";

interface LeaguesTableProps {
  leagues: ILeague[];
}

const statusStyles: Record<LeagueStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  DRAFTING: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-slate-200 text-slate-700",
  ARCHIVED: "bg-slate-100 text-slate-600"
};

function getStatusLabel(status: LeagueStatus) {
  if (status === "ACTIVE") {
    return "Active";
  }

  if (status === "DRAFTING") {
    return "Drafting";
  }

  if (status === "COMPLETED") {
    return "Completed";
  }

  return "Archived";
}

function getMembersProgressClass(memberCount: number, memberLimit: number) {
  const ratio = memberLimit === 0 ? 0 : memberCount / memberLimit;

  if (ratio >= 1) {
    return "w-full";
  }

  if (ratio >= 0.9) {
    return "w-11/12";
  }

  if (ratio >= 0.8) {
    return "w-4/5";
  }

  if (ratio >= 0.7) {
    return "w-3/4";
  }

  if (ratio >= 0.6) {
    return "w-3/5";
  }

  if (ratio >= 0.5) {
    return "w-1/2";
  }

  if (ratio >= 0.4) {
    return "w-2/5";
  }

  if (ratio >= 0.3) {
    return "w-1/3";
  }

  if (ratio >= 0.2) {
    return "w-1/4";
  }

  return "w-1/5";
}

export function LeaguesTable({ leagues }: LeaguesTableProps) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-5 py-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase sm:px-6">
                League Name
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                Manager
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                Members
              </TableHead>
              <TableHead className="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                Status
              </TableHead>
              <TableHead className="pr-5 text-right text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase sm:pr-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leagues.length === 0 ? (
              <TableRow>
                <TableCell
                  className="px-5 py-10 text-center text-sm text-slate-500 sm:px-6"
                  colSpan={5}
                >
                  No leagues found for the selected filters.
                </TableCell>
              </TableRow>
            ) : null}
            {leagues.map((league) => {
              const memberCount = league._count?.members || 0;
              const managerName = league.manager?.name || "Unknown";
              const managerAvatarUrl = league.manager?.avatarUrl || "";

              const membersProgressClass = getMembersProgressClass(
                memberCount,
                league.memberLimit
              );

              return (
                <TableRow key={league.id}>
                  <TableCell className="px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-md bg-linear-to-br from-slate-900 to-indigo-800 text-xs font-semibold text-white">
                        {league.code}
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900">{league.name}</p>
                        <p className="text-xs text-slate-500">
                          {league.isPrivate ? "Private" : "Public"} • {league.isSystemGenerated ? "System" : "User"}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarImage src={getImageUrl(managerAvatarUrl)} alt={managerName} />
                        <AvatarFallback>{managerName.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-700">{managerName}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="space-y-1.5">
                      <p className="font-semibold text-slate-900">
                        {memberCount}/{league.memberLimit}
                      </p>
                      <div className="h-1.5 w-18.5 rounded-full bg-slate-200">
                        <div
                          className={cn("h-full rounded-full bg-slate-900", membersProgressClass)}
                        />
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold tracking-[0.14em] uppercase",
                        statusStyles[league.status]
                      )}
                    >
                      {getStatusLabel(league.status)}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 pr-5 text-right sm:pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" asChild>
                        <Link
                          href={`/admin/draft-management?leagueId=${league.id}`}
                          aria-label="Open draft management"
                        >
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                      {/* <Button variant="ghost" size="icon-sm" aria-label="Open league actions">
                        <MoreVertical className="size-4" />
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
