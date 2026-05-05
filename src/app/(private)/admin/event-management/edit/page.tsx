"use client";

import { use } from "react";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import { EventForm } from "../components/EventForm";

interface EditEventPageProps {
  searchParams: Promise<{ eventId?: string }>;
}

export default function EditEventPage({ searchParams }: EditEventPageProps) {
  const { eventId } = use(searchParams);

  return (
    <>
      <AdminPageHeader 
        title="Edit Event" 
        subtitle="Update winners and finalize completed bout results" 
      />
      <EventForm mode="edit" eventId={eventId} />
    </>
  );
}
