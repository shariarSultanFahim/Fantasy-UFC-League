import { AdminPageHeader } from "../components/AdminPageHeader";

export default function LeaguesPage() {
  return (
    <>
      <AdminPageHeader
        title="League Management"
        subtitle="Manage all active and upcoming leagues"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Leagues content</section>
    </>
  );
}