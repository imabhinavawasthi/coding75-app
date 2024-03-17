import { Logo } from "@/app/(dashboard)/_components/components/logo";
import Image from "next/image";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { linkedin_link, telegram_link, whatsapp_link, youtube_link } from "./social-links";

const Footer = () => {
    return (
        <div>
            <Separator className="mt-5 mb-5" />
            <footer className="p-4 bg-white sm:p-6 dark:bg-gray-800">
                <div className="mx-auto max-w-screen-xl">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <Link href="/" className="flex items-center">
                                <Logo />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-10 lg:space-x-16 sm:gap-6 sm:grid-cols-3">
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                                <ul className="text-gray-600 dark:text-gray-400">
                                    <li className="mb-2">
                                        <Link href="/dsa-cp" className="hover:underline">DSA & CP</Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link href="/opportunities" className="hover:underline">Opportunities</Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link href="/projects" className="hover:underline">Projects</Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link href="/interview-preparation" className="hover:underline">Interview Preparation</Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                                <ul className="text-gray-600 dark:text-gray-400">
                                    <li className="mb-4">
                                        <a href={linkedin_link} target="_blank" className="hover:underline ">Linkedin</a>
                                    </li>
                                    <li className="mb-4">
                                        <a href={youtube_link} target="_blank" className="hover:underline">Youtube</a>
                                    </li>
                                    <li>
                                        <a href={telegram_link} target="_blank" className="hover:underline">Telegram</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                                <ul className="text-gray-600 dark:text-gray-400">
                                    <li className="mb-4">
                                        <a target="_blank" href="https://crackdsa.com/privacy/" className="hover:underline">Privacy Policy</a>
                                    </li>
                                    <li className="mb-4">
                                        <a target="_blank" href="https://crackdsa.com/terms/" className="hover:underline">Terms &amp; Conditions</a>
                                    </li>
                                    <li >
                                        <a href={whatsapp_link} target="_blank" className="hover:underline">Contact Support</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="https://crackdsa.com" className="hover:underline">crackDSA™</a>. All Rights Reserved.
                        </span>
                        <div className="flex mt-4 font-semibold space-x-6 sm:justify-center sm:mt-0">
                            Made with ❤️ in Kanpur, India
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;