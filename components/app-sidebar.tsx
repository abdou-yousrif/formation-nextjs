"use client"

import * as React from "react"
import {
  IconBook,
  IconChartBar,
  IconChartLine,
  IconDashboard,
  IconFolder,
  IconInnerShadowTop,
  IconLayoutDashboard,
  IconListDetails,
  IconSchool,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "../components/nav-main"
import { NavSecondary } from "../components/nav-secondary"
import { NavUser } from "../components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
      highlight: true,
    },
    {
      title: "Élèves",
      url: "/dashboard/eleves",
      icon: IconUsers,
      highlight: false,
    },
    {
      title: "Classes",
      url: "/dashboard/classes",
      icon: IconSchool,
      highlight: false,
    },
    {
      title: "Matières & Évaluations",
      url: "/dashboard/evaluations",
      icon: IconBook,
      highlight: false,
    },
    {
      title: "Rapports / Stats",
      url: "/dashboard/reports",
      icon: IconChartLine,
      highlight: false,
    },
  ],
  navSecondary: [
    {
      title: "Search",
      url: "/dashboard/search",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">EduGrade</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
