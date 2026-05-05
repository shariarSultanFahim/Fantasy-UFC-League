import { Calendar, Eye, PenSquare } from "lucide-react";
import Link from "next/link";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types";

import { EventStatusBadge } from "./EventStatusBadge";

interface EventsTableProps {
  events: Event[];
}

export function EventsTable({ events }: EventsTableProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-5 py-5 sm:px-6">
        <CardTitle className="text-2xl font-semibold">Events</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-5 py-3 sm:px-6">Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Fights</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="px-5 py-4 font-medium sm:px-6">{event.name}</TableCell>
                <TableCell className="py-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="size-4" />
                    {event.date}
                  </div>
                </TableCell>
                <TableCell className="py-4">{event.location}</TableCell>
                <TableCell className="py-4">{event.bouts?.length || 0}</TableCell>
                <TableCell className="py-4">
                  <EventStatusBadge event={event} />
                </TableCell>
                <TableCell className="pr-5 py-4 text-right sm:pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" asChild>
                      <Link href={`/admin/event-management/details?eventId=${event.id}`} aria-label="View event details">
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon-sm" asChild>
                      <Link href={`/admin/event-management/edit?eventId=${event.id}`} aria-label="Edit event">
                        <PenSquare className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
