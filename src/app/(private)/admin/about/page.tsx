import { AdminPageHeader } from "../components/AdminPageHeader";

export default function AboutPage() {
  return (
    <>
      <AdminPageHeader title="About" subtitle="Project details and platform overview" />
      <section className="rounded-xl border border-border/60 bg-card p-6">About content</section>
    </>
  );
}