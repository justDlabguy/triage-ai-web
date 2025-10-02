"use client"

import * as React from "react"
import {
  IconActivity,
  IconBrain,
  IconDashboard,
  IconHeartHandshake,
  IconHelp,
  IconHospital,
  IconMapPin,
  IconSettings,
  IconStethoscope,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Demo User",
    email: "demo@triageai.com",
    avatar: "/avatars/demo-user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "AI Triage",
      url: "/triage",
      icon: IconBrain,
    },
    {
      title: "Find Clinics",
      url: "/clinics",
      icon: IconHospital,
    },
    {
      title: "Health Profile",
      url: "/profile",
      icon: IconUser,
    },
  ],
  healthFeatures: [
    {
      title: "Symptom Analysis",
      icon: IconStethoscope,
      isActive: true,
      url: "/triage",
      items: [
        {
          title: "New Analysis",
          url: "/triage/new",
        },
        {
          title: "History",
          url: "/triage/history",
        },
      ],
    },
    {
      title: "Emergency Care",
      icon: IconActivity,
      url: "/clinics",
      items: [
        {
          title: "Nearby Clinics",
          url: "/clinics/nearby",
        },
        {
          title: "Emergency Contacts",
          url: "/clinics/emergency",
        },
      ],
    },
    {
      title: "Health Tracking",
      icon: IconHeartHandshake,
      url: "/health",
      items: [
        {
          title: "Wellness Log",
          url: "/health/wellness",
        },
        {
          title: "Medications",
          url: "/health/medications",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Find Location",
      url: "/location",
      icon: IconMapPin,
    },
  ],
  quickActions: [
    {
      name: "Emergency Contacts",
      url: "/emergency",
      icon: IconActivity,
    },
    {
      name: "Health Records",
      url: "/records",
      icon: IconStethoscope,
    },
    {
      name: "Community Health",
      url: "/community",
      icon: IconUsers,
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
              <a href="/dashboard">
                <IconStethoscope className="!size-5 text-blue-600" />
                <span className="text-base font-semibold text-blue-900">Triage AI</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.quickActions} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
