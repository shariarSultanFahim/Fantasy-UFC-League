"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Card } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/widgets/DataTablePagination";

import { EVENTS_DATA } from "./events-data";
import { EventsTable } from "./EventsTable";

const PAGE_SIZE = 5;

export function EventsDatabase() {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filteredEvents = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return EVENTS_DATA;
    }

    return EVENTS_DATA.filter((event) => {
      return (
        event.name.toLowerCase().includes(normalizedQuery) ||
        event.location.toLowerCase().includes(normalizedQuery) ||
        event.date.includes(normalizedQuery)
      );
    });
  }, [query]);

  const maxPage = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visibleEvents = filteredEvents.slice(pageStart, pageStart + PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [query]);

  React.useEffect(() => {
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [maxPage, page]);

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

      <EventsTable events={visibleEvents} />

      <DataTablePagination
        page={safePage}
        limit={PAGE_SIZE}
        totalItems={filteredEvents.length}
        onPageChange={setPage}
      />
    </section>
  );
}
