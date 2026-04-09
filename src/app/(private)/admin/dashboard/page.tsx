import { AdminPageHeader } from "../components/AdminPageHeader";

export default function DashboardPage() {
  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Overview of fantasy league performance"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Dashboard content</section>
    </>
  );
}
