"use client"

import { Logo } from "./logo"
import { SidebarRoutes } from "./sidebar-routes"
import { useRouter } from "next/navigation";

export const Sidebar = () => {
  const router = useRouter();
  const onClick = () => {
    router.push("/");
  }
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
      <button
      onClick={onClick}
      type="button"
    >
        <Logo />
        </button>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  )
}