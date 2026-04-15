"use client";

import * as React from "react";

import { Search } from "lucide-react";

import { Card } from "@/components/ui";
import { Input } from "@/components/ui/input";
import type { Fighter, FighterFilters } from "@/types";

import { DEFAULT_FILTERS, FIGHTERS_DATA } from "./data";
import { FighterDetailsModal } from "./FighterDetailsModal";
import { RankingsFiltersSheet } from "./RankingsFiltersSheet";
import { RankingsPagination } from "./RankingsPagination";
import { RankingsTable } from "./RankingsTable";

const STATIC_LIMIT = 6;
// const STATIC_TOTAL_PAGE = 2;

export function RankingsDatabase() {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState<FighterFilters>(DEFAULT_FILTERS);
  const [selectedFighter, setSelectedFighter] = React.useState<Fighter | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const filteredFighters = FIGHTERS_DATA.filter((fighter) => {
    const matchesQuery =
      fighter.name.toLowerCase().includes(query.toLowerCase()) ||
      fighter.nickname.toLowerCase().includes(query.toLowerCase()) ||
      fighter.nationality.toLowerCase().includes(query.toLowerCase());

    const matchesDivision =
      filters.division === "All Divisions" || fighter.division === filters.division;

    const matchesNationality =
      filters.nationality === "All Nationalities" || fighter.nationality === filters.nationality;

    const matchesRankRange =
      filters.rankRange === "All Ranks" ||
      (filters.rankRange === "Top 5" && fighter.rank !== null && fighter.rank <= 5) ||
      (filters.rankRange === "Top 10" && fighter.rank !== null && fighter.rank <= 10) ||
      (filters.rankRange === "Top 15" && fighter.rank !== null && fighter.rank <= 15) ||
      (filters.rankRange === "Unranked" && fighter.rank === null);

    const matchesWinsRange = fighter.wins >= filters.minWins && fighter.losses <= filters.maxLosses;

    return (
      matchesQuery && matchesDivision && matchesNationality && matchesRankRange && matchesWinsRange
    );
  });

  const startIndex = (page - 1) * STATIC_LIMIT;
  const endIndex = startIndex + STATIC_LIMIT;
  const paginatedFighters = filteredFighters.slice(startIndex, endIndex);

  const handleFighterClick = (fighter: Fighter) => {
    setSelectedFighter(fighter);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFighter(null);
  };

  return (
    <section className="space-y-4">
      <Card className="gap-0 p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
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
          <RankingsFiltersSheet
            filters={filters}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
            }}
            onResetFilters={() => {
              setFilters(DEFAULT_FILTERS);
              setPage(1);
            }}
          />
        </div>
      </Card>

      <RankingsTable fighters={paginatedFighters} onFighterClick={handleFighterClick} />

      <RankingsPagination
        page={page}
        limit={STATIC_LIMIT}
        totalPage={Math.ceil(filteredFighters.length / STATIC_LIMIT)}
        onPageChange={setPage}
      />

      <FighterDetailsModal
        fighter={selectedFighter}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
