"use client"

import Footer from "@/components/footer";
import { Navbar } from "../(dashboard)/_components/sidebar/navbar";
import { Sidebar } from "../(dashboard)/_components/sidebar/sidebar";
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
    <div className="h-full bg-white">
      <div className="h-[70px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">
        <div className="min-h-full ">
          {
            status == "done" &&
            <>
              {children}
            </>
          }
          {
            status == "error" &&
            <div className="mt-20">
              <ErrorBanner />
            </div>
          }
          {
            status == "loading" &&
            <div className="mt-20 animate-ping flex items-center justify-center">
              <Logo />
            </div>
          }
        </div>
        <footer>
          <Footer />
        </footer>
      </main>
    </div>
  );
}

export default ClassroomLayout;