import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types";

import { EVENT_STATUS_BADGE_VARIANT, EVENT_STATUS_LABELS } from "./events-data";

interface EventStatusBadgeProps {
  event: Event;
}

export function EventStatusBadge({ event }: EventStatusBadgeProps) {
  const status = event.status;

  return (
    <Badge variant={EVENT_STATUS_BADGE_VARIANT[status]}>
      {EVENT_STATUS_LABELS[status]}
    </Badge>
  );
}
