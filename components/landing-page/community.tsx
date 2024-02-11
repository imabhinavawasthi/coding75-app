import { Briefcase, Code, Rocket, ScrollText, Users } from "lucide-react";
import Link from "next/link";

const Community = () => {
    return (
        <div className="container">
            <section className="bg-white dark:bg-gray-900">
                <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 lg:py-16 lg:grid-cols-12 lg:gap-x-10">
                    <div className="mr-auto place-self-center lg:col-span-6">
                        <h1 className="mb-10 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Join our <span style={{ color: "#27ae60" }}>Exclusive Community</span>. </h1>
                        <p className="max-w-2xl lg:mb-20 text-gray-500 mb-10 md:text-lg lg:text-xl dark:text-gray-400">
                            <span className="flex items-center"><Rocket className="w-4 h-4 mr-2" /> Live DSA Classes. </span>
                            <span className="flex items-center"><Code className="w-4 h-4 mr-2" /> Live Project Building Sessions. </span>
                            <span className="flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Internships and Referrals. </span>
                            <span className="flex items-center"><ScrollText className="w-4 h-4 mr-2" />Resume Review and Mock Interviews. </span>
                            <span className="flex items-center"><Users className="w-4 h-4 mr-2" />1:1 Mentorship and Doubt Sessions. </span>
                        </p>
                        <div className="lg:mt-20 mt-10 grid lg:grid-cols-2 w-full gap-x-5">
                            <Link href="/community" className="lg:mb-0 mb-5 w-full inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                Know More
                                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </Link>

                            <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                                <Link href="/community" className="w-full bg-white rounded-xl inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                    <Rocket className="mr-2 -ml-1 w-5 h-5" />
                                    Join Now
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="lg:mt-0 mt-10 flex lg:col-span-6 h-[300px]">
                        <div className="aspect-h-9 w-full hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] z-40">
                            <iframe
                                className="w-full h-full rounded-xl p-1"
                                src="https://www.youtube.com/embed/q9oxkhweXY4?si=zqQDV5F_tK2kCP-E"
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Community;