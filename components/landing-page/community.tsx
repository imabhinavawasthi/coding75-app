import { BookText, Globe2, MessageSquareDashed, MessagesSquare, Radio, SearchCheck, Users } from "lucide-react";

const Community = () => {
    return (
        <div>
            <section>
                <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                    <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-2 lg:items-center lg:gap-x-16">
                    <div className="hidden lg:grid lg:grid-cols-2 gap-4 grid-cols-1">
                            <div
                                className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                            >
                                <span className="inline-block rounded-lg bg-gray-50 p-3">
                                    <Users className="w-6 h-6" />
                                </span>

                                <h2 className="mt-2 font-bold">20k+ Members</h2>

                                <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                                    Community of more than 20k members from different colleges.
                                </p>
                            </div>

                            <div
                                className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                            >
                                <span className="inline-block rounded-lg bg-gray-50 p-3">
                                    <Radio className="w-6 h-6" />
                                </span>

                                <h2 className="mt-2 font-bold">Live Sessions</h2>

                                <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                                    Quick updates of exclusive live sessions and classes.
                                </p>
                            </div>

                            <div
                                className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                            >
                                <span className="inline-block rounded-lg bg-gray-50 p-3">
                                    <BookText className="w-6 h-6" />
                                </span>

                                <h2 className="mt-2 font-bold">Resources</h2>

                                <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                                    Get instant access to premium member only resources.
                                </p>
                            </div>

                            <div
                                className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                            >
                                <span className="inline-block rounded-lg bg-gray-50 p-3">
                                    <MessageSquareDashed className="w-6 h-6" />
                                </span>

                                <h2 className="mt-2 font-bold">Interact with Others</h2>

                                <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                                    Interact with others having diversified domain knowledge.
                                </p>
                            </div>

                            <div
                                className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                            >
                                <span className="inline-block rounded-lg bg-gray-50 p-3">
                                    <MessagesSquare className="w-6 h-6" />
                                </span>

                                <h2 className="mt-2 font-bold">1:1 Mentorship</h2>

                                <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                                    1:1 Mentorship Sessions with our experts and mentors.
                                </p>
                            </div>

                            <div
                                className="block rounded-xl border border-gray-100 p-4 shadow-sm hover:border-gray-200 hover:ring-1 hover:ring-gray-200 focus:outline-none focus:ring"
                            >
                                <span className="inline-block rounded-lg bg-gray-50 p-3">
                                    <SearchCheck className="w-6 h-6" />
                                </span>

                                <h2 className="mt-2 font-bold">Opportunities</h2>

                                <p className="hidden sm:mt-1 sm:block sm:text-sm sm:text-gray-600">
                                    Regular updates for new jobs and opportunities.
                                </p>
                            </div>
                        </div>
                        <div className=" mx-auto max-w-lg text-center lg:mx-0 ltr:lg:text-left rtl:lg:text-right">
                            <div className="flex justify-center">
                                <span className="align-items-center"><Globe2 size={35} /></span><h2 className="text-3xl font-bold sm:text-4xl">&nbsp;  Join Our Community</h2>
                            </div>

                            <p className="mt-4 text-gray-600">
                                Dive into a welcoming space where tech enthusiasts from all backgrounds converge. Join our dynamic coding community to share insights, seek advice, and engage with a diverse network of passionate individuals. Together, let&apos;s inspire, learn, and shape the future of technology!
                            </p>

                            <a
                                href="https://telegram.me/cpabhinav"
                                target="_blank"
                                className="mt-8 inline-block rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
                            >
                                Join Now
                            </a>
                        </div>

                        
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Community;