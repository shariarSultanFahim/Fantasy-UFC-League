import { AdminPageHeader } from "../components/AdminPageHeader";

export default function TermsAndConditionsPage() {
  return (
    <>
      <AdminPageHeader
        title="Terms & Conditions"
        subtitle="Manage platform terms for league participants"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Terms and conditions content</section>
    </>
  );
}