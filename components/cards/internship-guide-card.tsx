import { BookCheck, ChevronRight, Download, FileCheck2, Upload } from "lucide-react";

const InternshipGuideCard = () => {
    return (
        <div>
            <div className="group relative block h-64 lg:h-48">
                <span className="absolute inset-0 border-2 border-dashed border-black"></span>

                <div
                    className="relative flex h-full transform items-end border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2"
                >
                    <div
                        className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8"
                    >
                        <BookCheck className="h-10 w-10 sm:h-12 sm:w-12"/>

                        <h2 className="mt-4 text-xl font-medium sm:text-2xl">Live DSA & CP Classes</h2>
                    </div>

                    <div
                        className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8"
                    >
                        <h3 className="mt-4 text-xl font-medium sm:text-2xl">Join coding75 Pro 🚀</h3>

                        <p className="mt-4 text-sm sm:text-base">
                        Live DSA & CP Classes with Doubt & Practice Sessions
                        </p>

                        <a href="/pro" className="mt-4 font-bold flex">Join <ChevronRight/> </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InternshipGuideCard;