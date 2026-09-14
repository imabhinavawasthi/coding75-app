"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  BookText,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronRight,
  Code,
  Code2,
  Code2Icon,
  ComputerIcon,
  FileText,
  Flame,
  GitFork,
  GraduationCap,
  Layout,
  LayoutDashboard,
  ListVideo,
  MessageSquare,
  RocketIcon,
  ScrollText,
  Send,
  Sparkles,
  Trophy,
  User,
  UserCheck,
  UserSquare,
  Video,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavSubItem {
  icon: any;
  label: string;
  href: string;
  badge?: string;
  exact?: boolean;
}

interface NavGroup {
  id: string;
  title: string;
  icon: any;
  items: NavSubItem[];
  defaultOpen?: boolean;
  color?: string;
  badgeColor?: string;
}

const siteNavigation: (NavSubItem | NavGroup)[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    exact: true,
  },
  {
    id: "dsa-contests",
    title: "DSA & Contests",
    icon: Trophy,
    defaultOpen: true,
    color: "text-amber-600 dark:text-amber-400",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    items: [
      {
        icon: GraduationCap,
        label: "Learn DSA",
        href: "/dsa",
      },
      {
        icon: Trophy,
        label: "Contest Solutions",
        href: "/contests",
      },
      {
        icon: ListVideo,
        label: "Practice Sheets",
        href: "/dsa-cp/sheets",
      },
      {
        icon: Sparkles,
        label: "Masterclasses",
        href: "/dsa#masterclasses",
      },
    ],
  },
  {
    id: "interview-prep",
    title: "Interview Preparation",
    icon: UserCheck,
    defaultOpen: true,
    color: "text-purple-600 dark:text-purple-400",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
    items: [
      {
        icon: Code2,
        label: "Projects",
        href: "/projects",
      },
      {
        icon: ComputerIcon,
        label: "CS Fundamentals",
        href: "/cs-fundamentals",
      },
      {
        icon: GitFork,
        label: "System Design",
        href: "/system-design",
      },
      {
        icon: MessageSquare,
        label: "Interview Experiences",
        href: "/interview-experiences",
      },
      {
        icon: UserSquare,
        label: "Mock Interviews",
        href: "/mock-interviews",
      },
    ],
  },
  {
    id: "job-applications",
    title: "Job Applications",
    icon: Briefcase,
    defaultOpen: true,
    color: "text-emerald-600 dark:text-emerald-400",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    items: [
      {
        icon: Briefcase,
        label: "Jobs & Internships Portal",
        href: "/opportunities",
      },
      {
        icon: FileText,
        label: "Resume Builder",
        href: "/resume",
      },
    ],
  },
  {
    icon: Sparkles,
    label: "Coding75 Pro",
    href: "/pro",
  },
];

const classroomRoutes: NavSubItem[] = [
  { icon: LayoutDashboard, label: "Pro Dashboard", href: "/classroom/dashboard" },
  { icon: Calendar, label: "Class Schedule", href: "/classroom/schedule" },
  { icon: ListVideo, label: "Live Classes", href: "/classroom/live" },
  { icon: GitFork, label: "Live DSA Classes", href: "/classroom/dsa" },
  { icon: BarChart2, label: "Live CP Classes", href: "/classroom/competitive-programming" },
  { icon: BookText, label: "Class Material", href: "/classroom/resources" },
  { icon: ScrollText, label: "Resume Review", href: "/classroom/resume-review" },
  { icon: GraduationCap, label: "1:1 Mentorship", href: "/classroom/mentorship" },
  { icon: UserSquare, label: "Mock Interview", href: "/classroom/mock-interview" },
  { icon: Code2Icon, label: "Live Project Building", href: "/classroom/projects" },
  { icon: ComputerIcon, label: "CS Fundamental", href: "/classroom/cs-fundamental" },
  { icon: UserCheck, label: "Subscription Details", href: "/classroom/subscription" },
];

const adminRoutes: NavSubItem[] = [
  { icon: User, label: "Admin Home", href: "/admin" },
  { icon: Briefcase, label: "Add Opportunity", href: "/admin/opportunity" },
  { icon: Code, label: "Add Leetcode POTD", href: "/admin/leetcode-potd" },
  { icon: Code2Icon, label: "Add Leetcode Contest", href: "/admin/leetcode-contests" },
  { icon: Code, label: "Add Codeforces", href: "/admin/codeforces" },
  { icon: Code, label: "Add Codechef", href: "/admin/codechef" },
  { icon: Code2, label: "Add Projects", href: "/admin/projects" },
  { icon: Code2, label: "Add DSA Problem", href: "/admin/problems" },
  { icon: Video, label: "Live Classes", href: "/admin/live-class" },
  { icon: GraduationCap, label: "Batches", href: "/admin/batches" },
];

interface SidebarRoutesProps {
  isCollapsed?: boolean;
  onItemClick?: () => void;
}

export const SidebarRoutes = ({ isCollapsed = false, onItemClick }: SidebarRoutesProps) => {
  const pathname = usePathname();

  const isClassroomPage = pathname?.startsWith("/classroom");
  const isAdminPage = pathname?.startsWith("/admin");
  const isBatchPage = pathname?.startsWith("/batch");

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
    if (cached) setBatchType(cached);
    const handleUpdate = () => {
      const updated = sessionStorage.getItem(`batch_type_${batchId}`);
      if (updated) setBatchType(updated);
    };
    window.addEventListener("batch_type_updated", handleUpdate);
    return () => window.removeEventListener("batch_type_updated", handleUpdate);
  }, [batchId]);

  const isDsaBatch = batchType === "dsa" || pathname?.includes("/progress") || pathname?.includes("/ranklist");

  const batchRoutes: NavSubItem[] = useMemo(() => {
    if (!batchId) return [];
    return [
      { icon: LayoutDashboard, label: "Batch Dashboard", href: `/batch/${batchId}`, exact: true },
      ...(isDsaBatch
        ? [
            { icon: BarChart2, label: "Progress", href: `/batch/${batchId}/progress` },
            { icon: Trophy, label: "Batch Ranklist", href: `/batch/${batchId}/ranklist` },
          ]
        : []),
      { icon: Video, label: "Class Recordings", href: `/batch/${batchId}/recordings` },
      { icon: UserCheck, label: "Attendance", href: `/batch/${batchId}/attendance` },
      { icon: ScrollText, label: "Assignments", href: `/batch/${batchId}/assignments` },
      { icon: BookText, label: "Notes & Resources", href: `/batch/${batchId}/resources` },
      { icon: GraduationCap, label: "Batch Details", href: `/batch/${batchId}/details` },
    ];
  }, [batchId, isDsaBatch]);

  // Submenu open states (accordion)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "dsa-contests": true,
    "interview-prep": true,
    "job-applications": true,
  });

  // Automatically expand group if active pathname matches
  useEffect(() => {
    siteNavigation.forEach((item) => {
      if ("items" in item) {
        const hasActiveChild = item.items.some(
          (child) => pathname === child.href || pathname?.startsWith(`${child.href}/`)
        );
        if (hasActiveChild) {
          setOpenGroups((prev) => ({ ...prev, [item.id]: true }));
        }
      }
    });
  }, [pathname]);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Render Flat Routes for Admin, Classroom, Batch
  if (isClassroomPage || isAdminPage || (isBatchPage && batchId)) {
    const activeRouteList = isClassroomPage
      ? classroomRoutes
      : isAdminPage
      ? adminRoutes
      : batchRoutes;

    return (
      <div className="flex flex-col w-full py-1">
        {activeRouteList.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            exact={route.exact}
            badge={route.badge}
            isCollapsed={isCollapsed}
            onClick={onItemClick}
          />
        ))}
      </div>
    );
  }

  // Render Modern Categorized Site Routes with Submenus
  return (
    <div className="flex flex-col w-full py-1 space-y-0.5">
      {siteNavigation.map((navItem, idx) => {
        const isFirst = idx === 0;

        // Individual Top-level item (e.g. Dashboard, Pro)
        if ("href" in navItem) {
          return (
            <React.Fragment key={navItem.href}>
              {!isFirst && (
                isCollapsed ? (
                  <div className="w-8 mx-auto my-1.5 border-t border-border/60" />
                ) : (
                  <div className="my-1.5 mx-2 border-t border-border/50" />
                )
              )}
              <SidebarItem
                icon={navItem.icon}
                label={navItem.label}
                href={navItem.href}
                exact={navItem.exact}
                badge={navItem.badge}
                isCollapsed={isCollapsed}
                onClick={onItemClick}
              />
            </React.Fragment>
          );
        }

        // Submenu Group (e.g. DSA & Contests, Career & Prep)
        const group = navItem as NavGroup;
        const isOpen = openGroups[group.id] ?? group.defaultOpen ?? true;
        const hasActiveChild = group.items.some(
          (child) => pathname === child.href || pathname?.startsWith(`${child.href}/`)
        );
        const GroupIcon = group.icon;

        // COLLAPSED MODE: Show Popover / Flyout menu on click/hover
        if (isCollapsed) {
          return (
            <React.Fragment key={group.id}>
              {!isFirst && <div className="w-8 mx-auto my-1.5 border-t border-border/60" />}
              <div className="w-full flex justify-center py-0.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-150 relative group cursor-pointer",
                        hasActiveChild
                          ? "bg-primary/15 text-primary shadow-2xs font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                      )}
                      title={group.title}
                    >
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", group.badgeColor)}>
                        <GroupIcon className="w-4 h-4" />
                      </div>
                      {hasActiveChild && (
                        <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-56 p-1.5 shadow-xl rounded-xl z-50">
                    <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5 flex items-center gap-2">
                      <div className={cn("w-5 h-5 rounded flex items-center justify-center", group.badgeColor)}>
                        <GroupIcon className="w-3.5 h-3.5" />
                      </div>
                      <span>{group.title}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {group.items.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive =
                        pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`);
                      return (
                        <DropdownMenuItem key={subItem.href} asChild className="p-0 rounded-lg">
                          <Link
                            href={subItem.href}
                            onClick={onItemClick}
                            className={cn(
                              "flex items-center justify-between w-full px-2.5 py-2 text-xs font-medium cursor-pointer rounded-lg transition-colors",
                              isSubActive
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-foreground hover:bg-muted"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <SubIcon className={cn("w-3.5 h-3.5", isSubActive ? "text-primary" : "text-muted-foreground")} />
                              <span>{subItem.label}</span>
                            </div>
                            {subItem.badge && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </React.Fragment>
          );
        }

        // EXPANDED MODE: Collapsible Submenu Accordion
        return (
          <React.Fragment key={group.id}>
            {!isFirst && <div className="my-1.5 mx-2 border-t border-border/50" />}
            <div className="pt-0.5">
              {/* Submenu Accordion Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-all select-none cursor-pointer group",
                  hasActiveChild
                    ? "bg-muted/50 text-foreground"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-5 h-5 rounded-md flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105", group.badgeColor)}>
                    <GroupIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className={cn("text-[11.5px] tracking-wide font-bold", hasActiveChild ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                    {group.title}
                  </span>
                </div>
                <div className="text-muted-foreground/50 group-hover:text-foreground p-0.5">
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200" />
                  )}
                </div>
              </button>

              {/* Submenu Children */}
              {isOpen && (
                <div className="mt-0.5 space-y-0.5 transition-all duration-200">
                  {group.items.map((subItem) => (
                    <SidebarItem
                      key={subItem.href}
                      icon={subItem.icon}
                      label={subItem.label}
                      href={subItem.href}
                      exact={subItem.exact}
                      badge={subItem.badge}
                      isCollapsed={false}
                      indent={false}
                      onClick={onItemClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
