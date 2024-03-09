"use client"

import { useEffect, useState } from "react";
import supabase from "@/supabase";
import { useRouter } from 'next/navigation'
import Link from "next/link";

const Admin = () => {
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
      <div>
      <section className="bg-white dark:bg-gray-900 mt-5">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <div>
                        <h2 className="mb-4 text-4xl text-center tracking-tight font-extrabold text-gray-900 dark:text-white">Admin <span style={{ color: "#27ae60" }}>Portal</span></h2>
                        <p className="mb-8 text-center font-light text-gray-500 sm:text-xl dark:text-gray-400">Add Resources, Projects, Opportunities, Problems etc.</p>
                    </div>
                </div>
            </section>
      </div>
    </>


  );
}

export default Admin;