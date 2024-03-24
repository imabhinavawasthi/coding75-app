"use client"

import Footer from "@/components/footer";
import AdminNavbar from "./_components/admin-navbar";
import SideTabs from "./_components/side-tabs";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import supabase from "@/supabase";
import { toast } from "sonner";
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
          console.log(data.user.email);
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
      <AdminNavbar user={user?.email} />
      <div className="min-h-full mt-5">
        <div className="container grid gap-x-5 grid-cols-5">
          <div className="">
            <SideTabs />
          </div>
          <div className="col-span-4">
            {children}
          </div>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
   </>
   }
   </>
  );
}

export default AdminLayout;