"use client";

import { Search, Loader2 } from "lucide-react";
import * as React from "react";

import { Card } from "@/components/ui";
import { Input } from "@/components/ui/input";
import type { IFighterFilters } from "@/types";

import { FighterFiltersSheet } from "./FighterFiltersSheet";
import { FightersPagination } from "./FightersPagination";
import { FightersTable } from "./FightersTable";
import { useFighters, useDebounce } from "@/hooks";

export function FightersDatabase() {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState<IFighterFilters>({});

  const debouncedSearch = useDebounce(query, 500);

  const { data, isLoading } = useFighters({
    ...filters,
    searchTerm: debouncedSearch,
    page,
    limit: 10,
  });

  const handleFilterChange = (newFilters: IFighterFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  return (
    <section className="space-y-4">
      <Card className="gap-0 p-3 sm:p-4">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className="h-11 pl-10"
              placeholder="Search fighters, nicknames, or nationality..."
            />
          </div>
          <FighterFiltersSheet
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <FightersTable fighters={data?.data?.data || []} />
      )}

      {data?.data?.meta && (
        <FightersPagination
          page={page}
          limit={10}
          totalPage={data.data.meta.totalPage}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}