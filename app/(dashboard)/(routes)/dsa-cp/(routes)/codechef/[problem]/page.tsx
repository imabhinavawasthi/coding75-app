"use client"

import { useEffect, useState } from "react";
import { BookCheck, BookText, BriefcaseIcon, Check, ExternalLink, FileCode2, FileVideo, Gauge, Share2 } from "lucide-react";
import ResumeReviewCard from "@/components/cards/resume-review-card";
import InternshipGuideCard from "@/components/cards/internship-guide-card";
import Loading from "@/components/loading";
import PageNotFound from "@/components/page-not-found";
import DOMPurify from 'dompurify';
import BreadCrumb from "@/app/(dashboard)/_components/components/breadcrumb";
import Link from "next/link";
import { fetchCodechefProblem } from "../../../(api)/codechef/fetchCodechefProblem";

const Problem = (params: any) => {
    const [problem, setProblem] = useState<any>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProblemsFun() {
            try {
                const { dsaproblem } = await fetchCodechefProblem({ problem: params.params.problem });
                if (dsaproblem) {
                    setProblem(dsaproblem[0])
                }
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchProblemsFun();
    }, [])
    const [isCopied, setIsCopied] = useState(false)
    function getCurrentURL() {
        return window.location.href
    }
    function copyurl() {
        const url = getCurrentURL()
        setIsCopied(true)
        navigator.clipboard.writeText(url);
        setTimeout(() => {
            setIsCopied(false)
        }, 2000);
    }
    return (
        <div>
            {loading ?
                <>
                    <Loading title={"Loading Problem"} />
                </>
                : <>
                    {problem ?
                        <>
                            <div className="lg:container md:container px-3">
                                <div className="mt-3">
                                    <BreadCrumb links={[
                                        {
                                            "title": "DSA CP",
                                            "href": "/dsa-cp"
                                        },
                                        {
                                            "title": `Codechef`,
                                            "href": `/dsa-cp/codechef`
                                        },
                                        {
                                            "title": `${problem["problem_name"]}`,
                                            "href": `/dsa-cp/codechef/${params.params.problem}`
                                        }
                                    ]} />
                                </div>
                                <div className="p-3 lg:mt-5">
                                    <div className="lg:flex lg:items-center lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex">
                                                <h2 className="text-center text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                                    {problem["problem_name"]}
                                                </h2>
                                            </div>
                                            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                                <div className="mt-4 flex items-center text-sm text-gray-500 font-semibold underline">
                                                    <Link className="flex" href={`/dsa-cp/codechef/contest/${problem["contest"]}`}>
                                                    <BookCheck className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    {problem["contest"]}
                                                    </Link>
                                                </div>
                                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                                    <Gauge className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    {problem["difficulty"] == 0 && <div>
                                                        <span
                                                            className="whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-0.5 text-sm text-gray-700"
                                                        >
                                                            {"1 Star"}
                                                        </span>
                                                    </div>}
                                                    {problem["difficulty"] == 1 && <div>
                                                        <span
                                                            className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-700"
                                                        >
                                                            {"2 Star"}
                                                        </span>
                                                    </div>}
                                                    {problem["difficulty"] == 2 && <div>
                                                        <span
                                                            className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700"
                                                        >
                                                            {"3 Star"}
                                                        </span>
                                                    </div>}
                                                    {problem["difficulty"] == 3 && <div>
                                                        <span
                                                            className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700"
                                                        >
                                                            {"4 Star"}
                                                        </span>
                                                    </div>}
                                                    {problem["difficulty"] == 4 && <div>
                                                        <span
                                                            className="whitespace-nowrap rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm text-yellow-700"
                                                        >
                                                            {"5 Star"}
                                                        </span>
                                                    </div>}
                                                    {problem["difficulty"] == 5 && <div>
                                                        <span
                                                            className="whitespace-nowrap rounded-full bg-orange-100 px-2.5 py-0.5 text-sm text-orange-700"
                                                        >
                                                            {"6 Star"}
                                                        </span>
                                                    </div>}
                                                    {problem["difficulty"] == 6 && <div>
                                                        <span
                                                            className="whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-sm text-red-700"
                                                        >
                                                            {"7 Star"}
                                                        </span>
                                                    </div>}
                                                </div>
                                                {problem["company_tags"].length > 0 && <div className="flex flex-wrap mt-4 items-center text-sm text-gray-500">
                                                    <BriefcaseIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    {problem["company_tags"].map((value, index) => (
                                                        
                                                            <span
                                                            key={index}
                                                                className="ml-2 mr-2 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700"
                                                            >
                                                                {value.label}
                                                            </span>
                                                    ))}
                                                </div>}
                                                {problem["topic_tags"].length > 0 && <div className="flex flex-wrap mt-4 items-center text-sm text-gray-500">
                                                    <BookText className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    {problem["topic_tags"].map((value, index) => (
                                                        <div
                                                            key={index}
                                                            className="mt-1">
                                                            <span
                                                                className="ml-2 mr-2 whitespace-nowrap rounded-full bg-yellow-100 px-2.5 py-0.5 text-sm text-yellow-700"
                                                            >
                                                                {value.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>}
                                            </div>
                                        </div>
                                        <div className="mt-10 flex lg:ml-4 lg:mt-0">
                                            {isCopied ? <span className="ml-3">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md bg-white px-5 py-2 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                >
                                                    <Check className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    Copied
                                                </button>
                                            </span> : <span className="ml-3">
                                                <button
                                                    type="button"
                                                    onClick={copyurl}
                                                    className="inline-flex items-center rounded-md bg-white px-5 py-2 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                >
                                                    <Share2 className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    Share
                                                </button>
                                            </span>}

                                            <span className="ml-3">
                                                <a
                                                    href={problem["problem_link"]}
                                                    target="_blank"
                                                    className="inline-flex items-center rounded-md bg-primary-700 px-5 py-2 text-lg font-semibold text-white shadow-sm hover:bg-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                                                >
                                                    <ExternalLink className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                                    Solve
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                    {problem["problem_description"]!="<p><br></p>" && problem["problem_description"]!="" &&
                                        <div>
                                            <div className="mt-10">
                                                <div>
                                                    <h3 className="mb-3 text-lg font-bold ">Problem Description:</h3>
                                                    <p className="text-gray-900 no-more-tailwind"><div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(problem["problem_description"]) }} /></p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {(problem["editorial"] || problem["video_editorial"] || problem["solution_link"]) &&
                                        <div>
                                            <div className="mt-10">
                                                <div>
                                                    <h3 className="mb-3 text-lg font-bold ">Need Help?</h3>
                                                </div>
                                            </div>
                                            <div className="mt-5 flex items-center justify-center">
                                                {problem["video_editorial"] &&
                                                    <embed className="lg:w-1/2 md:w-3/4 w-full aspect-video"
                                                        src={problem["video_editorial"].replace("https://youtu.be/", "https://www.youtube.com/embed/").replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/")}>
                                                    </embed>
                                                }
                                            </div>
                                            <div className="mt-10 flex justify-center">
                                                <div className="w-full flex justify-center rounded-lg border border-gray-100 bg-gray-100 p-1">
                                                    {problem["editorial"] &&
                                                        <a
                                                            href={problem["editorial"]}
                                                            target="_blank"
                                                            className="hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                        >
                                                            <FileCode2 />
                                                            Editorial
                                                        </a>}
                                                        {problem["solution_link"] &&
                                                        <a
                                                            href={problem["solution_link"]}
                                                            target="_blank"
                                                            className="hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                        >
                                                            <FileCode2 />
                                                            Code Solution
                                                        </a>}
                                                    {problem["video_editorial"] &&
                                                        <a
                                                            href={problem["video_editorial"]}
                                                            target="_blank"
                                                            className="hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                        >
                                                            <FileVideo />

                                                            Video Editorial
                                                        </a>}

                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="mt-10">
                                        <h2 className="text-lg font-bold text-black-500">Accelerate Your Interview Preparation With Us 🚀</h2>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                            <div className="mt-5">
                                                <ResumeReviewCard />
                                            </div>
                                            <div className="mt-5">
                                                <InternshipGuideCard />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </> : <>
                            <PageNotFound />
                        </>
                    }
                </>}
        </div>
    );
}

export default Problem;