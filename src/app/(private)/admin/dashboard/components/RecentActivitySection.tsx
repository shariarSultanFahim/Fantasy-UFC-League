import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui";
import type { ActivityStatus, RecentActivity } from "@/types";

const latestActivities: RecentActivity[] = [
  {
    id: "a1",
    userName: "John Doe",
    userInitials: "JD",
    action: "Created League",
    target: "Premier Elite 2024",
    status: "completed",
    timeAgo: "2 mins ago"
  },
  {
    id: "a2",
    userName: "Sarah King",
    userInitials: "SK",
    action: "Updated Profile",
    target: "User Settings",
    status: "completed",
    timeAgo: "15 mins ago"
  },
  {
    id: "a3",
    userName: "Mike Ross",
    userInitials: "MR",
    action: "Deleted Draft",
    target: "Winter Cup Draft",
    status: "pending",
    timeAgo: "42 mins ago"
  },
  {
    id: "a4",
    userName: "Laura Chen",
    userInitials: "LC",
    action: "Joined League",
    target: "Rookie Series B",
    status: "completed",
    timeAgo: "1 hour ago"
  },
  {
    id: "a5",
    userName: "Mina Patel",
    userInitials: "MP",
    action: "Updated Scoring",
    target: "Main League Rules",
    status: "completed",
    timeAgo: "2 hours ago"
  }
];

const statusStyles: Record<ActivityStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700"
};

export function RecentActivitySection() {
  return (
    <Card className="gap-3 py-4">
      <CardHeader className="px-5 sm:px-6">
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <CardDescription>Latest 5 actions across leagues and users</CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-5 text-xs uppercase tracking-wide text-muted-foreground sm:px-6">
                User
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                Action
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                Target
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="pr-5 text-xs uppercase tracking-wide text-muted-foreground sm:pr-6">
                Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {latestActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {activity.userInitials}
                    </div>
                    <span className="font-medium text-foreground">{activity.userName}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-muted-foreground">{activity.action}</TableCell>
                <TableCell className="py-4 font-medium text-foreground">{activity.target}</TableCell>
                <TableCell className="py-4">
                  <span
                    className={`inline-flex rounded-sm px-2 py-1 text-[11px] font-semibold uppercase ${statusStyles[activity.status]}`}
                  >
                    {activity.status}
                  </span>
                </TableCell>
                <TableCell className="pr-5 py-4 text-muted-foreground sm:pr-6">
                  {activity.timeAgo}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}