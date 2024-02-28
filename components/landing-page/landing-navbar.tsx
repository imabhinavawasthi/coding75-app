'use client';

import { Logo } from '@/app/(dashboard)/_components/components/logo';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookMarked, LogIn, LogOut, User } from 'lucide-react';
import supabase from '@/supabase';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils';

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

const LandingPageNavbar = () => {
    const [user, setUser] = useState<any>(null)
    const [status, setStatus] = useState("loading")

    const NavMenuCSS = 'disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:bg-transparent'

    async function handleLogOut(e: any) {
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
        <div>
            <div className="mt-2 relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="md:flex md:items-center md:gap-12">
                            <Logo />
                        </div>

                        <div className="hidden z-40 md:block">
                            <NavigationMenu className='z-10 relative'>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className={NavMenuCSS}>Components</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="ul-no-list-style grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                                {components.map((component) => (
                                                    <ListItem
                                                        className='ol-no-list-style'
                                                        key={component.title}
                                                        title={component.title}
                                                        href={component.href}
                                                    >
                                                        {component.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className={NavMenuCSS}>Components</NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="ul-no-list-style grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                                {components.map((component) => (
                                                    <ListItem
                                                        className='ol-no-list-style'
                                                        key={component.title}
                                                        title={component.title}
                                                        href={component.href}
                                                    >
                                                        {component.description}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="sm:flex sm:gap-4">

                                {
                                    status == "loading" ?
                                        <>
                                            <Skeleton className='h-12 w-12 rounded-full' />
                                        </>
                                        :
                                        <>
                                            {
                                                user == null ?
                                                    <>
                                                        <Link
                                                            className="flex justify-center items-center rounded-md bg-primary-700 hover:bg-primary-800 px-5 py-2.5 text-sm font-medium text-white shadow"
                                                            href="/login"
                                                        >
                                                            <LogIn className='h-4 w-4 mr-2' /> Login
                                                        </Link>
                                                    </>
                                                    :
                                                    <>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Avatar>
                                                                    <AvatarImage src={user?.["user_metadata"]["picture"]} />
                                                                    <AvatarFallback><User /></AvatarFallback>
                                                                </Avatar>
                                                            </DropdownMenuTrigger>
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
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default LandingPageNavbar;

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"