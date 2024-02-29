"use client"

import { useEffect, useState } from "react";
import { fetchProjects } from "../../(api)/fetchProjects";
import { Check, Code, ExternalLink, FileCode2, Link2Icon, FileVideo, Gauge, Shapes, Share2, Terminal, Tv2 } from "lucide-react";
import ResumeReviewCard from "@/components/cards/resume-review-card";
import InternshipGuideCard from "@/components/cards/internship-guide-card";
import Loading from "@/components/loading";
import PageNotFound from "@/components/page-not-found";
import { Button } from "@/components/ui/button";
import DOMPurify from 'dompurify';
import LinkNext from "next/link";
import Link from "next/link";
import { PostgrestError } from "@supabase/supabase-js";

const Project = (params: any) => {
    const [project, setProject] = useState<any>({})
    const [status, setStatus] = useState("loading")

    async function fetchData() {
        try {
            const response = await fetchProjects(undefined, params.params.project, undefined);
            const { projects, error } = response as { projects: any[] | null; error: PostgrestError | null };
            if (error) {
                setStatus("error")
                return
            }
            if(projects){
                setProject(projects[0]);
            }
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
                                <div className="lg:container md:container px-3">
                                    <div className="p-3 lg:p-10">
                                        <nav className="flex flex-wrap" aria-label="Breadcrumb">
                                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                                <li className="inline-flex items-center">
                                                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                                        <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                                        </svg>
                                                        Home
                                                    </Link>
                                                </li>
                                                <li>
                                                    <div className="flex items-center">
                                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                                        </svg>
                                                        <Link href="/projects" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">Projects</Link>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="flex items-center">
                                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                                                        </svg>
                                                        <Link href={`/projects/${project["slug_url"]}`} className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{project["project_type"]}</Link>
                                                    </div>
                                                </li>
                                            </ol>
                                        </nav>

                                        <div className="lg:flex lg:items-center lg:justify-between mt-5">
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
                                                        <p className="text-gray-900 no-more-tailwind"><div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project["project_description"]) }} /></p>
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
                                                            <Link2Icon className="h-4 w-4" />

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