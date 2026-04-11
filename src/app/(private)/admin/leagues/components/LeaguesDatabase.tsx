"use client";

import * as React from "react";

import { Search } from "lucide-react";

import { Card } from "@/components/ui";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DataTablePagination } from "@/components/widgets/DataTablePagination";
import type { LeagueStatus } from "@/types";

import { LEAGUES_DATA } from "./leagues-data";
import { LeaguesTable } from "./LeaguesTable";

const PAGE_SIZE = 4;

const FILTER_OPTIONS: Array<{ label: string; value: "all" | LeagueStatus }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Drafting", value: "drafting" },
  { label: "Completed", value: "completed" }
];

export function LeaguesDatabase() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | LeagueStatus>("active");
  const [page, setPage] = React.useState(1);

  const filteredLeagues = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return LEAGUES_DATA.filter((league) => {
      const matchedStatus = status === "all" ? true : league.status === status;
      const matchedQuery =
        normalizedQuery.length === 0
          ? true
          : league.name.toLowerCase().includes(normalizedQuery) ||
            league.managerName.toLowerCase().includes(normalizedQuery) ||
            league.id.toLowerCase().includes(normalizedQuery);

      return matchedStatus && matchedQuery;
    });
  }, [query, status]);

  const maxPage = Math.max(1, Math.ceil(filteredLeagues.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visibleLeagues = filteredLeagues.slice(pageStart, pageStart + PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [query, status]);

  React.useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [maxPage, page]);

  return (
    <section className="space-y-4">
      <Card className="gap-3 p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 pl-10"
              placeholder="Search league name, manager or ID..."
            />
          </div>

          <Select
            value={status}
            onValueChange={(value) => setStatus(value as "all" | LeagueStatus)}
          >
            <SelectTrigger className="h-11! w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <LeaguesTable leagues={visibleLeagues} />

      <DataTablePagination
        page={safePage}
        limit={PAGE_SIZE}
        totalItems={filteredLeagues.length}
        onPageChange={setPage}
      />
    </section>
  );
}
