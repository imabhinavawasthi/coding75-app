"use client";

import React from "react";
import { useSidebar } from "./sidebar-context";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";

export const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="h-full min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <div
        className={cn(
          "h-[70px] fixed inset-y-0 w-full z-40 transition-all duration-300 ease-in-out",
          isCollapsed ? "md:pl-[72px]" : "md:pl-64"
        )}
      >
        <Navbar />
      </div>

      {/* Desktop Fixed Sidebar */}
      <div
        className={cn(
          "hidden md:flex h-full flex-col fixed inset-y-0 z-50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main
        className={cn(
          "pt-[70px] min-h-screen flex flex-col justify-between transition-all duration-300 ease-in-out",
          isCollapsed ? "md:pl-[72px]" : "md:pl-64"
        )}
      >
        <div className="flex-1 w-full">{children}</div>
        <footer>
          <Footer />
        </footer>
      </main>
    </div>
  );
};
