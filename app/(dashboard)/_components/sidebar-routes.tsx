"use client";

import { BarChart, BookText, Briefcase, Code2, Compass, ComputerIcon, GitFork, Layout, List, RocketIcon, UserCheck, Users } from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
  },
  // {
  //   icon: Compass,
  //   label: "Browse",
  //   href: "/explore",
  // },
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
  {
    icon: ComputerIcon,
    label: "CS Fundamentals",
    href: "/cs-fundamentals",
  },
  {
    icon: UserCheck,
    label: "Interview Preparation",
    href: "/interview-preparation",
  },
  {
    icon: GitFork,
    label: "System Design",
    href: "/system-design",
  },
  {
    icon: Users,
    label: "Community",
    href: "/community",
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