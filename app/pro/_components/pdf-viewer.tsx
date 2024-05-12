"use client"

import BreadCrumb from '@/app/(dashboard)/_components/components/breadcrumb';
import { Download, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const ProPdfViewer = ({ greenHeading, heading, description = "", pdf_link, button_text = "" }) => {

    function download_file(fileURL: any) {
        var link = document.createElement('a');
        link.href = fileURL;
        link.target = "_blank";
        link.download = `${heading} ${greenHeading} coding75.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className='md:container px-5 mt-5'>
            <BreadCrumb links={[
                {
                    "title": "coding 75 Classroom",
                    "href": "/classroom/dashboard"
                },
                {
                    "title": button_text,
                    href: ""
                }
            ]} />
            <section className="bg-white dark:bg-gray-900 mt-10">
                <div className="px-4 mx-auto max-w-screen-xl">
                    <div>
                        <h2 className="mb-4 text-4xl text-center tracking-tight font-extrabold text-gray-900 dark:text-white">{heading} <span style={{ color: "#27ae60" }}>{greenHeading}</span></h2>
                        <p className="mb-8 text-center font-light text-gray-500 sm:text-xl dark:text-gray-400">{description}</p>
                        <div className="md:flex justify-center items-center md:flex-row">
                            <Link href="/pro#pricing" className="w-full shadow-2xl inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Subscribe Now
                            </Link>
                            <div className='w-full mt-5 md:mt-0 hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                                <button onClick={() => { download_file(pdf_link) }} className="w-full bg-white inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                    Download Pro {button_text} <Download className="ml-2 -mr-1 w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <Separator className="mt-5 mb-5" />
                </div>
            </section>
            <div className='grid grid-cols-10'>
                <div className='col-span-1 hidden lg:block md:block'></div>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${'^3.11.174'}/build/pdf.worker.min.js`}>
                    <div className='lg:col-span-8 md:col-span-8 col-span-10' style={{ maxWidth: '100%', minWidth: '100%' }}>
                        <Viewer
                            fileUrl={pdf_link}
                        />
                    </div>
                </Worker>
            </div>
        </div>
    );
}

export default ProPdfViewer;