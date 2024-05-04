"use client";

import { BarChart, BookText, Briefcase, Calendar, Code, Code2, Code2Icon, ComputerIcon, Flame, GitFork, GraduationCap, Layout, LayoutDashboard, List, ListVideo, RocketIcon, Route, ScrollText, User, UserCheck, UserSquare, Users, Video } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";

const siteRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
  },
  // {
  //   icon: BookText,
  //   label: "Resources",
  //   href: "/resources",
  // },
  {
    icon: ListVideo,
    label: "Live Classes 🚀",
    href: "/classroom/dashboard",
  },
  {
    icon: RocketIcon,
    label: "DSA & CP",
    href: "/dsa-cp",
  },
  {
    icon: Code2,
    label: "Projects",
    href: "/projects",
  },
  {
    icon: Briefcase,
    label: "Job/Internships",
    href: "/opportunities",
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
    icon: ScrollText,
    label: "Resume Builder",
    href: "/resume",
  },
  {
    icon: GitFork,
    label: "System Design",
    href: "/system-design",
  },
  {
    icon: Flame,
    label: "Coding 75",
    href: "/pro",
  },
];

const classroomRoutes = [
  {
    icon: LayoutDashboard,
    label: "Pro Dashboard",
    href: "/classroom/dashboard",
  },
  {
    icon: ListVideo,
    label: "Live Classes",
    href: "/classroom/live",
  },
  {
    icon: BookText,
    label: "Class Material",
    href: "/classroom/resources",
  },
  {
    icon: ScrollText,
    label: "Resume Review",
    href: "/classroom/resume-review",
  },
  {
    icon: GraduationCap,
    label: "1:1 Mentorship",
    href: "/classroom/mentorship",
  },
  {
    icon: UserSquare,
    label: "Mock Interview",
    href: "/classroom/mock-interview",
  },
  {
    icon: Code2Icon,
    label: "Live Project Building",
    href: "/classroom/projects",
  },
  {
    icon: ComputerIcon,
    label: "CS Fundamental",
    href: "/classroom/cs-fundamental",
  },
  {
    icon: UserCheck,
    label: "Subscription Details",
    href: "/classroom/subscription",
  },
]

const adminRoutes = [
  {
    icon: User,
    label: "Admin Home",
    href: "/admin",
  },
  {
    icon: Briefcase,
    label: "Add Opportunity",
    href: "/admin/opportunity",
  },
  {
    icon: Code,
    label: "Add Leetcode POTD",
    href: "/admin/leetcode-potd",
  },
  {
    icon: Code2Icon,
    label: "Add Leetcode Contest",
    href: "/admin/leetcode-contests",
  },
  {
    icon: Code,
    label: "Add Codeforces",
    href: "/admin/codeforces",
  },
  {
    icon: Code,
    label: "Add Codechef",
    href: "/admin/codechef",
  },
  {
    icon: Code2,
    label: "Add Projects",
    href: "/admin/projects",
  },
  {
    icon: Code2,
    label: "Add DSA Problem",
    href: "/admin/problems",
  },
  {
    icon: Video,
    label: "Live Classes",
    href: "/admin/live-class",
  }
]

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isClassroomPage = pathname?.startsWith("/classroom");

  const isAdminPage = pathname?.startsWith("/admin")

  const routes = isClassroomPage ? classroomRoutes : isAdminPage ? adminRoutes : siteRoutes;

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