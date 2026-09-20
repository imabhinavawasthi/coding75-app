"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  exact?: boolean;
  badge?: string;
  isCollapsed?: boolean;
  indent?: boolean;
  isLocked?: boolean;
  onLockedClick?: () => void;
  onClick?: () => void;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  exact = false,
  badge,
  isCollapsed = false,
  indent = false,
  isLocked = false,
  onLockedClick,
  onClick,
}: SidebarItemProps) => {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname === href ||
      (href !== "/dashboard" && href !== "/admin" && href !== "/classroom" && pathname?.startsWith(`${href}`));

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      onLockedClick?.();
      return;
    }
    onClick?.();
  };

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={href}
              onClick={handleClick}
              className={cn(
                "flex items-center justify-center h-10 w-10 mx-auto my-1 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold ring-2 ring-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                isLocked && "opacity-85 hover:border-amber-500/30"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {isActive && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
              )}
              {isLocked && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500/90 text-white flex items-center justify-center shadow-xs">
                  <Lock className="w-2 h-2" />
                </span>
              )}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="flex items-center gap-1.5 font-semibold text-xs shadow-xl border border-border/80 px-2.5 py-1 z-50">
            <span>{label}</span>
            {isLocked ? (
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" /> PRO
              </span>
            ) : badge ? (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/15 text-primary">
                {badge}
              </span>
            ) : null}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-x-2 text-sm font-medium px-2 py-1.5 mx-1 my-0.5 rounded-lg transition-all duration-150 relative select-none",
        isActive
          ? "bg-primary/10 text-primary font-semibold shadow-xs border border-primary/20"
          : "text-muted-foreground/90 hover:text-foreground hover:bg-muted/60",
        indent && "pl-6",
        isLocked && "hover:border-amber-500/30"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
      )}
      <div
        className={cn(
          "w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all duration-150",
          isActive
            ? "bg-primary text-primary-foreground shadow-xs shadow-primary/30"
            : "text-muted-foreground/80 group-hover:text-foreground group-hover:bg-muted/80",
          isLocked && "text-amber-600 dark:text-amber-400 bg-amber-500/10"
        )}
      >
        <Icon
          className="w-4 h-4 transition-transform duration-150 group-hover:scale-105"
        />
      </div>
      <span className="truncate leading-normal">{label}</span>
      {isLocked ? (
        <span className="ml-auto flex items-center gap-1 text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0 font-mono">
          <Lock className="w-2.5 h-2.5" />
          <span>{badge || "PRO"}</span>
        </span>
      ) : badge ? (
        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
          {badge}
        </span>
      ) : null}
    </Link>
  );
};
