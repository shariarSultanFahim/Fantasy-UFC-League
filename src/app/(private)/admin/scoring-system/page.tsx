import { AdminPageHeader } from "../components/AdminPageHeader";

export default function ScoringSystemPage() {
  return (
    <>
      <AdminPageHeader
        title="Scoring System"
        subtitle="Configure point rules and scoring multipliers"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Scoring system content</section>
    </>
  );
}