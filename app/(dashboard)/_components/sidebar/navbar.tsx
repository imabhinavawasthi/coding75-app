"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Flame, Layers, PanelLeftClose, PanelLeftOpen, Trophy } from "lucide-react";
import { NavbarRoutes } from "@/app/(dashboard)/_components/sidebar/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";
import { useSidebar } from "./sidebar-context";
import { Button } from "@/components/ui/button";
import { Logo } from "../components/logo";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Navbar = ({ isLogo = false }: { isLogo?: boolean }) => {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const pathname = usePathname();

  const isPotdActive = pathname?.startsWith("/contests/leetcode-potd");
  const isContestsActive = pathname?.startsWith("/contests") && !isPotdActive;
  const isDsaActive = pathname === "/dsa" || (pathname?.startsWith("/dsa") && !pathname?.startsWith("/dsa-cp"));
  const isSheetsActive = pathname?.startsWith("/dsa/sheets");

  return (
    <header className="px-3 sm:px-4 border-b border-border/70 h-full flex items-center justify-between bg-card/90 backdrop-blur-md shadow-2xs relative">
      {/* Left: Mobile drawer trigger & Desktop sidebar toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2 z-10">
        <MobileSidebar />

        {/* Desktop Sidebar Toggle in Navbar */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="hidden md:inline-flex h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" className="text-xs font-medium">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Center: Action buttons flanking the Coding75 Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 pointer-events-auto z-10">
        {/* Left Action Buttons */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/dsa"
            className={cn(
              "h-8 px-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors",
              isDsaActive
                ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
            title="Learn Data Structures & Algorithms"
          >
            <Code2 className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden lg:inline">Learn DSA</span>
            <span className="lg:hidden">DSA</span>
          </Link>

          <Link
            href="/contests"
            className={cn(
              "h-8 px-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors",
              isContestsActive
                ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
            title="Contest Editorials Archive"
          >
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span>Contests</span>
          </Link>
        </div>

        {/* Center Logo */}
        <Link
          href="/dashboard"
          className="hover:opacity-85 transition-opacity flex items-center px-1 sm:px-2 shrink-0"
        >
          <Logo width={120} height={30} />
        </Link>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/contests/leetcode-potd"
            className={cn(
              "h-8 px-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors",
              isPotdActive
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
            title="Daily LeetCode Problem of the Day"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden lg:inline">LeetCode POTD</span>
            <span className="lg:hidden">POTD</span>
          </Link>

          <Link
            href="/dsa/sheets"
            className={cn(
              "h-8 px-2.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors hidden xl:inline-flex",
              isSheetsActive
                ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
            title="Curated Practice Sheets"
          >
            <Layers className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Sheets</span>
          </Link>
        </div>
      </div>

      {/* Right: Pro CTA, Notification Bell, User Avatar */}
      <div className="flex items-center justify-end z-10">
        <NavbarRoutes isLogo={false} />
      </div>
    </header>
  );
};
