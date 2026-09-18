"use client";

import React from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useSidebar } from "./sidebar-context";

export const MobileSidebar = () => {
  const { isMobileOpen, setMobileOpen } = useSidebar();

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden p-2 mr-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-card border-r border-border shadow-2xl z-50">
        <Sidebar isMobile className="w-full border-r-0" onItemClick={() => setMobileOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};
