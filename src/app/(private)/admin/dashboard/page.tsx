import { AdminPageHeader } from "../components/AdminPageHeader";
import { DashboardStatsSection } from "./components/DashboardStatsSection";
import { RecentActivitySection } from "./components/RecentActivitySection";
import { UserActivityChartSection } from "./components/UserActivityChartSection";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle="Track leagues, monitor engagement, and review latest admin activity"
      />
      <DashboardStatsSection />
      <UserActivityChartSection />
      <RecentActivitySection />
    </section>
  );
}
