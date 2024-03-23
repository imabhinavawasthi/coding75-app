/* eslint-disable @next/next/no-img-element */

import { LinkedInLogoIcon } from "@radix-ui/react-icons";

export default function TeamSection() {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="pt-8 px-4 mx-auto max-w-screen-xl text-center lg:pt-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm lg:mb-8">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Meet Your Mentors</h2>
                    <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        Our team comprises people from leading companies and great expertise, ready to help you for your preparation 🚀
                    </p>
                </div>
                <div className="lg:px-48 pl-5 md:mt-0 mt-10 items-center mb-10  grid gap-x-4 grid-cols-2 gap-y-2 md:grid-cols-6">
                    <img className="w-28" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/google.png" alt="logo"/>
                    <img className="w-28" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/linkedin.png" alt="logo"/>
                    <img className="w-20 mb-2" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/zeta.png" alt="logo"/>
                    <img className="w-28 mt-2" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/amazon.png" alt="logo"/>
                    <img className="w-28" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/adobe.png" alt="logo"/>
                    <img className="w-28" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/microsoft.png" alt="logo"/>
                </div>
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="text-center items-center text-gray-500 dark:text-gray-400">
                        <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                            src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/abhinav.jpeg"
                            alt="Picture" />
                        <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Abhinav Awasthi
                        </h3>
                        <p className="flex justify-center items-center">
                            SDE I. @
                            <img className="object-contain w-12 ml-2" alt="zeta"
                                src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/zeta.png" />
                        </p>
                        <p className="flex mt-1 justify-center items-center">
                            Former SDE I. @
                            <img className="object-contain w-16 ml-2" alt="linkedin" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/linkedin.png" />
                        </p>
                        <p className="flex mt-2 text-sm justify-center items-center">
                            Worked with-
                        </p>
                        <p className="flex justify-center items-center">
                            <img className="object-contain w-28 ml-2" alt="gfg" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/gfg.png" />
                            <img className="object-contain w-28 ml-2" alt="ns" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/ns.png" />
                        </p>
                        <p className="flex text-sm justify-center items-center">
                            Mentored more than 5000 students.
                        </p>
                        <p className="flex text-sm justify-center items-center">
                            ICPC Regionalist (AIR-57) | 5* on Codechef |
                            Expert on Codeforces | Winner Linkedin Hackday |
                            11K+ Youtube | 45K+ Linkedin | 25K+ Telegram Students Community
                        </p>
                        <ul className="flex justify-center mt-4 space-x-4">
                            <li>
                                <a href="https://www.linkedin.com/in/abhinavawasthi01/" target="_blank" className="text-[#0077B5] hover:text-gray-900 dark:hover:text-white">
                                    <LinkedInLogoIcon className="h-6 w-6" />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="text-center items-center text-gray-500 dark:text-gray-400">
                        <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                            src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/amar.jpeg"
                            alt="Picture" />
                        <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Amar Budhiraja
                        </h3>
                        <p className="flex justify-center items-center">
                            Upcoming SWE @
                            <img className="object-contain w-16 ml-2" alt="google"
                                src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/google.png" />
                        </p>
                        <p className="flex mt-1 justify-center items-center">
                            Former SWE Intern @
                            <img className="object-contain w-14 ml-2" alt="google"
                                src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/google.png" />
                        </p>
                        <p className="flex mt-2 text-sm justify-center items-center">
                            Worked with-
                        </p>
                        <p className="flex justify-center items-center">
                            <img className="object-contain w-28 ml-2" alt="gfg" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/scaler.png" />
                        </p>
                        <p className="flex text-sm justify-center items-center">
                            Mentored more than 1000 students.
                        </p>
                        <p className="flex text-sm justify-center items-center">
                            ACM ICPC 2023 Regionalist |
                            Upcoming SWE Google&apos;24 | SWE intern  Google&apos;23
                        </p>
                        <ul className="flex justify-center mt-4 space-x-4">
                            <li>
                                <a href="https://www.linkedin.com/in/amar-budhiraja-901450203/" target="_blank" className="text-[#0077B5] hover:text-gray-900 dark:hover:text-white">
                                    <LinkedInLogoIcon className="h-6 w-6" />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="text-center items-center text-gray-500 dark:text-gray-400">
                        <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                            src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/harshit.png"
                            alt="Picture" />
                        <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Harshit Varshney
                        </h3>
                        <p className="flex justify-center items-center">
                            Software Engineer @
                            <img className="object-contain mt-1 w-16 ml-2" alt="amazon"
                                src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/amazon.png"
                            />
                        </p>
                        <p className="flex mt-1 justify-center items-center">
                            Former SDE @
                            <img className="object-contain w-14 ml-2" alt="airtel" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/airtel.png" />
                        </p>
                        <p className="flex mt-2 text-sm justify-center items-center">
                            Worked with-
                        </p>
                        <p className="flex justify-center items-center">
                            <img className="object-contain w-24 ml-2" alt="placewit" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/placewit.png" />
                        </p>
                        <p className="flex text-sm justify-center items-center">
                            Mentored more than 2000 students.
                        </p>
                        <p className="flex text-sm justify-center items-center">
                            1945 on Codechef | 33K+ Linkedin | Software Engineer at Amazon | Former Software Engineer and Intern at Airtel
                        </p>
                        <ul className="flex justify-center mt-4 space-x-4">
                            <li>
                                <a href="https://www.linkedin.com/in/harshit-theguy/" target="_blank" className="text-[#0077B5] hover:text-gray-900 dark:hover:text-white">
                                    <LinkedInLogoIcon className="h-6 w-6" />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div></div>
                    <div className="text-center items-center text-gray-500 dark:text-gray-400">
                        <img className="mx-auto mb-4 w-36 h-36 rounded-full"
                            src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/yash-2.png"
                            alt="Picture" />
                        <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Yash Bhatia
                        </h3>
                        <p className="flex justify-center items-center">
                            Developer Intern @
                            <img className="object-contain w-16 ml-2" alt="abode"
                                src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/adobe.png" />
                        </p>
                        <p className="flex mt-2 text-sm justify-center items-center">
                            Worked with-
                        </p>
                        <p className="flex mt-1 mb-1 justify-center items-center">
                            <img className="object-contain w-36 ml-2" alt="gfg" src="https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/pictures/codingninjas.png" />
                        </p>
                        <p className="flex text-sm justify-center items-center">
                            Mentored more than 500 students.
                        </p>
                        <p className="flex text-sm justify-center items-center">
                            5* on Codechef | Worked as Developer Intern at Adobe | Campus Mentor at Coding Ninjas
                        </p>
                        <ul className="flex justify-center mt-4 space-x-4">
                            <li>
                                <a href="https://www.linkedin.com/in/yash-bhatia-484341210/" target="_blank" className="text-[#0077B5] hover:text-gray-900 dark:hover:text-white">
                                    <LinkedInLogoIcon className="h-6 w-6" />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div></div>
                </div>
            </div>
        </section>
    )
}