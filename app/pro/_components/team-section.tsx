/* eslint-disable @next/next/no-img-element */

import { LinkedInLogoIcon } from "@radix-ui/react-icons";

//pictures
import surajPic from "../../../public/pictures/suraj.jpeg"
import yashPic from "../../../public/pictures/yash.png"
import abhinavPic from "../../../public/pictures/abhinav.jpeg"
import amarPic from "../../../public/pictures/amar.jpeg"
import harshitPic from "../../../public/pictures/harshit.png"

//logos
import inducedAI from "../../../public/logos/inducedai.png"
import crackdsaLogo from "../../../public/logos/crackdsa.png"

import Image from "next/image";

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
                    <img className="w-28" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/800px-Google_2015_logo.svg.png" alt="logo" />
                    <img className="w-28" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/2560px-LinkedIn_Logo.svg.png" alt="logo" />
                    <img className="w-20 mb-2" src="https://upload.wikimedia.org/wikipedia/commons/1/18/Zeta_Services_logo.png" alt="logo" />
                    <img className="w-28 mt-2" src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="logo" />
                    <img className="w-28" src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png" alt="logo" />
                    <img className="w-28" src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="logo" />
                </div>
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="text-center items-center text-gray-500 dark:text-gray-400">
                        <Image className="mx-auto mb-4 w-36 h-36 rounded-full"
                            src={abhinavPic}
                            alt="Picture" />
                        <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Abhinav Awasthi
                        </h3>
                        <p className="flex justify-center items-center">
                            SDE I. @
                            <img className="object-contain w-12 ml-2" 
                            alt="zeta"
                                src="https://upload.wikimedia.org/wikipedia/commons/1/18/Zeta_Services_logo.png" />
                        </p>
                        <p className="flex mt-1 justify-center items-center">
                            Former SDE I. @
                            <img className="object-contain w-16 ml-2" 
                            alt="linkedin" 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/2560px-LinkedIn_Logo.svg.png" />
                        </p>
                        <p className="flex mt-2 text-sm justify-center items-center">
                            Worked with-
                        </p>
                        <p className="flex justify-center items-center">
                            <img className="object-contain w-28 ml-2" alt="gfg" src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210420155809/gfg-new-logo.png" />
                            <img className="object-contain w-28 ml-2" alt="ns" src="https://assets-global.website-files.com/62e8d2ea218fb7676b6892a6/64df4847c57fbbefc3975c51_NS%20Primary%20wo_o%20button.png" />
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
                        <Image className="mx-auto mb-4 w-36 h-36 rounded-full"
                            src={amarPic}
                            alt="Picture" />
                        <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Amar Budhiraja
                        </h3>
                        <p className="flex justify-center items-center">
                            Upcoming SWE @
                            <img className="object-contain w-16 ml-2" alt="google"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/800px-Google_2015_logo.svg.png" />
                        </p>
                        <p className="flex mt-1 justify-center items-center">
                            Former SWE Intern @
                            <img className="object-contain w-14 ml-2" alt="google"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/800px-Google_2015_logo.svg.png" />
                        </p>
                        <p className="flex mt-2 text-sm justify-center items-center">
                            Worked with-
                        </p>
                        <p className="flex my-1 justify-center items-center">
                            <img className="object-contain w-28 ml-2" alt="scaler" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh7J9IbIUcnll0LOu28lo6Btn4NHm_MqPuheZ_fsmC&s" />
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
                        <Image className="mx-auto mb-4 w-36 h-36 rounded-full"
                            src={harshitPic}
                            alt="Picture" />
                        <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Harshit Varshney
                        </h3>
                        <p className="flex justify-center items-center">
                            Software Engineer @
                            <img className="object-contain mt-1 w-16 ml-2" alt="amazon"
                                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                            />
                        </p>
                        <p className="flex mt-1 justify-center items-center">
                            Former SDE @
                            <img className="object-contain w-14 ml-2" alt="airtel" 
                            src="https://1000logos.net/wp-content/uploads/2023/06/Airtel-logo.png" />
                        </p>
                        <p className="flex mt-2 text-sm justify-center items-center">
                            Worked with-
                        </p>
                        <p className="flex justify-center items-center">
                            <img className="object-contain w-24 ml-2" 
                            alt="placewit" 
                            src="https://placewit.com/images/headerlogo.png" />
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
                    <div className="text-center items-center text-gray-500 dark:text-gray-400">
                        <Image className="mx-auto mb-4 w-36 h-36 rounded-full"
                            src={surajPic}
                            alt="Picture" />
                        <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Suraj Gaud
                        </h3>
                        <p className="flex justify-center items-center">
                            Software Engineer @
                            <Image className="object-contain w-20 ml-2" alt="induced"
                                src={inducedAI} />
                        </p>
                        <p className="flex mt-1 justify-center items-center">
                            Former SDE I. @
                            <img
                                className="object-contain w-20 ml-2"
                                alt="nucast"
                                src="https://assets-global.website-files.com/63cfe51d18dd3900571106e2/63cfe51d18dd39821a11073b_nucast-wordmark.svg" />
                        </p>
                        <p className="flex mt-2 text-sm justify-center items-center">
                            Worked with-
                        </p>
                        <p className="flex mt-1 mb-1 justify-center items-center">
                            <img className="object-contain w-24 ml-2" 
                            alt="codingspoon" 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66Sxhw6ZrFRADzjsMt-zxu0hPJktz0W43xQ&s" />
                            <Image className="object-contain w-24 ml-2" 
                            alt="crackdsa" 
                            src={crackdsaLogo} />
                        </p>
                        <p className="flex text-sm justify-center items-center">
                            Mentored more than 1000 students.
                        </p>
                        <p className="flex text-sm justify-center items-center">
                            Multi-award-winning Hackathons | Expertise in Web3 & AI | Worked with multiple remote startups and have great contribution in Open Source.
                        </p>
                        <ul className="flex justify-center mt-4 space-x-4">
                            <li>
                                <a href="https://www.linkedin.com/in/gaudsuraj/" target="_blank" className="text-[#0077B5] hover:text-gray-900 dark:hover:text-white">
                                    <LinkedInLogoIcon className="h-6 w-6" />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="text-center items-center text-gray-500 dark:text-gray-400">
                        <Image className="mx-auto mb-4 w-36 h-36 rounded-full"
                            src={yashPic}
                            alt="Picture" />
                        <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Yash Bhatia
                        </h3>
                        <p className="flex justify-center items-center">
                            Developer Intern @
                            <img className="object-contain w-16 ml-2" alt="abode"
                                src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png" />
                        </p>
                        <p className="flex mt-2 text-sm justify-center items-center">
                            Worked with-
                        </p>
                        <p className="flex mt-1 mb-1 justify-center items-center">
                            <img className="object-contain w-24 ml-2" alt="codingninjas" 
                            src="https://www.codingninjas.com/careercamp/wp-content/uploads/2022/06/logo-05.png" />
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
                </div>
            </div>
        </section>
    )
}