'use client'

import { CheckIcon, Share2Icon, User2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import GoogleLogo from "../../app/(dashboard)/_components/img/google.svg.png"
import LinkedinLogo from "../../app/(dashboard)/_components/img/linkedin.svg.png"
import AmazonLogo from "../../app/(dashboard)/_components/img/amazon.svg.png"
import AtlassianLogo from "../../app/(dashboard)/_components/img/atlassian.svg.png"
import MicrosoftLogo from "../../app/(dashboard)/_components/img/microsoft.svg.png"
import SwiggyLogo from "../../app/(dashboard)/_components/img/swiggy.svg.png"
import UnderlineText from "../underline-text";

const PageHeaderCompanyList = ({ focusHeading = "", heading = "", description = "" }) => {
    const [isCopied, setIsCopied] = useState(false)
    function getCurrentURL() {
        return window.location.href
    }
    function copyurl() {
        const url = getCurrentURL()
        setIsCopied(true)
        navigator.clipboard.writeText(url);
        setTimeout(() => {
            setIsCopied(false)
        }, 2000);
    }
    return (
        <div>
            <header className="bg-web px-5 py-8">
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="text-center sm:text-left">
                            <UnderlineText texts={['Opportunities', 'Jobs', 'Internships']} />
                            <h2 className="font-mono mb-4 mt-8 text-lg font-bold leading-none tracking-tight text-gray-900 md:text-xl lg:text-2xl dark:text-white">{heading} </h2>
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
                                            {isCopied ? <>
                                                <CheckIcon className="h-4 w-4 mr-2" /> Copied
                                            </> :
                                                <>
                                                    <Share2Icon className="h-4 w-4 mr-2" /> Share
                                                </>}

                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    variant="basic"
                                    className="rounded-lg mb-4 md:mb-4 lg:mb-0 w-full"
                                >
                                    <a
                                        className="flex justify-center items-center gap-x-2"
                                        type="button"
                                        href="/community"
                                    >
                                        <User2 />Join Community
                                    </a>
                                </Button>
                            </div>
                        </div>

                        <div className="lg:ml-20 md:ml-10 md:mr-10 lg:mr-20 ml-5 mr-5 mt-5 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                            <div className="grid grid-cols-2 gap-x-10 md:gap-x-20 lg:gap-x-20 gap-y-6">
                                <Image
                                    width={150}
                                    height={150}
                                    src={GoogleLogo}
                                    alt="google"
                                />
                                <Image
                                    width={150}
                                    height={150}
                                    src={LinkedinLogo}
                                    alt="linkedin"
                                />
                                <Image
                                    width={150}
                                    height={150}
                                    src={AtlassianLogo}
                                    alt="atlassian"
                                />
                                <Image
                                    width={150}
                                    height={150}
                                    src={SwiggyLogo}
                                    alt="swiggy"
                                />
                                <Image
                                    width={150}
                                    height={150}
                                    src={MicrosoftLogo}
                                    alt="microsoft"
                                />
                                <Image
                                    width={150}
                                    height={150}
                                    src={AmazonLogo}
                                    alt="amazon"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default PageHeaderCompanyList;