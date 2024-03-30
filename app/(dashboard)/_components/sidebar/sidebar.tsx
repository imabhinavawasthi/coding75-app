"use client"

import { Logo } from "../components/logo"
import { SidebarRoutes } from "./sidebar-routes"

export const Sidebar = () => {
  return (
    <div className="no-scrollbar h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm" >
      <div className="p-6">
        <a
          href="/dashboard"
        >
          <Logo />
        </a>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  )
}