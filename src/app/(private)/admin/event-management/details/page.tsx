import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { AdminPageHeader } from "../../components/AdminPageHeader";
import { EventStatusBadge } from "../components/EventStatusBadge";
import { EVENT_STATUS_LABELS, getEventById, getEventStatus } from "../components/events-data";

interface EventDetailsPageProps {
  searchParams: Promise<{ eventId?: string }>;
}

function fighterInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((namePart) => namePart[0])
    .join("")
    .toUpperCase();
}

export default async function EventDetailsPage({ searchParams }: EventDetailsPageProps) {
  const { eventId } = await searchParams;
  const event = getEventById(eventId);
  const status = getEventStatus(event);

  return (
    <section className="space-y-5">
      <AdminPageHeader title="Event Details" subtitle="Complete event information, bout card, and outcomes" />

      <Card className="overflow-hidden py-0">
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={event.posterUrl}
            alt={`${event.name} poster`}
            fill
            className="object-cover"
            unoptimized={event.posterUrl.startsWith("data:")}
          />
        </div>
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">{event.name}</h2>
              <p className="text-muted-foreground text-sm">{event.location}</p>
            </div>
            <EventStatusBadge event={event} />
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Event Date</p>
              <p className="font-medium">{event.date}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium">{EVENT_STATUS_LABELS[status]}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground">Total Bouts</p>
              <p className="font-medium">{event.bouts.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardHeader className="border-b px-5 py-4 sm:px-6">
          <CardTitle className="text-xl font-semibold">Fight Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          {event.bouts.map((bout) => {
            const winner = bout.winnerId
              ? [bout.fighter1, bout.fighter2].find((fighter) => fighter.id === bout.winnerId)
              : null;

            return (
              <div key={bout.id} className="space-y-4 rounded-xl border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {bout.isMainEvent ? <Badge>Main Event</Badge> : null}
                  {bout.isCoMainEvent ? <Badge variant="secondary">Co-Main Event</Badge> : null}
                  <Badge variant="outline">{bout.weightClass}</Badge>
                  <Badge variant="outline">{bout.rounds} rounds</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar className="size-12">
                      <AvatarImage src={bout.fighter1.avatarUrl} alt={bout.fighter1.name} />
                      <AvatarFallback>{fighterInitials(bout.fighter1.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{bout.fighter1.name}</p>
                      <p className="text-muted-foreground text-xs">{bout.fighter1.nickname}</p>
                    </div>
                  </div>

                  <p className="text-center text-lg font-bold">VS</p>

                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar className="size-12">
                      <AvatarImage src={bout.fighter2.avatarUrl} alt={bout.fighter2.name} />
                      <AvatarFallback>{fighterInitials(bout.fighter2.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{bout.fighter2.name}</p>
                      <p className="text-muted-foreground text-xs">{bout.fighter2.nickname}</p>
                    </div>
                  </div>
                </div>

                {status === "completed" ? (
                  <div className="rounded-md border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm">
                    <span className="font-medium">Winner: </span>
                    {winner?.name ?? "Not available"}
                  </div>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}
