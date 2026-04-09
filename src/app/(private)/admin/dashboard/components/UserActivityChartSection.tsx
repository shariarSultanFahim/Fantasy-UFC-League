"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { UserActivityPoint } from "@/types";

const chartData: UserActivityPoint[] = [
  { day: "Mon", interactions: 68 },
  { day: "Tue", interactions: 74 },
  { day: "Wed", interactions: 11 },
  { day: "Thu", interactions: 76 },
  { day: "Fri", interactions: 16 },
  { day: "Sat", interactions: 101 },
  { day: "Sun", interactions: 110 }
];

const chartConfig = {
  interactions: {
    label: "Interactions",
    color: "#2563eb"
  }
} satisfies ChartConfig;

export function UserActivityChartSection() {
  return (
    <Card className="gap-4 py-4">
      <CardHeader className="grid-cols-[1fr_auto] items-start gap-3 px-5 sm:px-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">User Activity</CardTitle>
          <CardDescription>Daily interaction metrics for past week</CardDescription>
        </div>
        <p className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Last 7 Days
        </p>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <ChartContainer config={chartConfig} className="h-80">
          <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="activity-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#e2e8f0" />
            <XAxis
              axisLine={false}
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis axisLine={false} dataKey="interactions" tickLine={false} tickMargin={10} width={30} />
            <ChartTooltip content={<ChartTooltipContent config={chartConfig} />} cursor={false} />
            <Area
              dataKey="interactions"
              fill="url(#activity-gradient)"
              fillOpacity={1}
              stroke="#3b82f6"
              strokeWidth={3}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}