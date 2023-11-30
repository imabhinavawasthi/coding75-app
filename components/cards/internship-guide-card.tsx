import { BookCheck, Download, FileCheck2, Upload } from "lucide-react";

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

                        <h2 className="mt-4 text-xl font-medium sm:text-2xl">Internship Guide</h2>
                    </div>

                    <div
                        className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8"
                    >
                        <h3 className="mt-4 text-xl font-medium sm:text-2xl">Get Your Internship Guide</h3>

                        <p className="mt-4 text-sm sm:text-base">
                        Internship guide for students and freshers - get opportunities with ease!
                        </p>

                        <a href="/community/internship-guide" className="mt-4 font-bold flex">Get it now <Download/> </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InternshipGuideCard;