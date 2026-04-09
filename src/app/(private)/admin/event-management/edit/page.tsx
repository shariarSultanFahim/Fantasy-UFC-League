import { AdminPageHeader } from "../../components/AdminPageHeader";

import { EventForm } from "../components/EventForm";
import { getEventById } from "../components/events-data";

interface EditEventPageProps {
  searchParams: Promise<{ eventId?: string }>;
}

export default async function EditEventPage({ searchParams }: EditEventPageProps) {
  const { eventId } = await searchParams;
  const event = getEventById(eventId);

  return (
    <>
      <AdminPageHeader title="Edit Event" subtitle="Update winners and finalize completed bout results" />
      <EventForm mode="edit" initialEvent={event} />
    </>
  );
}
