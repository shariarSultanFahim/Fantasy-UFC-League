"use client";

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { Card, Input, Button } from "@/components/ui";
import { useDivisions } from "@/hooks";
import { DivisionTable } from "./DivisionTable";
import { DivisionSheet } from "./DivisionSheet";
import { IDivision } from "@/types";
import { FightersPagination } from "../../fighters/components/FightersPagination";

export function DivisionDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounceValue(searchTerm, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { divisions, meta, isLoading, deleteDivision } = useDivisions({
    page,
    limit,
    searchTerm: debouncedSearch,
  });

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<IDivision | null>(null);

  const handleEdit = (division: IDivision) => {
    setSelectedDivision(division);
    setSheetOpen(true);
  };

  const handleAdd = () => {
    setSelectedDivision(null);
    setSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteDivision(id);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Card className="w-full sm:w-96 gap-0 p-2 shadow-sm border-slate-200">
          <div className="relative">
            <Search className="text-slate-400 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 border-none focus-visible:ring-0 placeholder:text-slate-400"
              placeholder="Search weight divisions..."
            />
          </div>
        </Card>
        
        <Button onClick={handleAdd} className="w-full sm:w-auto gap-2">
          <Plus className="size-4" />
          Add Division
        </Button>
      </div>

      <DivisionTable 
        divisions={divisions || []} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {meta && meta.totalPage > 1 && (
        <FightersPagination
          page={page}
          limit={limit}
          totalPage={meta.totalPage}
          onPageChange={setPage}
        />
      )}

      <DivisionSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
        division={selectedDivision} 
      />
    </section>
  );
}
