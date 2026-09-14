"use client";

import React from "react";
import { SidebarProvider } from "@/app/(dashboard)/_components/sidebar/sidebar-context";
import { DashboardShell } from "@/app/(dashboard)/_components/sidebar/dashboard-shell";

export default function BatchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <DashboardShell>
                <div className="pb-16">{children}</div>
            </DashboardShell>
        </SidebarProvider>
    );
}
