'use client'

import { CheckCheckIcon, Code2, ExternalLink, FlaskConical, Save, VideoIcon, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

const ProblemCard1 = ({ problem_name, platform_name, problem_link, topic_tags, difficulty, status }) => {
    const [currentStatus, setCurrentStatus] = useState(status)
    function setStatus(e: any) {
        setCurrentStatus(e.target.value)
    }
    useEffect(() => {

    }, [currentStatus])

    return (
        <div>
            <article className="rounded-xl border-2 border-gray-100 bg-white">
                <div className="flex items-start gap-4 p-4 pb-0">

                    <div>
                        <h3 className="font-medium sm:text-lg flex">
                            <a href={problem_link} target="_blank" className="mr-3 hover:underline">
                                {problem_name}
                            </a>
                            {difficulty == "Easy" && <div>
                                <span
                                    className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-700"
                                >
                                    {difficulty}
                                </span>
                            </div>}
                            {difficulty == "Medium" && <div>
                                <span
                                    className="whitespace-nowrap rounded-full bg-orange-100 px-2.5 py-0.5 text-sm text-orange-700"
                                >
                                    {difficulty}
                                </span>
                            </div>}
                            {difficulty == "Hard" && <div>
                                <span
                                    className="whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-sm text-red-700"
                                >
                                    {difficulty}
                                </span>
                            </div>}
                        </h3>

                        <div className="mt-2 sm:flex sm:items-center sm:gap-2">
                            <h6 className="block text-sm text-gray-500 mb-3 md:mb-0 lg:mb-0">
                                {platform_name}
                            </h6>
                            <span className="hidden sm:block" aria-hidden="true">&middot;</span>
                            <div className="hidden sm:block md:flex lg:flex items-center gap-1 text-gray-500">
                                {topic_tags.map((value, index) => (
                                    <div
                                        key={index}
                                        className="mb-2 md:mb-0 lg:mb-0"
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

                            <span className="hidden sm:block" aria-hidden="true">&middot;</span>
                            <div className="mb-2 lg:mb-0 md:mb-0">
                                <a href="" target="_blank" className="text-xs text-gray-500">
                                    <strong
                                        className="flex rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Solve Now
                                    </strong>
                                </a>
                            </div>
                            <div className="mb-2 lg:mb-0 md:mb-0">
                                <a href="" target="_blank" className="text-xs text-gray-500">
                                    <strong
                                        className="flex rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
                                    >
                                        <VideoIcon className="h-4 w-4 mr-2" />
                                        Video Editorial
                                    </strong>
                                </a>
                            </div>
                            <div className="mb-2 lg:mb-0 md:mb-0">
                                <a href="" target="_blank" className="text-xs text-gray-500">
                                    <strong
                                        className="flex rounded border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-[10px] font-medium text-white"
                                    >
                                        <Code2 className="h-4 w-4 mr-2" />
                                        Solution Code
                                    </strong>
                                </a>
                            </div>
                            <div className="mb-2 lg:mb-0 md:mb-0">
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
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">

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
                </div>
            </article>
        </div>
    );
}

export default ProblemCard1;