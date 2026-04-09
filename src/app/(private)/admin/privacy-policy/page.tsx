import { AdminPageHeader } from "../components/AdminPageHeader";

export default function PrivacyPolicyPage() {
  return (
    <>
      <AdminPageHeader
        title="Privacy Policy"
        subtitle="Manage privacy and data usage statements"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Privacy policy content</section>
    </>
  );
}