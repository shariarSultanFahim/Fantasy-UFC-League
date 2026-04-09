import { AdminPageHeader } from "../components/AdminPageHeader";

export default function FightResultsPage() {
  return (
    <>
      <AdminPageHeader
        title="Fight Results"
        subtitle="Review and publish official matchup outcomes"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Fight results content</section>
    </>
  );
}