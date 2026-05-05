"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Card } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/widgets/DataTablePagination";

import { useEvents } from "@/hooks/use-events";
import { EventsTable } from "./EventsTable";

const PAGE_SIZE = 5;

export function EventsDatabase() {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useEvents({
    page,
    limit: PAGE_SIZE,
    searchTerm: query.trim() || undefined
  });

  const events = (data?.data?.data || []).filter(Boolean);
  const meta = data?.data?.meta;

  React.useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <section className="space-y-4">
      <Card className="gap-0 p-3 sm:p-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 pl-10"
            placeholder="Search events, dates, or locations..."
          />
        </div>
      </Card>

      {isLoading ? (
        <Card className="flex h-60 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p className="text-muted-foreground text-sm">Loading events...</p>
          </div>
        </Card>
      ) : (
        <>
          <EventsTable events={events} />

          <DataTablePagination
            page={page}
            limit={PAGE_SIZE}
            totalItems={meta?.total || 0}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
