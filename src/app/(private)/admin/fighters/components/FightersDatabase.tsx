"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Card } from "@/components/ui";
import { Input } from "@/components/ui/input";
import type { FighterFilters } from "@/types";

import { FighterFiltersSheet } from "./FighterFiltersSheet";
import { DEFAULT_FILTERS, FIGHTERS_DATA } from "./fighters-data";
import { FightersPagination } from "./FightersPagination";
import { FightersTable } from "./FightersTable";

const STATIC_LIMIT = 10;
const STATIC_TOTAL_PAGE = 9;

export function FightersDatabase() {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(6);
  const [filters, setFilters] = React.useState<FighterFilters>(DEFAULT_FILTERS);

  return (
    <section className="space-y-4">
      <Card className="gap-0 p-3 sm:p-4">
        <div className="flex  gap-3 items-center">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 pl-10"
              placeholder="Search fighters, nicknames, or nationality..."
            />
          </div>
          <FighterFiltersSheet
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={() => setFilters(DEFAULT_FILTERS)}
          />
        </div>
      </Card>

      <FightersTable fighters={FIGHTERS_DATA.slice(0, 5)} />

      <FightersPagination
        page={page}
        limit={STATIC_LIMIT}
        totalPage={STATIC_TOTAL_PAGE}
        onPageChange={setPage}
      />
    </section>
  );
}