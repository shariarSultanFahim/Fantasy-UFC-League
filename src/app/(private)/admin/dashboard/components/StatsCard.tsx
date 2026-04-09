import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { DashboardStatCard } from "@/types";

interface StatsCardProps {
  stat: DashboardStatCard;
  tone: "dark" | "mid" | "light";
}

const toneStyles: Record<StatsCardProps["tone"], string> = {
  dark:
    "border-sky-950/70 bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900 text-sky-50 shadow-lg shadow-sky-900/30",
  mid: "border-blue-700/60 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-500 text-sky-50 shadow-lg shadow-blue-700/25",
  light:
    "border-blue-600/60 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-sky-50 shadow-lg shadow-blue-600/25"
};

export function StatsCard({ stat, tone }: StatsCardProps) {
  return (
    <Card className={cn("gap-4 py-4", toneStyles[tone])}>
      <CardContent className="space-y-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium text-white/80">{stat.title}</p>
          <span className="text-xs font-semibold text-emerald-200">{stat.delta}</span>
        </div>
        <p className="text-4xl font-bold leading-none tracking-tight">{stat.value}</p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-3/5 rounded-full bg-white/90" />
          </div>
          <span className="text-[11px] text-white/70">{stat.targetLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}