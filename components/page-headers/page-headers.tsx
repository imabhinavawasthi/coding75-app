"use client"

import { Share2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Feature from "../../app/(dashboard)/_components/img/opportunity-feature.png"
import Link from "next/link";

const PageHeaders = ({ greenHeading = "", heading = "", description = "" }) => {
    function getCurrentURL() {
        return window.location.href
    }
    function copyurl() {
        const url = getCurrentURL()
        navigator.clipboard.writeText(url);
        toast.info("Link copied to clipboard!")
    }
    return (
        <div>
            <header className="bg-web px-5 py-8">
                <div className="grid lg:grid-cols-12 md:grid-cols-12 grid-cols-1 lg:px-10 lg:py-10 md:px-10 md:py-8 px-5">
                    <div className="col-span-8 mr-auto place-self-center mb-16 lg:mb-0 md:mb-0 lg:mr-5 md:mr-5">
                        <h2 className="mb-10 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                            <strong>{heading} <span style={{ color: "#27ae60" }}>{greenHeading}</span>.</strong></h2>
                        <p className="mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">{description}</p>
                        <div className="flex flex-row items-center">
                            <button onClick={copyurl} className="shadow-2xl inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </button>
                            <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                                <Link href="/community" className=" bg-white inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                    Exclusive Community <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Image src={Feature} alt="opportunity-feature" className="col-span-4 shadow-2xl rounded-xl w-full" />
                </div>
            </header>
        </div>
    );
}

export default PageHeaders;