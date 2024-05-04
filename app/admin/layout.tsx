"use client"

import Footer from "@/components/footer";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import supabase from "@/supabase";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { Sidebar } from "../(dashboard)/_components/sidebar/sidebar";
import { Navbar } from "../(dashboard)/_components/sidebar/navbar";

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
    <div className="h-full bg-white">
      <div className="h-[70px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">
        <div className="min-h-full ">
          {children}
        </div>
        <footer>
          <Footer />
        </footer>
      </main>

    </div>
   </>
   }
   </>
  );
}

export default AdminLayout;