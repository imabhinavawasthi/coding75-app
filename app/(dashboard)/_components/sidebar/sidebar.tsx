"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Code2, Sparkles } from "lucide-react";
import { Logo } from "../components/logo";
import { SidebarRoutes } from "./sidebar-routes";
import { useSidebar } from "./sidebar-context";
import { useProStatus } from "@/hooks/use-pro-status";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export const Sidebar = ({ className, isMobile = false, onItemClick }: SidebarProps) => {
  const { isCollapsed } = useSidebar();
  const { isPro } = useProStatus();

  // Mobile drawer is always expanded
  const collapsed = isMobile ? false : isCollapsed;

  return (
    <aside
      className={cn(
        "h-full border-r border-border/70 flex flex-col justify-between bg-card/95 backdrop-blur-md text-card-foreground shadow-xs select-none transition-all duration-300 ease-in-out relative",
        collapsed ? "w-[72px]" : "w-64",
        className
      )}
    >
      {/* Top Section: Header & Routes */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Sidebar Header */}
        <div
          className={cn(
            "h-[70px] flex items-center border-b border-border/60 shrink-0 px-4 transition-all duration-300",
            collapsed ? "justify-center px-2" : "justify-center px-4"
          )}
        >
          {collapsed ? (
            <TooltipProvider delayDuration={50}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/dashboard"
                    onClick={onItemClick}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground font-black text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
                  >
                    <Code2 className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-semibold text-xs shadow-xl border border-border/80 px-2.5 py-1 z-50">
                  coding75 Dashboard
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              href="/dashboard"
              onClick={onItemClick}
              className="hover:opacity-85 transition-opacity flex items-center"
            >
              <Logo width={140} height={36} />
            </Link>
          )}
        </div>

        {/* Scrollable Navigation Routes */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-1 px-1">
          <SidebarRoutes isCollapsed={collapsed} onItemClick={onItemClick} />
        </div>
      </div>

      {/* Bottom Pro Widget */}
      <div className="p-2 border-t border-border/60 bg-muted/15 shrink-0">
        {collapsed ? (
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={isPro ? "/pro/dashboard" : "/pro"}
                  onClick={onItemClick}
                  className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs hover:scale-105 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-semibold text-xs shadow-xl border border-border/80 px-2.5 py-1 z-50">
                {isPro ? "View Pro Dashboard ✨" : "coding75 Pro 🚀"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Link
            href={isPro ? "/pro/dashboard" : "/pro"}
            onClick={onItemClick}
            className="group relative block rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-2 hover:border-amber-500/40 hover:shadow-sm transition-all select-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-1 leading-none">
                    <span>{isPro ? "View Pro" : "coding75 Pro"}</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1 py-0.2 rounded font-extrabold">
                      {isPro ? "ACTIVE" : "PRO"}
                    </span>
                  </p>
                  <p className="text-[10.5px] text-muted-foreground truncate mt-1">
                    {isPro ? "Your Pro Pass is Active ✨" : "Live Classes & Placement Guidance"}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
};
