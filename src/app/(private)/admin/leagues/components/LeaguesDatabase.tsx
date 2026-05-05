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
import { Skeleton } from "@/components/ui/skeleton";
import type { LeagueStatus } from "@/types";
import { useAdminLeagues } from "@/lib/actions/league";

import { LeaguesTable } from "./LeaguesTable";

const PAGE_SIZE = 10;

const FILTER_OPTIONS: Array<{ label: string; value: "all" | LeagueStatus }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Drafting", value: "DRAFTING" },
  { label: "Completed", value: "COMPLETED" }
];

export function LeaguesDatabase() {
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | LeagueStatus>("all");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  const { data: response, isLoading } = useAdminLeagues({
    searchTerm: debouncedQuery,
    status: status,
    page: page,
    limit: PAGE_SIZE,
  });

  const leagues = response?.data || [];
  const totalItems = response?.meta?.total || 0;
  // If API puts meta at root level due to any structure difference, check:
  // const totalItems = response?.meta?.total || (response as any)?.data?.meta?.total || 0;
  // Wait, let's use what auth.ts IPaginatedResponse gives, which is response.data.meta if it's that format
  // or response.meta if it's the custom structure. I'll check both.
  const actualTotalItems = response?.meta?.total || response?.data?.meta?.total || 0;
  const actualLeagues = Array.isArray(response?.data) ? response.data : (response?.data?.data || []);

  React.useEffect(() => {
    setPage(1);
  }, [status]);

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

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <LeaguesTable leagues={actualLeagues} />
        )}
      </div>

      {!isLoading && actualTotalItems > 0 && (
        <DataTablePagination
          page={page}
          limit={PAGE_SIZE}
          totalItems={actualTotalItems}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}
