import { StatsCard } from "./StatsCard";

import type { DashboardStatCard } from "@/types";

const statsData: DashboardStatCard[] = [
  {
    id: "total-leagues",
    title: "Total Leagues",
    value: "1,284",
    delta: "+12.5%",
    targetLabel: "Target 2k"
  },
  {
    id: "new-users",
    title: "New Users",
    value: "2,540",
    delta: "+15.4%",
    targetLabel: "Last 30d"
  },
  {
    id: "active-users",
    title: "Total Users",
    value: "432",
    delta: "+5.2%",
    targetLabel: "Live now"
  }
];

export function DashboardStatsSection() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {statsData.map((stat, index) => {
        const tone = index === 0 ? "dark" : index === 1 ? "mid" : "light";

        return <StatsCard key={stat.id} stat={stat} tone={tone} />;
      })}
    </section>
  );
}