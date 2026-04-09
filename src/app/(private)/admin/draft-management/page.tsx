import { AdminPageHeader } from "../components/AdminPageHeader";

export default function DraftManagementPage() {
  return (
    <>
      <AdminPageHeader
        title="Draft Management"
        subtitle="Control draft rooms, picks, and draft settings"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Draft management content</section>
    </>
  );
}