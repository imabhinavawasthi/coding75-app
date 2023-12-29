'use client'

import { Code2, ExternalLink, VideoIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ProblemCard1 = ({ problem_name, platform_name, problem_link, topic_tags, company_tags, difficulty, status, slug_url, editorial, video_editorial }) => {
    const [currentStatus, setCurrentStatus] = useState(status)
    function setStatus(e: any) {
        setCurrentStatus(e.target.value)
    }
    useEffect(() => {

    }, [currentStatus])

    return (
        <div>
            <a href={"/dsa-cp/problems/" + slug_url}>
                <article className="rounded-xl border-2 border-gray-100 bg-white">
                    <div className="flex items-start gap-4 p-4">

                        <div>
                            <h3 className="font-medium sm:text-lg flex">
                                <div className="mr-3 hover:underline">
                                    {problem_name}
                                </div>
                                {difficulty == 0 && <div>
                                    <span
                                        className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-700"
                                    >
                                        {"Easy"}
                                    </span>
                                </div>}
                                {difficulty == 1 && <div>
                                    <span
                                        className="whitespace-nowrap rounded-full bg-orange-100 px-2.5 py-0.5 text-sm text-orange-700"
                                    >
                                        {"Medium"}
                                    </span>
                                </div>}
                                {difficulty == 2 && <div>
                                    <span
                                        className="whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-sm text-red-700"
                                    >
                                        {"Hard"}
                                    </span>
                                </div>}
                                {difficulty == 3 && <div>
                                    <span
                                        className="whitespace-nowrap rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700"
                                    >
                                        {"Advanced"}
                                    </span>
                                </div>}
                            </h3>

                            <div className="mt-2 md:flex md:items-center md:gap-2 sm:flex sm:items-center sm:gap-2">
                                <h6 className="block text-sm text-gray-500 mb-3 lg:mb-0">
                                    {platform_name}
                                </h6>
                                <span className="hidden lg:block" aria-hidden="true">&middot;</span>
                                <div className="hidden lg:flex items-center gap-1 text-gray-500">
                                    {topic_tags.map((value, index) => (
                                        <div
                                            key={index}
                                            className="mb-2 lg:mb-0"
                                        >

                                            <p className="text-xs">
                                                <span
                                                    className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-purple-700 "
                                                >
                                                    {value}
                                                </span>
                                            </p>
                                        </div>
                                    ))}

                                </div>
                                <span className="hidden lg:block" aria-hidden="true">&middot;</span>
                                <div className="hidden lg:flex items-center gap-1 text-gray-500">
                                    {company_tags.map((value, index) => (
                                        <div
                                            key={index}
                                            className="mb-2 lg:mb-0"
                                        >

                                            <p className="text-xs">
                                                <span
                                                    className="whitespace-nowrap rounded-full bg-yellow-100 px-2.5 py-0.5 text-yellow-700 "
                                                >
                                                    {value}
                                                </span>
                                            </p>
                                        </div>
                                    ))}

                                </div>

                                <span className="hidden lg:block" aria-hidden="true">&middot;</span>
                                <div className="mb-2 lg:mb-0">
                                    <a href={problem_link} target="_blank" className="text-xs text-gray-500">
                                        <strong
                                            className="flex rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Solve Now
                                        </strong>
                                    </a>
                                </div>
                                <div className="mb-2 lg:mb-0">
                                    <a href={video_editorial} target="_blank" className="text-xs text-gray-500">
                                        <strong
                                            className="flex rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
                                        >
                                            <VideoIcon className="h-4 w-4 mr-2" />
                                            Video Editorial
                                        </strong>
                                    </a>
                                </div>
                                <div className="mb-2 lg:mb-0">
                                    <a href={editorial} target="_blank" className="text-xs text-gray-500">
                                        <strong
                                            className="flex rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
                                        >
                                            <Code2 className="h-4 w-4 mr-2" />
                                            Solution Code
                                        </strong>
                                    </a>
                                </div>
                                {/* <div className="mb-2 lg:mb-0 md:mb-0">
                                <strong
                                    className="flex rounded border border-indigo-500 bg-indigo-500 px-2 py-2 text-[10px] font-medium text-white"
                                >
                                    <select onChange={(e) => { setStatus(e) }} id="status" className="bg-indigo-500">
                                        <option selected={status == "unsolved"} value="unsolved">Unsolved</option>
                                        <option selected={status == "trying"} value="trying">Trying</option>
                                        <option selected={status == "solved"} value="solved">Solved</option>
                                        <option selected={status == "save"} value="save">Save for Later</option>
                                    </select>
                                </strong>
                            </div> */}
                            </div>
                        </div>
                    </div>

                    {/* <div className="flex justify-end">

                    {currentStatus == "solved" &&
                        <strong
                            className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-green-600 px-3 py-1.5 text-white"
                        >
                            <div className="flex">
                                <CheckCheckIcon className="w-4 h-4 mr-1" />

                                <span className="text-[10px] font-medium sm:text-xs">Solved!</span>
                            </div>
                        </strong>
                    }
                    {currentStatus == "unsolved" &&
                        <strong
                            className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-orange-400 px-3 py-1.5 text-white"
                        >
                            <div className="flex">
                                <XCircle className="w-4 h-4 mr-1" />

                                <span className="text-[10px] font-medium sm:text-xs">Unsolved!</span>
                            </div>
                        </strong>
                    }
                    {currentStatus == "save" &&
                        <strong
                            className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-indigo-500 px-3 py-1.5 text-white"
                        >
                            <div className="flex">
                                <Save className="w-4 h-4 mr-1" />

                                <span className="text-[10px] font-medium sm:text-xs">Saved for Later!</span>
                            </div>
                        </strong>
                    }
                    {currentStatus == "trying" &&
                        <strong
                            className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-pink-500 px-3 py-1.5 text-white"
                        >
                            <div className="flex">
                                <FlaskConical className="w-4 h-4 mr-1" />

                                <span className="text-[10px] font-medium sm:text-xs">Trying!</span>
                            </div>
                        </strong>
                    }
                </div> */}
                </article>
            </a>
        </div>
    );
}

export default ProblemCard1;