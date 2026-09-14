"use client"

import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import supabase from "@/supabase";
import { toast } from "sonner";
import { SidebarProvider } from "../(dashboard)/_components/sidebar/sidebar-context";
import { DashboardShell } from "../(dashboard)/_components/sidebar/dashboard-shell";
import Loading from "@/components/loading";

const AdminLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname();
  const [status, setStatus] = useState("loading")

  async function checkUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        if (data.user) {
          setUser(data.user)
          if(process.env.NEXT_PUBLIC_CRACKDSA_AUTHORISED_USERS?.includes(String(data.user.email))){
            setStatus("done")
          }
          else{
            router.push("/")
          }
        }
        else {
          router.push("/")
          setUser(null)
        }
        setStatus("done")
      }
      else {
        console.error(error);
        toast.error('Error! Something went wrong.')
      }
    }
    catch {
      toast.error('Error! Something went wrong.')
    }
  }
  useEffect(() => {
    checkUser()
  }, [pathname])
  return (
   <>
   {status=="loading"?
   <>
   <Loading title="Authorizing"/>
   </>
   :
   <>
    <SidebarProvider>
      <DashboardShell>
        <div className="min-h-full">{children}</div>
      </DashboardShell>
    </SidebarProvider>
   </>
   }
   </>
  );
}

export default AdminLayout;