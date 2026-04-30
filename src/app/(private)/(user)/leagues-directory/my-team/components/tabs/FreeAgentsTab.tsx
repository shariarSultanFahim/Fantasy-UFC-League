import { Filter, Plus, Search } from "lucide-react";

import type { LeagueFighter } from "@/types/league-simulation";
import type { RankFilter } from "@/types/my-team";

import { Button, Card } from "@/components/ui";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface FreeAgentsTabProps {
  leagueName: string;
  freeAgentSearch: string;
  divisionFilter: string;
  nationalityFilter: string;
  rankFilter: RankFilter;
  divisionOptions: string[];
  nationalityOptions: string[];
  freeAgents: LeagueFighter[];
  onSearchChange: (value: string) => void;
  onDivisionChange: (value: string) => void;
  onNationalityChange: (value: string) => void;
  onRankChange: (value: RankFilter) => void;
  onAddClick: (fighter: LeagueFighter) => void;
}

export function FreeAgentsTab({
  leagueName,
  freeAgentSearch,
  divisionFilter,
  nationalityFilter,
  rankFilter,
  divisionOptions,
  nationalityOptions,
  freeAgents,
  onSearchChange,
  onDivisionChange,
  onNationalityChange,
  onRankChange,
  onAddClick
}: FreeAgentsTabProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-slate-900">Free Agents</h2>
        <p className="mt-2 text-sm text-slate-500">{leagueName}</p>
      </div>

      <Card className="rounded-none border border-slate-200 bg-white p-3 sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px_180px]">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={freeAgentSearch}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search free agents..."
              className="h-10 rounded-none bg-white pl-10"
            />
          </div>

          <Select value={divisionFilter} onValueChange={onDivisionChange}>
            <SelectTrigger className="h-10 rounded-none bg-white text-xs font-semibold uppercase">
              <SelectValue placeholder="All Divisions" />
            </SelectTrigger>
            <SelectContent>
              {divisionOptions.map((division) => (
                <SelectItem key={division} value={division}>
                  {division === "all" ? "All Divisions" : division}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={nationalityFilter} onValueChange={onNationalityChange}>
            <SelectTrigger className="h-10 rounded-none bg-white text-xs font-semibold uppercase">
              <SelectValue placeholder="All Nationalities" />
            </SelectTrigger>
            <SelectContent>
              {nationalityOptions.map((nationality) => (
                <SelectItem key={nationality} value={nationality}>
                  {nationality === "all" ? "All Nationalities" : nationality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={rankFilter} onValueChange={(value) => onRankChange(value as RankFilter)}>
            <SelectTrigger className="h-10 rounded-none bg-white text-xs font-semibold uppercase">
              <div className="flex items-center gap-2">
                <Filter className="size-3.5" />
                <SelectValue placeholder="Advanced Filters" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ranks</SelectItem>
              <SelectItem value="top-3">Top 3 Division Rank</SelectItem>
              <SelectItem value="top-5">Top 5 Division Rank</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-700 uppercase">
                Rank
              </TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700 uppercase">
                Fighter
              </TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700 uppercase">
                Weight Class
              </TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700">Wins</TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700">Losses</TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700">Division Rank</TableHead>
              <TableHead className="py-4 text-xs font-bold text-slate-700 uppercase">
                Avg Points
              </TableHead>
              <TableHead className="py-4 pr-6 text-right text-xs font-bold text-slate-700 uppercase">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {freeAgents.length ? (
              freeAgents.map((fighter, index) => (
                <TableRow key={fighter.id} className={index % 2 ? "bg-slate-50" : "bg-white"}>
                  <TableCell className="px-6 py-4 font-semibold text-slate-900">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4 font-medium text-blue-600">{fighter.name}</TableCell>
                  <TableCell className="py-4 text-slate-700">{fighter.weightClass}</TableCell>
                  <TableCell className="py-4 text-slate-700">
                    {fighter.wins}-{fighter.losses}
                  </TableCell>
                  <TableCell className="py-4 text-slate-700">{fighter.losses}</TableCell>
                  <TableCell className="py-4 text-slate-700">{fighter.divisionRank}</TableCell>
                  <TableCell className="py-4 font-semibold text-[#1C3D87]">
                    {Number((fighter.avgPoints / 5).toFixed(1))}
                  </TableCell>
                  <TableCell className="py-4 pr-6 text-right">
                    <Button
                      type="button"
                      size="icon-sm"
                      className="bg-[#0E172B] text-white hover:bg-[#1A2A50]"
                      onClick={() => onAddClick(fighter)}
                      aria-label={`Add ${fighter.name}`}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="px-6 py-8 text-center text-sm text-slate-500">
                  No free agents match your current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
}
