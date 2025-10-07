import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function MainCard({
    image = null }
) {
    return (
        <div
            style={{ border: "1px solid rgba(0, 39, 38, .4)" }}
            className="bg-[#fffaf1] mt-32 rounded-[16px] relative ibm-plex-sans-condensed-regular w-full max-w-6xl mx-auto p-6 md:p-8">

            {/* Background texture */}
            <div className="absolute inset-0">
                <Image
                    src="/texture.png"
                    alt="texture"
                    fill
                    className="opacity-60 object-cover"
                    sizes="100vw"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12 relative z-[10]">
                {/* Left Section - Banner */}
                <div className="w-full md:w-1/2 flex flex-col gap-6 justify-between items-center">
                    {
                        image ?
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0a1445]">
                                <Image
                                    src={image}
                                    alt="Generative AI Masterclass Banner"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            :
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden 
                                bg-gradient-to-br from-[#0a0f1f] via-[#101935] to-[#0a1445] 
                                flex flex-col items-center justify-center text-center p-6">

                                {/* Subtle texture overlay */}
                                <div className="absolute inset-0 bg-[url('/texture.png')] opacity-20 mix-blend-overlay" />

                                <h2 className="relative z-10 text-2xl md:text-4xl lg:text-5xl font-extrabold 
                                    leading-tight tracking-tight
                                    bg-gradient-to-r from-[#4ade80] via-[#22d3ee] to-[#818cf8] 
                                    bg-clip-text text-transparent drop-shadow-lg">
                                    Generative AI <br /> Masterclass
                                </h2>

                                <p className="relative z-10 mt-4 text-gray-300 text-sm md:text-base max-w-lg mx-auto">
                                    Unlock AI Potential · Models · Tokenizers · Tools · Playground
                                </p>
                            </div>
                    }


                    <div className="flex items-center justify-between w-full gap-8">
                        <button className="w-full px-6 py-3 bg-blue-800 text-white text-one border-one border rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                            Unlock Instant Access
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-gray-500 line-through">₹17,999</span>
                            <span className="text-3xl text-one font-semibold">₹6,999</span>
                        </div>
                    </div>
                </div>

                {/* Right Section - Content */}
                <div className="w-full md:w-1/2 flex flex-col gap-6 justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl text-one md:text-4xl font-medium ibm-plex-sans-condensed-medium">
                            Generative AI Masterclass
                        </h1>
                        <p className="text-three text-md ibm-plex-sans-condensed-regular">
                            Unlock AI Potential: Learn Models, Tokenizers, Playground, P-value, Temperature, Tools
                        </p>
                    </div>

                    {/* Mentors Section */}
                    <div className="space-y-2">
                        <p className="text-gray-600">Mentors</p>
                        <div className="flex  gap-4">
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12">
                                    <Image
                                        src="/pictures/abhinav.jpeg"
                                        alt="Mentor"
                                        fill
                                        className="rounded-full object-cover"
                                        sizes="48px"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium">Abhinav Awasthi</p>
                                    <p className="text-sm text-gray-600">Founder, coding75</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12">
                                    <Image
                                        src="/pictures/abhinav.jpeg"
                                        alt="Mentor"
                                        fill
                                        className="rounded-full object-cover"
                                        sizes="48px"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium">Abhinav Awasthi</p>
                                    <p className="text-sm text-gray-600">Founder, coding75</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-sm text-blue-600 font-medium flex items-center cursor-pointer hover:underline">
                            View all the mentors <ArrowRight className="w-4 h-4 inline-block ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}