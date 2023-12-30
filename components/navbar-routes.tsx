"use client";

import Image from "next/image";


export const NavbarRoutes = () => {

  return (
    <>
      <div className="flex justify-center gap-x-2 mr-5 md:hidden lg:hidden">
      <a className="mr-5">
        <Image
          height={120}
          width={120}
          alt="logo"
          src="/logo-bg.png"
        />
      </a>
    </div>
    <div className="lg:flex md:flex hidden justify-end gap-x-2 ml-auto mr-5">
      <a className="font-bold text-gray-900" href="https://telegram.me/cpabhinav" target="_blank">
        Join Us 🚀
      </a>
    </div>
    </>
  )
}