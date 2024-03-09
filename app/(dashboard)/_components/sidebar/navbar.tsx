import { NavbarRoutes } from "@/app/(dashboard)/_components/sidebar/navbar-routes"

import { MobileSidebar } from "./mobile-sidebar"

export const Navbar = ({isLogo=false}:any) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm" >
      <MobileSidebar />
      <NavbarRoutes isLogo={isLogo} />
    </div>
  )
}