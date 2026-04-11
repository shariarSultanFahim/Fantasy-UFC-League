import { AdminPageHeader } from "../components/AdminPageHeader";
import { ProfileSecurityCard } from "./components/ProfileSecurityCard";
import { ProfileSummaryCard } from "./components/ProfileSummaryCard";

export default function ProfilePage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Admin Profile"
        subtitle="Manage your identity, contact details, and security preferences"
      />
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <ProfileSummaryCard />
        <ProfileSecurityCard />
      </div>
    </section>
  );
}
