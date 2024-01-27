"use client"

import { useEffect, useState } from "react";
import { fetchProjects } from "../../(api)/fetchProjects";
import { BookText, BriefcaseIcon, Check, Code, ExternalLink, FileCode2, FileVideo, Gauge, Link, Shapes, Share2, Terminal, Tv2 } from "lucide-react";
import ResumeReviewCard from "@/components/cards/resume-review-card";
import InternshipGuideCard from "@/components/cards/internship-guide-card";
import Loading from "@/components/loading";
import PageNotFound from "@/components/page-not-found";
import { Button } from "@/components/ui/button";
import LinkNext from "next/link";

const Project = (params: any) => {
    const [project, setProject] = useState({})
    const [status, setStatus] = useState("loading")

    async function fetchData() {
        try {
            const { projects } = await fetchProjects(undefined, params.params.project, undefined);
            setProject(projects[0]);
            setStatus("done")
        } catch (error) {
            console.error("Error fetching data:", error);
            setStatus("error")
        }
    }

    useEffect(() => {

        fetchData();

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
            {status == "loading" ?
                <>
                    <Loading title={"Loading Project"} />
                </>
                : <>
                    {
                        project ?
                            <>
                                <div className="container">
                                    <div className="mt-3 p-3 lg:p-10">
                                        <div className="lg:flex lg:items-center lg:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex">
                                                    <h2 className="text-center text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                                        {project["project_name"]}
                                                    </h2>
                                                </div>
                                                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                                    <div className="mt-4 flex items-center text-sm text-gray-500">
                                                        <Shapes className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                        <span
                                                            className="whitespace-nowrap rounded-full bg-indigo-100 px-2.5 py-0.5 text-sm text-indigo-700"
                                                        >
                                                            <LinkNext
                                                            href={`/projects/${project["slug_url"]}`}
                                                            className="hover:underline"
                                                            >
                                                            {project["project_type"]}
                                                            </LinkNext>
                                                        </span>

                                                    </div>
                                                    <div className="mt-4 flex items-center text-sm text-gray-500">
                                                        <Gauge className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                        {project["project_level"] == "Beginner" && <div>
                                                            <span
                                                                className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-700"
                                                            >
                                                                {"Beginner"}
                                                            </span>
                                                        </div>}
                                                        {project["project_level"] == "Intermediate" && <div>
                                                            <span
                                                                className="whitespace-nowrap rounded-full bg-orange-100 px-2.5 py-0.5 text-sm text-orange-700"
                                                            >
                                                                {"Intermediate"}
                                                            </span>
                                                        </div>}
                                                        {project["project_level"] == "Expert" && <div>
                                                            <span
                                                                className="whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-sm text-red-700"
                                                            >
                                                                {"Expert"}
                                                            </span>
                                                        </div>}
                                                    </div>
                                                    {project["tech_used"].length > 0 && <div className="flex flex-wrap mt-4 items-center text-sm text-gray-500">
                                                        <Terminal className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                        {project["tech_used"].map((value, index) => (
                                                            <span
                                                                key={index}
                                                                className="ml-2 mr-2 lg:mb-0 md:mb-0 mb-2 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700"
                                                            >
                                                                {value}
                                                            </span>
                                                        ))}
                                                    </div>}
                                                </div>
                                            </div>
                                            <div className="mt-10 flex lg:ml-4 lg:mt-0">
                                                {isCopied ? <span className="ml-3">
                                                    <Button
                                                        variant="outline"
                                                        type="button"
                                                        onClick={copyurl}
                                                    >
                                                        <Check className="h-4 w-4 mr-2" aria-hidden="true" />
                                                        Copied
                                                    </Button>
                                                </span> : <span className="ml-3">
                                                    <Button
                                                        variant="outline"
                                                        type="button"
                                                        onClick={copyurl}
                                                    >
                                                        <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                                                        Share
                                                    </Button>
                                                </span>}

                                                <span className="ml-3">
                                                    <a
                                                        href={project["video_link"] ? project["video_link"] : project["blog_link"]}
                                                        target="_blank"
                                                        className="flex"
                                                    >
                                                        <Button
                                                            variant="basic"
                                                        >

                                                            <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                                                            Build
                                                        </Button>
                                                    </a>

                                                </span>
                                            </div>
                                        </div>
                                        {project["project_description"] &&
                                            <div>
                                                <div className="mt-10">
                                                    <div>
                                                        <h3 className="mb-3 text-lg font-bold ">Project Description</h3>
                                                        <p className="text-gray-900">{project["project_description"]}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {(project["blog_link"] != "" || project["video_link"] != "" || project["deploy_link"] != "" || project["code_link"] != "") &&
                                            <div>
                                                <div className="mt-10">
                                                    <div>
                                                        <h3 className="mb-3 text-lg font-bold ">Resources</h3>
                                                    </div>
                                                </div>
                                                <div className="mt-10 flex justify-center">
                                                    <div className="lg:border lg:border-gray-100 lg:bg-gray-100 md:border md:border-gray-100 md:bg-gray-100 w-full grid grid-cols-2 gap-4 lg:flex md:flex justify-center rounded-lg p-1">
                                                        {(project["blog_link"] != "") && <a
                                                            href={project["blog_link"]}
                                                            target="_blank"
                                                            className="border border-gray-100 bg-gray-100 hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                        >
                                                            <FileCode2 className="h-4 w-4" />
                                                            Blog Link
                                                        </a>}
                                                        {(project["video_link"] != "") && <a
                                                            href={project["video_link"]}
                                                            target="_blank"
                                                            className="border border-gray-100 bg-gray-100 hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                        >
                                                            <FileVideo className="h-4 w-4" />

                                                            Video Link
                                                        </a>}
                                                        {project["deploy_link"] != "" && <a
                                                            href={project["deploy_link"]}
                                                            target="_blank"
                                                            className="border border-gray-100 bg-gray-100 hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                        >
                                                            <Link className="h-4 w-4" />

                                                            Deploy Link
                                                        </a>}
                                                        {project["code_link"] != "" && <a
                                                            href={project["code_link"]}
                                                            target="_blank"
                                                            className="border border-gray-100 bg-gray-100 hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                        >
                                                            <Code className="h-4 w-4" />

                                                            Code Link
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
                            </>
                            :
                            <>
                                <PageNotFound />
                            </>
                    }
                </>}
        </div>
    );
}

export default Project;