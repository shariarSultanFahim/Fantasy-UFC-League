"use client";

import Image from "next/image";
import * as React from "react";
import { getImageUrl } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { AdminPageHeader } from "../../components/AdminPageHeader";
import { EventStatusBadge } from "../components/EventStatusBadge";
import { EVENT_STATUS_LABELS } from "../components/events-data";
import { SCORING_CRITERIA } from "@/constants/scoring-criteria";
import { useEvent } from "@/hooks/use-events";

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

export default function EventDetailsPage({ searchParams }: EventDetailsPageProps) {
  const { eventId } = React.use(searchParams);
  const { data: eventResponse, isLoading } = useEvent(eventId || "");
  const event = eventResponse?.data;

  if (isLoading) {
    return (
      <Card className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading event details...</p>
        </div>
      </Card>
    );
  }

  if (!event) {
    return (
      <Card className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground text-sm">Event not found.</p>
      </Card>
    );
  }

  const status = event.status;

  return (
    <section className="space-y-5">
      <AdminPageHeader title="Event Details" subtitle="Complete event information, bout card, and outcomes" />

      <Card className="overflow-hidden py-0">
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={getImageUrl(event.posterUrl)}
            alt={`${event.name} poster`}
            fill
            className="object-cover"
            unoptimized={!!event.posterUrl && event.posterUrl.startsWith("data:")}
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
              <p className="font-medium">{event.bouts?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardHeader className="border-b px-5 py-4 sm:px-6">
          <CardTitle className="text-xl font-semibold">Fight Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 py-5 sm:px-6">
          {event.bouts?.map((bout: any) => {
            const f1 = bout.fighter1 || bout.boutFighters?.[0]?.fighter;
            const f2 = bout.fighter2 || bout.boutFighters?.[1]?.fighter;

            const winner = bout.winnerId
              ? [f1, f2].find((fighter) => fighter?.id === bout.winnerId)
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
                        <AvatarImage src={getImageUrl(f1?.avatarUrl)} alt={f1?.name || "Fighter"} />
                        <AvatarFallback>{fighterInitials(f1?.name || "F")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{f1?.name || "Unknown Fighter"}</p>
                        <p className="text-muted-foreground text-xs">{f1?.nickname}</p>
                      </div>
                    </div>

                  <p className="text-center text-lg font-bold">VS</p>

                    <div className="flex items-center gap-3 rounded-lg border p-3">
                      <Avatar className="size-12">
                        <AvatarImage src={getImageUrl(f2?.avatarUrl)} alt={f2?.name || "Fighter"} />
                        <AvatarFallback>{fighterInitials(f2?.name || "F")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{f2?.name || "Unknown Fighter"}</p>
                        <p className="text-muted-foreground text-xs">{f2?.nickname}</p>
                      </div>
                    </div>
                </div>

                {status === "COMPLETED" ? (
                  <div className="rounded-md border border-emerald-600/40 bg-emerald-500/10 px-3 py-2 text-sm space-y-2">
                    <p>
                      <span className="font-medium text-emerald-800">Winner: </span>
                      <span className="font-bold text-emerald-900">{winner?.name ?? "Not available"}</span>
                    </p>
                    {bout.outcome && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {SCORING_CRITERIA.map((criterion) => {
                          const isTrue = Boolean(bout.outcome?.[criterion.key as keyof typeof bout.outcome]);
                          if (!isTrue) return null;
                          return (
                            <Badge
                              key={criterion.key}
                              variant="outline"
                              className="bg-emerald-100 text-emerald-800 border-emerald-200"
                            >
                              {criterion.title}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
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
