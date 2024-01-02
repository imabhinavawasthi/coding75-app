"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
        <a className="font-bold text-gray-900" href="https://telegram.me/cpabhinav" target="_blank">
          Join Us 🚀
        </a>
      </div>
    </>
  )
}