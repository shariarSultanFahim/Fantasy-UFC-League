import { AdminPageHeader } from "../components/AdminPageHeader";

export default function ProfilePage() {
  return (
    <>
      <AdminPageHeader
        title="Profile"
        subtitle="Update account identity and admin preferences"
      />
      <section className="rounded-xl border border-border/60 bg-card p-6">Profile content</section>
    </>
  );
}