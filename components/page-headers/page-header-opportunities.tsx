import { Share2 } from "lucide-react";
import Image from "next/image";
import Typewriter from 'typewriter-effect';
import { toast } from "sonner";
import Link from "next/link";
import { AmazonLogo, AtlassianLogo, GoogleLogo, LinkedinLogo, MicrosoftLogo, SwiggyLogo } from "../social-links";

const PageHeaderCompanyList = ({ focusHeading = "", heading = "", description = "" }) => {
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
            <header className="bg-web px-5">
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="mr-auto place-self-center lg:col-span-7">
                            <h2 className="mb-10 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
                                <Typewriter
                                    options={{
                                        strings: [
                                            '<strong>Explore <span style="color: #27ae60;">Opportunities</span>.</strong>',
                                            '<strong> Explore <span style="color: #27ae60;">Internships</span>.</strong>',
                                            '<strong> Explore <span style="color: #27ae60;">Jobs</span>.</strong>',
                                        ],
                                        autoStart: true,
                                        loop: true,
                                    }}
                                /></h2>
                            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Stay ahead in your coding career by exploring the vast array of opportunities presented by Coding75 and propel yourself into the forefront of the tech industry.</p>
                            <div className="flex flex-row items-center">
                                <button onClick={copyurl} className="shadow-2xl inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </button>
                                <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                                    <Link href="/pro" className=" bg-white inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                        Coding75 Pro <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="lg:ml-20 hidden md:ml-10 md:mr-10 lg:mr-20 ml-5 mr-5 mt-10 md:flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
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