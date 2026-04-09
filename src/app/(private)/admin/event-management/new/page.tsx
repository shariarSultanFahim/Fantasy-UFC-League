import { AdminPageHeader } from "../../components/AdminPageHeader";

import { EventForm } from "../components/EventForm";

export default function NewEventPage() {
  return (
    <>
      <AdminPageHeader
        title="Create Event"
        subtitle="Manage and configure live event data, create fight cards, and define matchups"
      />
      <EventForm mode="create" />
    </>
  );
}
