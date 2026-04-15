"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CalendarCog,
  ClipboardPen,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Sword,
  Trophy,
  UserRoundPen
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";

import { Button } from "../ui";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const data = {
  info: {
    title: "Fantasy UFC League",
    subtitle: "Admin Portal"
  },
  navMain: [
    {
      title: "",
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: LayoutDashboard
        },
        {
          title: "Leagues",
          url: "/admin/leagues",
          icon: Trophy
        },
        {
          title: "Fighters",
          url: "/admin/fighters",
          icon: Sword
        },
        {
          title: "Draft Management",
          url: "/admin/draft-management",
          icon: ClipboardPen
        },
        // {
        //   title: "Fight Results",
        //   url: "/admin/fight-results",
        //   icon: Swords
        // },
        {
          title: "Scoring System",
          url: "/admin/scoring-system",
          icon: ShieldCheck
        },
        {
          title: "Event Management",
          url: "/admin/event-management",
          icon: CalendarCog
        },
        {
          title: "Legal Content",
          url: "/admin/legal",
          icon: FileText
        },
        {
          title: "Profile",
          url: "/admin/profile",
          icon: UserRoundPen
        }
      ]
    }
  ],
  navSec: [
    {
      title: "Footer",
      items: [
        {
          title: "Profile",
          url: "/admin/profile",
          icon: UserRoundPen
        },
        {
          title: "Support",
          url: "/admin/about",
          icon: HeartHandshake
        }
      ]
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image src="/logo.png" alt="Logo" width={32} height={32} />
                </div>
                <div className="grid flex-1 text-sm leading-tight">
                  <span className="truncate text-sm font-bold">{data.info.title}</span>
                  <span className="truncate text-xs font-semibold text-sidebar-foreground/60">
                    {data.info.subtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                      className="data-[active=true]:bg-white/25 data-[active=true]:text-primary-foreground data-[active=true]:shadow-md data-[active=true]:backdrop-blur-sm"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="space-y-5">
            <div className="hidden flex-col gap-4 group-data-[collapsible=icon]:flex">
              <Avatar size="lg" className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-start gap-4">
                <Avatar size="lg">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">Gabriel</h2>
                  <h3 className="text-sm text-gray-500">gabriel@fantasyufc.com</h3>
                </div>
              </div>
            </div>
            <SidebarMenuButton asChild className="group-data-[collapsible=icon]:w-full">
              <Button
                variant="outline"
                className="w-full border-secondary bg-transparent group-data-[collapsible=icon]:p-0"
                onClick={() => (window.location.href = "/")}
              >
                <LogOut className="size-4 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
