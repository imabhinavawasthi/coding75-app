import Image from "next/image";
import Feature from "../../app/(dashboard)/_components/img/opportunity-feature.png"
import Typewriter from 'typewriter-effect';
import Link from "next/link";

const FeatureSection2 = () => {
    return (
        <section className="bg-white dark:bg-gray-900 container">
            <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
                <Image src={Feature} alt="opportunity-feature" className="shadow-2xl rounded-xl w-full"/>
                <div className="mt-10">
                    <h2 className="mb-10 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"> <Typewriter
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
                    <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">coding75 helps you expore recent opening and opportunities. Stay ahead in your coding career by exploring the vast array of opportunities presented by Coding75 and propel yourself into the forefront of the tech industry.</p>
                    <Link href="/opportunities" className="inline-flex items-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900">
                        Explore Opportunities
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default FeatureSection2;