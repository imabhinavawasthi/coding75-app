"use client"

import { useEffect } from "react";
import LandingPage from "../../components/landing-page/landing-page";
import supabase from "@/supabase";
import { useRouter } from 'next/navigation'

const Home = () => {
  const router = useRouter()
  async function checkUser() {
    try {
        const {data,error} = await supabase.auth.getUser();
        if (data) {
            console.log(data);
        }
        else{
            console.error(error);
        }
    }
    catch {

    }
}

useEffect(() => {
    checkUser()
    const loggedin_route = localStorage.getItem('loggedin_route');
    if(loggedin_route&&loggedin_route!=""){
      localStorage.setItem('loggedin_route',"")
      router.push(loggedin_route)
    }
}, [])
  return ( 
    <div>
      <LandingPage/>
    </div>
   );
}
 
export default Home;