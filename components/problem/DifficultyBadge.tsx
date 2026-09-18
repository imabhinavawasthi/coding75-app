"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type Difficulty = "Easy" | "Medium" | "Hard" | string;

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const CONFIG: Record<string, { classes: string; dot: string }> = {
  Easy: {
    classes:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 shadow-xs",
    dot: "bg-emerald-500",
  },
  Medium: {
    classes:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 shadow-xs",
    dot: "bg-amber-500",
  },
  Hard: {
    classes:
      "bg-red-50 text-red-700 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 shadow-xs",
    dot: "bg-red-500",
  },
};

const sizeClasses: Record<string, string> = {
  xs: "text-[9px] px-2 py-0.5",
  sm: "text-[10px] px-2.5 py-0.5",
  md: "text-xs px-3 py-1",
};

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  size = "sm",
  className,
}) => {
  const normalized = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  const { classes, dot } = CONFIG[normalized] ?? CONFIG.Easy;
  return (
    <span
      className={cn(
        "inline-flex items-center font-extrabold border rounded-full tracking-wider uppercase select-none",
        sizeClasses[size] || sizeClasses.sm,
        classes,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 animate-pulse", dot)} />
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
