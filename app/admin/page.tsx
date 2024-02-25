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
        <Link href="/admin/opportunity">
        Add Opportunity</Link>
        <Link href="/admin/projects">
        Add Projects</Link>
        <Link href="/admin/problems">
        Add Problems</Link>
        <Link href="/admin/leetcode-potd">
        Add Leetcode POTD</Link>
      </div>
    </>


  );
}

export default Admin;