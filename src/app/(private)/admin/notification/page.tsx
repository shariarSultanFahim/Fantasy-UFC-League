import { AdminPageHeader } from "../components/AdminPageHeader";

export default function NotificationPage() {
  return (
    <>
      <AdminPageHeader
        title="Notification"
        subtitle="Manage delivery channels and alert templates"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Notification content</section>
    </>
  );
}