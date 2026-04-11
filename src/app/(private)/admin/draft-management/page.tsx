import { AdminPageHeader } from "../components/AdminPageHeader";
import { DraftHistoryDatabase } from "./components/DraftHistoryDatabase";
import { DraftOverviewSection } from "./components/DraftOverviewSection";

export default function DraftManagementPage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Draft Management"
        subtitle="Control draft rooms, picks, and draft settings"
      />
      <DraftOverviewSection />
      <DraftHistoryDatabase />
    </section>
  );
}
