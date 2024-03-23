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
import { Logo } from "../components/logo";

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


export const NavbarRoutes = ({ isLogo = false }: any) => {
  const [notificationOpen, setNotificationOpen] = useState(false)
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
        isLogo &&
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
                <a href={linkedin_link} target="_blank">
                  <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="#0a66c2" d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4c-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186zM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009c-.002-12.157 9.851-22.014 22.008-22.016c12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97zM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" /></svg>
                </a>
              </div>
            </DropdownMenu>

          </div>
          <div className="mr-5">
            <DropdownMenu>
              <div className="relative">
                <a href={telegram_link} target="_blank">
                  <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><defs><linearGradient id="logosTelegram0" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stop-color="#2aabee" /><stop offset="100%" stop-color="#229ed9" /></linearGradient></defs><path fill="url(#logosTelegram0)" d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51c0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0" /><path fill="#fff" d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152c35.56-14.786 42.94-17.354 47.76-17.441c1.06-.017 3.42.245 4.96 1.49c1.28 1.05 1.64 2.47 1.82 3.467c.16.996.38 3.266.2 5.038c-1.92 20.24-10.26 69.356-14.5 92.026c-1.78 9.592-5.32 12.808-8.74 13.122c-7.44.684-13.08-4.912-20.28-9.63c-11.26-7.386-17.62-11.982-28.56-19.188c-12.64-8.328-4.44-12.906 2.76-20.386c1.88-1.958 34.64-31.748 35.26-34.45c.08-.338.16-1.598-.6-2.262c-.74-.666-1.84-.438-2.64-.258c-1.14.256-19.12 12.152-54 35.686c-5.1 3.508-9.72 5.218-13.88 5.128c-4.56-.098-13.36-2.584-19.9-4.708c-8-2.606-14.38-3.984-13.82-8.41c.28-2.304 3.46-4.662 9.52-7.072" /></svg>
                </a>
              </div>
            </DropdownMenu>
          </div>
          <div className="mr-5">
            <DropdownMenu>
              <div className="relative">
                <a href={youtube_link} target="_blank">
                  <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" width="1.43em" height="1em" viewBox="0 0 256 180"><path fill="#f00" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134" /><path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z" /></svg>
                </a>
              </div>
            </DropdownMenu>
          </div>
        </div>
        <div className="mr-5">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => {
                e.preventDefault()
                setNotificationOpen(true)
              }} asChild>
              <div className="relative rounded-full inline-flex w-fit">
                {
                  notificationOpen == false &&
                  <div
                    className="absolute bottom-auto left-auto right-0 top-0 z-10 inline-block rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 rounded-full bg-red-600 p-1.5 text-xs"></div>
                }

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
                    <Button variant="outline" className="md:bg-primary-700 md:rounded-lg md:hover:bg-primary-800 px-4 py-1.5 text-md rounded-full md:text-white md:hover:text-white">
                      <LogIn className="w-4 h-4" /> <span className="hidden ml-2 md:block">Login</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="items-center text-center">
                      <DialogDescription>
                        <div className="items-center justify-center flex">
                          <div className="px-6 sm:px-0 max-w-sm">
                            <div className="max-w-xl mb-5 lg:max-w-3xl">
                              <div className="block text-blue-600">
                                <Logo width={150} height={40} />
                              </div>

                              <h1 className="mt-6 font-bold text-gray-900 text-lg md:text-2xl">
                                Welcome to coding75 🚀
                              </h1>

                              <p className="mt-4 leading-relaxed text-gray-500">
                                Login to explore amazing coding resources, build your ATS friendly resume, explore internships and much more...
                              </p>
                            </div>
                            <button
                              onClick={handleLogIn}
                              type="button" className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2"><svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                              </svg>Sign up with Google<div></div>
                            </button>
                          </div>
                        </div>
                        <p className="mt-5 text-center text-sm text-gray-500">
                          By creating an account, you agree to our &nbsp;
                          <a href="https://crackdsa.com/terms/" target="_blank" className="text-gray-700 underline"> terms and conditions </a>
                          and &nbsp;
                          <a href="https://crackdsa.com/privacy/" target="_blank" className="text-gray-700 underline">privacy policy</a>.
                        </p>
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