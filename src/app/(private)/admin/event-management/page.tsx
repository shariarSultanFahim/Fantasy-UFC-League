import { AdminPageHeader } from "../components/AdminPageHeader";

import { EventsDatabase } from "./components/EventsDatabase";

export default function EventManagementPage() {
  return (
    <>
      <AdminPageHeader
        title="Event Management"
        subtitle="Manage and configure live event data, create fight cards, and define matchups"
        actionLabel="Create Event"
        actionHref="/admin/event-management/new"
      />
      <EventsDatabase />
    </>
  );
}