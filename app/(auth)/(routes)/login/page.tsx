"use client"

import { Button } from "@/components/ui/button";
import supabase from "@/supabase";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import Link from "next/link";

const LogIn = () => {
    const router = useRouter()
    async function checkUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (data) {
                console.log(data.user);
                if (data.user)
                    router.push('/')
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

    }, [])

    async function handleLogIn(e: any) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                }
            },
            )
        }
        catch {

        }
    }
    return (
        <div>
            {/*
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
*/}

            <section className="bg-white">
                <div className="lg:grid lg:min-h-screen lg:grid-cols-2 grid-cols-1">
                    <section className="relative flex h-32 items-end bg-gray-900 lg:h-full">
                        <img
                            alt=""
                            src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/login.jpg"
                            className="absolute inset-0 h-full w-full object-cover opacity-80"
                        />

                        <div className="bg-[#4285F4]/80 hidden lg:relative lg:block lg:p-12">
                            <Link className="block text-white" href="/">
                                <Logo white={true} width={200} height={40} />
                            </Link>

                            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                                Welcome to coding75 🚀
                            </h2>

                            <p className="mt-4 leading-relaxed text-white/90">
                                Login to explore amazing coding resources, build your ATS friendly resume, explore internships and much more...
                            </p>
                        </div>
                    </section>
                    <section className="lg:px-20 px-5 min-h-screen flex items-center justify-center">
                        <div>
                            <div className="items-center justify-center flex">
                                <div className="px-6 sm:px-0">
                                    <div className="mb-5">
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
                        </div>
                    </section>
                </div>
            </section>
        </div>
    );
}

export default LogIn;