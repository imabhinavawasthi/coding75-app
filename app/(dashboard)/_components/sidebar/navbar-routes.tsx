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
} from "@/components/ui/navigation-menu"
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import supabase from "@/supabase";
import { Bell, LogIn, LogOut, MessageSquarePlusIcon, RotateCw, Send, User, YoutubeIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { feedback_form, linkedin_link, telegram_link, youtube_link } from "@/components/social-links";
import { Skeleton } from "@/components/ui/skeleton";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "CS Fundamentals",
    href: "/cs-fundamentals",
    description:
      "Operating Systems, Computer Networks, Database Management Systems, and Object-Oriented Programming Interview Specific Resources.",
  },
  {
    title: "Resume Builder",
    href: "/resume",
    description:
      "Create an ATS Friendly Latex Resume 🚀",
  },
  {
    title: "System Design",
    href: "/system-design",
    description:
      "Important System Design Topics for Interviews.",
  },
  {
    title: "Interview Preparation Guide",
    href: "/interview-preparation/guide",
    description: "Amazing Guide for Interview Preparation 🎯.",
  },
]

const dsa: { title: string; href: string; description: string }[] = [
  {
    title: "Leetcode Daily Problem",
    href: "/dsa-cp/leetcode-potd",
    description:
      "In-depth LeetCode POTD editorials for efficient problem-solving.",
  },
  {
    title: "Codeforces Editorials",
    href: "/dsa-cp/codeforces",
    description:
      "In-depth Codeforces editorials for efficient problem-solving.",
  },
  {
    title: "CodeChef Editorials",
    href: "/dsa-cp/codechef",
    description:
      "In-depth Codechef editorials for efficient problem-solving.",
  },
  {
    title: "DSA Placement Sheet",
    href: "/dsa-cp/interview-sheet",
    description: "Amazing DSA Placement Sheet for Interview Preparation.",
  },
]

const projects: { title: string; href: string; description: string }[] = [
  {
    title: "Basic Frontend Projects",
    href: "/projects/basicfrontend",
    description:
      "Frontend Projects for Beginners with HTML, CSS and Javascript.",
  },
  {
    title: "ReactJS Projects",
    href: "/projects/reactjs",
    description:
      "Build interactive and responsive user interfaces using the powerful React library.",
  },
  {
    title: "Next.js Projects",
    href: "/projects/nextjs",
    description:
      "Server-side rendering, code splitting, and simplified routing for efficient web applications.",
  },
  {
    title: "MERN Stack Projects",
    href: "/projects/mern",
    description: "Create dynamic full-stack web applications with MongoDB, Express, React, and Node.js.",
  },
  {
    title: "Flutter Projects",
    href: "/projects/flutter",
    description:
      "Craft beautiful and responsive cross-platform mobile applications with Flutter.",
  },
  {
    title: "Machine Learning Projects",
    href: "/projects/ml",
    description: "Explore real-world applications, diverse algorithms, and hands-on experiences to master the art of AI.",
  },
]


export const NavbarRoutes = ({isLogo=false}:any) => {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname();
  const [status, setStatus] = useState("loading")

  async function handleLogOut(e: any) {
    e.preventDefault()
    toast.info('Logging you out...')
    try {
      let { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Error! Something went wrong.')
      }
      else {
        checkUser()
        toast.info('You are Logged Out!')
        location.reload()
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
      {
        isLogo&&
        <div className="justify-start gap-x-2 ml-5 mr-5 hidden md:flex lg:flex">
        <div>
          <Link href="/">
            <Image
              height={150}
              width={150}
              alt="logo"
              src="/logo-bg.png"
            />
          </Link>
        </div>
      </div>
      }
      <div className="lg:flex md:flex hidden justify-center items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Coding Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/pro"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          coding75 Pro 🚀
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                        Learn from the Experts, Engage with Peers, Be a Pro! 🎯
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem description="Stay ahead in your coding career by exploring the vast array of opportunities." href="/opportunities" title="Internships 🎯" />
                  <ListItem description="Explore a diverse range of projects that span various domains, including web development, mobile app creation, machine learning, and more." href="/projects" title="Projects 👨🏻‍💻" />
                  <ListItem description="Empower your coding journey with a rich collection of Data Structures and Competitive Programming resources, thoughtfully assembled to guide coding enthusiasts of varying skill levels through their learning journey." href="/dsa-cp" title="Data Structures & Algorithms 🚀" />
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Interview Preparation</NavigationMenuTrigger>
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
            <NavigationMenuItem className="hidden lg:flex">
              <NavigationMenuTrigger>DSA & CP</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {dsa.map((component) => (
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
            <NavigationMenuItem className="hidden lg:flex">
              <NavigationMenuTrigger>Projects</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {projects.map((component) => (
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
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex justify-end items-center gap-x-2 ml-auto mr-5">
      <div className="hidden md:flex items-center">
      <div className="mr-5">
          <DropdownMenu>
              <div className="relative">
              <a href={linkedin_link} target="_blank"><LinkedInLogoIcon className="w-6 h-6 text-[#0077B5]"/></a>
              </div>
          </DropdownMenu>

        </div>
        <div className="mr-5">
          <DropdownMenu>
              <div className="relative">
              <a href={telegram_link} target="_blank"><Send className="w-6 h-6 text-[#0088cc]"/></a>
              </div>
          </DropdownMenu>
        </div>
        <div className="mr-5">
          <DropdownMenu>
              <div className="relative">
              <a href={youtube_link} target="_blank"><YoutubeIcon strokeWidth={1} className="w-7 h-7 text-red-600"/></a>
              </div>
          </DropdownMenu>
        </div>
      </div>
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
              <DropdownMenuItem className="cursor-pointer">Welcome to coding75!</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
        {status == "loading" ?
          <>
            <Skeleton className='h-12 w-12 rounded-full' />
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
                    <a href={feedback_form} target="_blank"><DropdownMenuItem className="cursor-pointer"><MessageSquarePlusIcon className="w-4 h-4 mr-2" /> Submit Feedback</DropdownMenuItem></a>
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