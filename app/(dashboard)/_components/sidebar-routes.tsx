"use client";

import { BarChart, BookText, Briefcase, Code2, Compass, Layout, List, RocketIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Home",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
  {
    icon: BookText,
    label: "Resources",
    href: "/resources",
  },
  {
    icon: Briefcase,
    label: "Job/Internships",
    href: "/opportunities",
  },
  {
    icon: Code2,
    label: "Projects",
    href: "/projects",
  },
  {
    icon: RocketIcon,
    label: "DSA & CP",
    href: "/dsa-cp",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
]

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}