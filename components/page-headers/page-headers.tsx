'use client'

import { Share2Icon, User2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Link from "next/link";
import Feature from "../../app/(dashboard)/_components/img/feature2.png"

const PageHeaders = ({ heading = "", description = "", icon=Feature }) => {
    function getCurrentURL() {
        return window.location.href
    }
    function copyurl() {
        const url = getCurrentURL()
        navigator.clipboard.writeText(url);
        toast.info("Link Copied to Clipboard")
    }
    return (
        <div>
            <header className="bg-web px-5">
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="text-center sm:text-left">
                            <p className="mb-3 lg:text-6xl md:text-6xl text-4xl font-extrabold text-blue-800">{heading}</p>
                            <p className="mb-10 text-md font-normal text-gray-500 lg:text-lg dark:text-gray-400">{description}</p>
                            <div className="lg:flex mx:flex gap-x-4">
                                <div>
                                    <div>
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            className="rounded-lg w-full mb-4 md:mb-4 lg:mb-0 border border-gray-600 "
                                            onClick={copyurl}
                                        >
                                            <Share2Icon className="h-4 w-4 mr-2" /> Share

                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    className="bg-blue-800 hover:bg-blue-900 rounded-lg mb-4 md:mb-4 lg:mb-0 w-full shadow-lg hover:shadow-none shadow-gray-600"
                                >
                                    <Link
                                        className="flex justify-center items-center gap-x-2"
                                        type="button"
                                        href="/community"
                                    >
                                        <User2 />Join Community
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="lg:ml-20 md:ml-10 md:mr-10 lg:mr-20 ml-5 mr-5 mt-5 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                            {icon &&
                                <Image
                                    width={700}
                                    height={700}
                                    src={icon}
                                    alt="projects"
                                />
                            }
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default PageHeaders;