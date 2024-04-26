"use client";

import { Flame, LucideIcon, Rocket } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
};

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  return (
    <>
      <Link
        href={href}
        className={cn(
          "hidden lg:flex md:flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
          isActive && "text-primary-700 bg-primary-200/20 hover:bg-primary-200/20 hover:text-primary-700"
        )}//text-sky-700 previous color
      >
        <div className="flex items-center gap-x-2 py-4">
          <Icon
            size={22}
            className={cn(
              "text-slate-500",
              isActive && "text-primary-700"
            )}
          />
          {label}
          {
            href == "/pro" &&
            <>
              <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-700/10">Pro <Flame className="w-4 h-4 ml-1" /></span>
            </>
          }
        </div>
        <div
          className={cn(
            "ml-auto opacity-0 border-2 border-primary-700 h-full transition-all",
            isActive && "opacity-100"
          )}
        />
      </Link>
      <a
        href={href}
        className={cn(
          "lg:hidden md:hidden flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
          isActive && "text-primary-700 bg-primary-200/20 hover:bg-primary-200/20 hover:text-primary-700"
        )}//text-sky-700 previous color
      >
        <div className="flex items-center gap-x-2 py-4">
          <Icon
            size={22}
            className={cn(
              "text-slate-500",
              isActive && "text-primary-700"
            )}
          />
          {label}
          {
            href=="/pro"&&
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">Pro <Flame className="w-4 h-4 ml-1" /></span>
          }
        </div>
        <div
          className={cn(
            "ml-auto opacity-0 border-2 border-primary-700 h-full transition-all",
            isActive && "opacity-100"
          )}
        />
      </a>
    </>
  )
}