"use client"

import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Separator } from "../ui/separator";

const PageHeadersButton = ({ greenHeading = "", heading = "", description = "", pdf_link = "" }) => {
    function getCurrentURL() {
        return window.location.href
    }
    function copyurl() {
        const url = getCurrentURL()
        navigator.clipboard.writeText(url);
        toast.info("Link copied to clipboard!")
    }
    function download_file(fileURL: any) {
        var link = document.createElement('a');
        link.href = fileURL;
        link.target = "_blank";
        link.download = `${heading} ${greenHeading} coding75.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    return (
        <div>
            <section className="bg-white dark:bg-gray-900 mt-5">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <div>
                        <h2 className="mb-4 text-4xl text-center tracking-tight font-extrabold text-gray-900 dark:text-white">{heading} <span style={{ color: "#27ae60" }}>{greenHeading}</span></h2>
                        <p className="mb-8 text-center font-light text-gray-500 sm:text-xl dark:text-gray-400">{description}</p>
                        <div className="md:flex justify-center items-center md:flex-row">
                            <button onClick={copyurl} className="w-full shadow-2xl inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                            </button>
                            {
                                pdf_link == "" ?
                                    <>
                                        <div className='w-full hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                                            <Link href="/pro" className="w-full bg-white inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                                Coding75 Pro <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                            </Link>
                                        </div>
                                    </> :
                                    <div className='w-full hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                                        <button onClick={() => { download_file(pdf_link) }} className="w-full bg-white inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                            Download PDF Notes <Download className="ml-2 -mr-1 w-5 h-5" />
                                        </button>
                                    </div>
                            }

                        </div>
                    </div>
                    <Separator className="mt-5 mb-5" />
                </div>
            </section>

        </div>
    );
}

export default PageHeadersButton;