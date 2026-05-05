import type { EventStatus } from "@/types";

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  UPCOMING: "Upcoming",
  ONGOING: "Live Now",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};

export const EVENT_STATUS_BADGE_VARIANT: Record<EventStatus, "secondary" | "default" | "outline" | "destructive"> = {
  UPCOMING: "secondary",
  ONGOING: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive"
};
