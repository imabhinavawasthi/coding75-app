"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type TagVariant = "topic" | "company" | "neutral";

interface TagPillProps {
  label: string;
  href?: string;
  variant?: TagVariant;
  className?: string;
}

const variantClasses: Record<TagVariant, string> = {
  topic:
    "bg-primary-50/80 text-primary-600 border-primary-200/80 hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/20 dark:hover:bg-primary-500/20 shadow-xs",
  company:
    "bg-gray-50/80 text-gray-700 border-gray-200/80 hover:bg-gray-100 dark:bg-gray-800/80 dark:text-gray-300 dark:border-gray-700/80 dark:hover:bg-gray-700 shadow-xs",
  neutral:
    "bg-gray-50/80 text-gray-700 border-gray-200/80 hover:bg-gray-100 dark:bg-gray-800/80 dark:text-gray-300 dark:border-gray-700/80 dark:hover:bg-gray-700 shadow-xs",
};

export const TagPill: React.FC<TagPillProps> = ({
  label,
  href,
  variant = "neutral",
  className,
}) => {
  const content = (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-bold px-3 py-1 rounded-full border transition-all duration-200 hover:scale-[1.04] active:scale-[0.96] backdrop-blur-xs select-none cursor-pointer",
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export default TagPill;
