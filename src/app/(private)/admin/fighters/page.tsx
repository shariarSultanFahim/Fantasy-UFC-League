import { AdminPageHeader } from "../components/AdminPageHeader";

export default function FightersPage() {
  return (
    <>
      <AdminPageHeader
        title="Fighter Database"
        subtitle="Manage and scout active UFC roster for your leagues"
        actionLabel="Add New Fighter"
        actionHref="/admin/fighters/new"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Fighters content</section>
    </>
  );
}