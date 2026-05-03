"use client";

import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import type { FighterFilters } from "@/types";

import { DIVISION_OPTIONS, NATIONALITY_OPTIONS, RANK_RANGE_OPTIONS } from "./data";
import { FilterCombobox } from "./FilterCombobox";

interface RankingsFiltersSheetProps {
  filters: FighterFilters;
  onFilterChange: (nextFilters: FighterFilters) => void;
  onResetFilters: () => void;
}

export function RankingsFiltersSheet({
  filters,
  onFilterChange,
  onResetFilters
}: RankingsFiltersSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon-xl" aria-label="Open filters">
          <SlidersHorizontal className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="border-b px-5 pb-4">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Filter rankings by division, rank range, wins, losses, and nationality.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-5 py-5">
          <FilterCombobox
            label="Division"
            value={filters.divisionId ?? ""}
            options={DIVISION_OPTIONS}
            onValueChange={(divisionId) => onFilterChange({ ...filters, divisionId })}
          />
          <FilterCombobox
            label="Rank Range"
            value={filters.rankRange ?? ""}
            options={RANK_RANGE_OPTIONS}
            onValueChange={(rankRange) => onFilterChange({ ...filters, rankRange })}
          />

          <FilterCombobox
            label="Nationality"
            value={filters.nationality ?? ""}
            options={NATIONALITY_OPTIONS}
            onValueChange={(nationality) => onFilterChange({ ...filters, nationality })}
          />
        </div>

        <SheetFooter className="mt-auto border-t px-5 pt-4">
          <Button variant="outline" onClick={onResetFilters}>
            Reset
          </Button>
          <SheetClose asChild>
            <Button>Apply Filters</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
