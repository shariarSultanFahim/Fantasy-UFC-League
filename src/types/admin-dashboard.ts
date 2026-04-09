export interface DashboardStatCard {
  id: string;
  title: string;
  value: string;
  delta: string;
  targetLabel: string;
}

export interface UserActivityPoint {
  day: string;
  interactions: number;
}

export type ActivityStatus = "completed" | "pending";

export interface RecentActivity {
  id: string;
  userName: string;
  userInitials: string;
  action: string;
  target: string;
  status: ActivityStatus;
  timeAgo: string;
}