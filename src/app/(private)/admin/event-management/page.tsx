import { AdminPageHeader } from "../components/AdminPageHeader";

export default function EventManagementPage() {
  return (
    <>
      <AdminPageHeader
        title="Event Management"
        subtitle="Create and organize cards, bouts, and schedules"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Event management content</section>
    </>
  );
}