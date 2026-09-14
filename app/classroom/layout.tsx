"use client"

import { SidebarProvider } from "../(dashboard)/_components/sidebar/sidebar-context";
import { DashboardShell } from "../(dashboard)/_components/sidebar/dashboard-shell";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "@/supabase";
import { toast } from "sonner";
import ErrorBanner from "../(dashboard)/_components/banners/error-banner";
import { Logo } from "../(dashboard)/_components/components/logo";

const ClassroomLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [status, setStatus] = useState("loading")
  const router = useRouter()

  async function checkUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        if (data.user) {
          setStatus("done")
        }
        else {
          localStorage.setItem('loggedin_route', pathname)
          router.replace("/login")
        }
      }
      else {
        console.error(error);
        toast.error('Error! Something went wrong.')
        setStatus("error")
      }
    }
    catch {
      toast.error('Error! Something went wrong.')
      setStatus("error")
    }
  }

  useEffect(() => {
    checkUser()
  }, [])
  return (
    <SidebarProvider>
      <DashboardShell>
        <div className="min-h-full">
          {status === "done" && children}
          {status === "error" && (
            <div className="mt-20">
              <ErrorBanner />
            </div>
          )}
          {status === "loading" && (
            <div className="mt-20 animate-ping flex items-center justify-center">
              <Logo />
            </div>
          )}
        </div>
      </DashboardShell>
    </SidebarProvider>
  );
}

export default ClassroomLayout;