'use client'

import { CheckIcon, Share2Icon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const PageHeaders = ({ heading, description }) => {
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
            <header className="bg-web">
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {heading}
                            </h1>

                            <p className="mt-1.5 text-sm text-gray-500">
                                {description}
                            </p>
                        </div>

                        <div className="lg:ml-2 mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                            {isCopied ? <div>
                                <button
                                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-5 py-3 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring"
                                    type="button"
                                    onClick={copyurl}
                                >
                                    <span className="text-sm font-medium">Copied</span>

                                    <CheckIcon className="h-4 w-4" />
                                </button>
                            </div>
                                :
                                <div>
                                    <button
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-5 py-3 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring"
                                        type="button"
                                        onClick={copyurl}
                                    >
                                        <span className="text-sm font-medium">Share</span>

                                        <Share2Icon className="h-4 w-4" />
                                    </button>
                                </div>
                            }


                            <a
                                className="block text-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                                type="button"
                                href="/community"
                            >
                                Join&nbsp;Community&nbsp;👨🏻‍💻
                            </a>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default PageHeaders;