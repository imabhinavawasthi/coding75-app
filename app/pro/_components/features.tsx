import { CandlestickChart, Code2, Rocket, ScrollText, UserCheck } from "lucide-react";

const Features = () => {
    return (
        <div>
            <section className="md:container px-5">
                <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                    <div className="mb-8 lg:mb-16">
                        <h2 className="mb-4 lg:text-6xl md:text-4xl text-4xl  text-center text-gray-900 tracking-tight font-extrabold dark:text-white">Why Coding75?</h2>
                        <p className="text-left text-gray-500 sm:text-xl dark:text-gray-400">Here at Coding75, we prioritize the development of students in the dynamic world of coding and fast growing industry, making it your one-stop destination for a well-rounded coding education</p>
                    </div>
                    <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <svg className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Live DSA Classes</h3>
                            <p className="text-gray-500 dark:text-gray-400">Daily live classes covering all the important concepts of DSA with problem solving sessions.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <Code2 strokeWidth={3} className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Weekly Project Sessions</h3>
                            <p className="text-gray-500 dark:text-gray-400">Hands-on learning with live project sessions, covering both frontend and backend development with Next.js, Python, Node.js etc.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <UserCheck strokeWidth={3} className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Mock Interviews</h3>
                            <p className="text-gray-500 dark:text-gray-400">Personalized 1:1 mock interviews, tailored to boost your confidence and readiness for success.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                                <ScrollText strokeWidth={3} className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Resume Review and Profile Optimization</h3>
                            <p className="text-gray-500 dark:text-gray-400">with Coding75&apos;s expert resume review and profile optimization services, ensuring you stand out in the competitive tech landscape.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <CandlestickChart strokeWidth={3} className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Competitive Programming</h3>
                            <p className="text-gray-500 dark:text-gray-400">CP sessions, codeforces/codechef contest discussions, live problem solving sessions and much more.</p>
                        </div>
                        <div>
                            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                            <Rocket strokeWidth={3} className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold dark:text-white">Interview Prepration</h3>
                            <p className="text-gray-500 dark:text-gray-400">Interview specific preparation of CS fundamentals topics like operating system, computer system, DBMS and interview specific tips and guidance.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Features;