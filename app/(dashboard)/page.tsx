"use client"

import { useEffect, useState } from "react";
import LandingPage from "../../components/landing-page/landing-page";
import supabase from "@/supabase";
import { useRouter } from 'next/navigation'
import { Loader2 } from "lucide-react";
import { Logo } from "./_components/components/logo";

const Home = () => {
  const router = useRouter()
  const [newLogin, setNewLogin] = useState(true)
  async function checkUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        console.log(data);
      }
      else {
        console.error(error);
      }
    }
    catch {

    }
  }
  useEffect(() => {
    checkUser()
    const loggedin_route = localStorage.getItem('loggedin_route');
    if (loggedin_route && loggedin_route != "") {
      localStorage.setItem('loggedin_route', "")
      router.push(loggedin_route)
    }
    else{
      setNewLogin(false)
    }
  }, [])
  return (
    <>
      {newLogin ?
        <>
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse">
              <Logo width={300} height={300}/>
            </div>
          </div>
        </> : <>
          <div>
            <LandingPage />
          </div>
        </>}
    </>


  );
}

export default Home;