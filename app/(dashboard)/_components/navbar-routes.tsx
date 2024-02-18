"use client";

import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import supabase from "@/supabase";
import { Bell, BookMarked, ChevronDown, LogIn, LogOut, Megaphone, RotateCcw, RotateCw, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "../../../components/ui/badge";
import { FcGoogle } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "../../../components/ui/skeleton";
import { BellIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]


export const NavbarRoutes = () => {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname();
  const router = useRouter()
  const [status, setStatus] = useState("loading")

  async function handleLogOut(e) {
    e.preventDefault()
    try {
      let { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Error! Something went wrong.')
      }
      else {
        checkUser()
        toast.error('You are Logged Out!')
      }
    }
    catch {
      toast.error('Error! Something went wrong.')
    }
  }

  async function handleLogIn(e: any) {
    e.preventDefault();
    localStorage.setItem('loggedin_route', pathname)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      }
      )
      if (data) {
        checkUser()
        toast.success(`Welcome, ${data["user_metadata"]["full_name"]}`)
      }
      else {
        toast.error('Error! Something went wrong.')
      }
    }
    catch {

    }
  }


  async function checkUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        if (data.user) {
          setUser(data.user)
          console.log(data.user);
        }
        else {
          setUser(null)
        }
      }
      else {
        console.error(error);
        toast.error('Error! Something went wrong.')
      }
    }
    catch {
      toast.error('Error! Something went wrong.')
    }
    setStatus("done")
  }
  useEffect(() => {
    checkUser()
  }, [])

  return (
    <>
      <div className="flex justify-end gap-x-2 ml-auto mr-5 md:hidden lg:hidden">
        <div>
          <Link href="/">
            <Image
              height={120}
              width={120}
              alt="logo"
              src="/logo-bg.png"
            />
          </Link>
        </div>
      </div>
      <div className="lg:flex md:flex hidden justify-center items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          shadcn/ui
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Beautifully designed components built with Radix UI and
                          Tailwind CSS.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem description="Re-usable components built using Radix UI and Tailwind CSS." href="/projects" title="Introduction" />
                  <ListItem description="How to install dependencies and structure your app." href="/docs/installation" title="Installation" />
                  <ListItem description="Styles for headings, paragraphs, lists...etc" href="/docs/primitives/typography" title="Typography" />
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                      description={component.description}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex justify-end items-center gap-x-2 ml-auto mr-5">
        <div className="mr-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative rounded-full inline-flex w-fit">
                <div
                  className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 rounded-full bg-red-600 p-1.5 text-xs"></div>
                <div
                  className="cursor-pointer hover:shadow-none flex items-center justify-center rounded-full bg-primary-700 p-2 text-center text-white shadow-xl dark:text-gray-200">
                  <Bell className="h-5 w-5" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">No new notification!</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
        {status == "loading" ?
          <>
            <Button disabled className="bg-primary-700 hover:bg-primary-800 px-4 py-1.5 text-md rounded-lg text-white">
              <RotateCw className="animate-spin w-4 h-4 mr-2" /> Login
            </Button>
          </> :
          <>
            {user ?
              <>
                <DropdownMenu>
                  {/* className="border-2 lg:border-primary-600 bg-white cursor-pointer lg:hover:bg-gray-100 lg:pr-4 lg:pl-3 lg:py-1 lg:rounded-lg" */}
                  {/* <div className='lg:hover:animate-background lg:rounded-xl lg:bg-gradient-to-r lg:from-green-300 lg:via-blue-500 lg:to-purple-600 lg:p-0.5 lg:shadow-xl lg:transition lg:hover:bg-[length:400%_400%] lg:hover:shadow-sm lg:hover:[animation-duration:_4s]'> */}
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={user?.["user_metadata"]["picture"]} />
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                      {/* <div className="lg:flex flex-col hidden ml-3 text-left">
                          <p className="text-sm font-semibold text-gray-600 tracking-tight">
                            {user?.["user_metadata"]["full_name"]}
                          </p>
                          <p className="text-xs flex items-center"><User className="h-3 w-3 mr-1" /> Profile <ChevronDown className="h-3 w-3 ml-2" /></p>
                        </div> */}
                    </div>
                  </DropdownMenuTrigger>
                  {/* </div> */}
                  <DropdownMenuContent
                    align="end"
                  >
                    {/* <DropdownMenuLabel className="font-semibold"><Badge variant="basic" className="px-2 py-1">Hello, {user?.["user_metadata"]["full_name"]} 👋🏻</Badge></DropdownMenuLabel> */}
                    {/* <DropdownMenuSeparator /> */}
                    <Link href="/profile"><DropdownMenuItem className="cursor-pointer"><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem></Link>
                    <Link href="/profile/certificates"><DropdownMenuItem className="cursor-pointer"><BookMarked className="w-4 h-4 mr-2" /> Certificates</DropdownMenuItem></Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer text-red-600"><LogOut className="w-4 h-4 mr-2" /> Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
              : <>
                <Dialog>
                  <DialogTrigger className="flex justify-center items-center">
                    <Button className="bg-primary-700 hover:bg-primary-800 px-4 py-1.5 text-md rounded-lg text-white">
                      <LogIn className="w-4 h-4" /> <span className="hidden ml-2 md:block">Login</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="items-center text-center">
                      <DialogTitle className="mb-4 flex"><LogIn className="h-4 w-4 mr-2" /> Log In</DialogTitle>
                      <DialogDescription>
                        <div className="items-center justify-center flex">
                          <button
                            onClick={handleLogIn}
                            aria-label="Sign in with Google"
                            className="flex bg-blue-500 items-center border border-button-border-light rounded-full p-0.5 pr-4"
                          >
                            <div className="flex items-center justify-center bg-white w-12 h-12 rounded-full">
                              <FcGoogle className="h-8 w-8" />
                            </div>
                            <span className="ml-3 text-lg font-bold text-white tracking-wider">Sign in with Google</span>
                          </button>
                        </div>
                        <div className="mt-5 text-center">
                          Accept our Privacy Policy and Terms & Conditions
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

              </>
            }
          </>}
      </div>
    </>
  )
}

const ListItem = (({ title, href, description }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {description}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})