"use client";

import React from "react";

import { Bell } from "lucide-react";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { Button, Separator } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface NotificationItem {
  id: number;
  title: string;
  description: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Event results pending",
    description: "UFC Fight Night 302 is waiting for official result confirmation.",
    read: false
  },
  {
    id: 2,
    title: "New league join request",
    description: "3 managers requested access to Heavyweight Pro League.",
    read: false
  },
  {
    id: 3,
    title: "System update completed",
    description: "Scoring rule set v2.4 has been applied successfully.",
    read: true
  }
];
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const handleReadAllNotifications = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        read: true
      }))
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DynamicBreadcrumb />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Notifications"
                className="relative size-9 shrink-0 group-data-[collapsible=icon]:hidden"
                size="icon"
                variant="ghost"
              >
                <Bell className="size-4" />
                {unreadCount > 0 ? (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between border-b px-3 py-2">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <Button
                  className="h-7 px-2 text-xs"
                  disabled={unreadCount === 0}
                  size="xs"
                  type="button"
                  variant="ghost"
                  onClick={handleReadAllNotifications}
                >
                  Read all
                </Button>
              </div>

              <div className="max-h-72 overflow-y-auto p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="space-y-1 rounded-md px-2 py-2 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                      {!notification.read ? (
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-emerald-500" />
                      ) : null}
                    </div>
                    <p className="text-xs leading-5 text-slate-600">{notification.description}</p>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="flex flex-1 flex-col gap-4 overflow-y-hidden rounded-tl-xl bg-background p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
