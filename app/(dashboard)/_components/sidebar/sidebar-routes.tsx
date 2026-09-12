"use client";

import { useState, useEffect } from "react";
import { BarChart, BarChart2, BookText, Briefcase, Calendar, Code, Code2, Code2Icon, ComputerIcon, Flame, GitFork, GraduationCap, Layout, LayoutDashboard, List, ListVideo, RocketIcon, Route, ScrollText, Trophy, User, UserCheck, UserSquare, Users, Video } from "lucide-react";
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
    icon: Calendar,
    label: "Class Schedule",
    href: "/classroom/schedule",
  },
  {
    icon: ListVideo,
    label: "Live Classes",
    href: "/classroom/live",
  },
  {
    icon: GitFork,
    label: "Live DSA Classes",
    href: "/classroom/dsa",
  },
  {
    icon: BarChart2,
    label: "Live CP Classes",
    href: "/classroom/competitive-programming",
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
  },
  {
    icon: GraduationCap,
    label: "Batches",
    href: "/admin/batches",
  }
]

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isClassroomPage = pathname?.startsWith("/classroom");
  const isAdminPage = pathname?.startsWith("/admin");
  const isBatchPage = pathname?.startsWith("/batch");

  // Extract batchId if on a batch subpath
  const batchId = isBatchPage ? pathname?.split("/")[2] : null;

  const [batchType, setBatchType] = useState<string | null>(() => {
    if (typeof window !== "undefined" && batchId) {
      return sessionStorage.getItem(`batch_type_${batchId}`) || null;
    }
    return null;
  });

  useEffect(() => {
    if (!batchId || typeof window === "undefined") return;
    const cached = sessionStorage.getItem(`batch_type_${batchId}`);
    if (cached) {
      setBatchType(cached);
    }
    const handleUpdate = () => {
      const updated = sessionStorage.getItem(`batch_type_${batchId}`);
      if (updated) setBatchType(updated);
    };
    window.addEventListener("batch_type_updated", handleUpdate);
    return () => window.removeEventListener("batch_type_updated", handleUpdate);
  }, [batchId]);

  const isDsaBatch = batchType === "dsa" || pathname?.includes("/progress") || pathname?.includes("/ranklist");

  const batchRoutes = batchId
    ? [
        {
          icon: LayoutDashboard,
          label: "Batch Dashboard",
          href: `/batch/${batchId}`,
          exact: true,
        },
        ...(isDsaBatch
          ? [
              {
                icon: BarChart2,
                label: "DSA Progress",
                href: `/batch/${batchId}/progress`,
              },
              {
                icon: Trophy,
                label: "Batch Ranklist",
                href: `/batch/${batchId}/ranklist`,
              },
            ]
          : []),
        {
          icon: Video,
          label: "Class Recordings",
          href: `/batch/${batchId}/recordings`,
        },
        {
          icon: UserCheck,
          label: "Attendance",
          href: `/batch/${batchId}/attendance`,
        },
        {
          icon: ScrollText,
          label: "Assignments",
          href: `/batch/${batchId}/assignments`,
        },
        {
          icon: BookText,
          label: "Notes & Resources",
          href: `/batch/${batchId}/resources`,
        },
        {
          icon: GraduationCap,
          label: "Batch Details",
          href: `/batch/${batchId}/details`,
        },
      ]
    : siteRoutes;

  const routes = isClassroomPage
    ? classroomRoutes
    : isAdminPage
    ? adminRoutes
    : isBatchPage && batchId
    ? batchRoutes
    : siteRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          exact={(route as any).exact}
        />
      ))}
    </div>
  );
};