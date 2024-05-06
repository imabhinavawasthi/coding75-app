"use client"

import { useEffect, useState } from "react";
import { Book, Calendar, Clock, Code, ExternalLink, Gauge, Radio, Video } from "lucide-react";
import PageNotFound from "@/components/page-not-found";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import ReactPlayer from 'react-player'
import supabase from "@/supabase";
import { toast } from "sonner";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import { convertEpochToIST } from "@/components/cards/resource-card";
import { class_topics } from "@/components/constants";
import LivePage from "./live-page";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const LiveClassPage = ({ class_url }: any) => {
    const [classDetails, setClassDetails] = useState<any>(null)
    const [status, setStatus] = useState("loading")
    const [classStatus, setClassStatus] = useState("past")

    async function fetchClassDetails() {
        try {
            let { data, error } = await supabase
                .from('live-classes')
                .select('*')
                .eq("class_url_slug", class_url)
            if (error) {
                toast.error("Some error happened")
                setStatus("error")
            }
            else {
                setClassDetails(data?.[0])
                if (data?.[0]?.class_time_epoch <= Math.floor(new Date().getTime() / 1000) && + data?.[0]?.class_duration + + data?.[0]?.class_time_epoch >= Math.floor(new Date().getTime() / 1000)) {
                    setClassStatus("live")
                }
                else if (data?.[0]?.class_time_epoch > Math.floor(new Date().getTime() / 1000)) {
                    setClassStatus("upcoming")
                }
                setStatus("done")
            }
        }
        catch {
            toast.error("Some error happened")
            setStatus("error")
        }
    }

    useEffect(() => {
        fetchClassDetails()
    }, [])

    return (
        <div>
            {
                status == "done" &&
                <>
                    {classDetails ?
                        <>
                            <div className="lg:container md:container px-3">
                                <div className="mt-3">
                                    <Breadcrumb>
                                        <BreadcrumbList>
                                            <BreadcrumbItem>
                                                <BreadcrumbLink href="/classroom">Classroom</BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbLink href="/classroom/live">Live</BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <BreadcrumbLink href={`/classroom/${classDetails?.["class_topic"]}`}>{class_topics?.[classDetails?.["class_topic"]]}</BreadcrumbLink>
                                            </BreadcrumbItem>
                                        </BreadcrumbList>
                                    </Breadcrumb>
                                </div>
                                <div className="p-3 lg:mt-5">
                                    <div className="lg:flex lg:items-center lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex">
                                                <h2 className="text-center text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                                    {classDetails?.["class_name"]}
                                                </h2>
                                            </div>
                                            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                                    <Calendar className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    {convertEpochToIST(classDetails?.["class_time_epoch"])}
                                                </div>
                                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                                    <Gauge className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    <span
                                                        className="whitespace-nowrap rounded-full bg-green-100 px-2.5 py-0.5 text-sm text-green-700"
                                                    >
                                                        <Link href={`/classroom/${classDetails?.["class_topic"]}`} className="hover:underline">
                                                            {class_topics?.[classDetails?.["class_topic"]]}
                                                        </Link>
                                                    </span>
                                                </div>
                                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                                    <Clock className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    <span
                                                        className="whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-0.5 text-sm text-amber-700"
                                                    >
                                                        {classDetails?.["class_duration"] + " Minutes"}
                                                    </span>
                                                </div>
                                                {classDetails["class_subtopics"].length > 0 && <div className="flex flex-wrap mt-4 items-center text-sm text-gray-500">
                                                    <Code className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    {classDetails["class_subtopics"]?.map((value, index) => (
                                                        <div
                                                            key={index}
                                                            className="mt-1">
                                                            <span

                                                                className="ml-2 mr-2 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700"
                                                            >
                                                                {value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>}
                                            </div>
                                        </div>
                                        <div className="mt-10 flex lg:ml-4 lg:mt-0">
                                            {
                                                classStatus == "live" &&
                                                <>
                                                    <a target="_blank" href={classDetails?.class_link}>
                                                        <Button variant={"destructive"} className="flex items-center w-full">
                                                            <Radio className="animate-ping h-4 w-4 mr-2" /> Join Live Class
                                                        </Button>
                                                    </a>
                                                </>
                                            }
                                            {
                                                classStatus == "past" &&
                                                <>
                                                    {
                                                        classDetails?.class_recording ?
                                                            <>
                                                                <a target="_blank" href={classDetails?.class_recording}>
                                                                    <Button variant={"basic"} className="flex items-center w-full">
                                                                        <Video className="h-4 w-4 mr-2" /> Watch Class Recording
                                                                    </Button>
                                                                </a>
                                                            </>
                                                            :
                                                            <>

                                                                <Button disabled variant={"outline"} className="flex items-center w-full">
                                                                    <Video className="h-4 w-4 mr-2" /> Recording Processing (Please Wait)
                                                                </Button>
                                                            </>
                                                    }
                                                </>
                                            }
                                            {
                                                classStatus == "upcoming" &&
                                                <>
                                                    <a target="_blank" href={classDetails?.class_link}>
                                                        <Button variant={"destructive"} className="flex items-center w-full">
                                                            <Clock className="h-4 w-4 mr-2" /> Upcoming Live Class
                                                        </Button>
                                                    </a>
                                                </>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <div className="mt-10 flex justify-center">
                                            <div className="w-full flex justify-center rounded-lg border border-gray-100 bg-gray-100 p-1">
                                                {classDetails?.class_recording ?
                                                    <a
                                                        href={classDetails?.class_recording}
                                                        target="_blank"
                                                        className="hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                    >
                                                        <Video />
                                                        Class Recording
                                                    </a> :
                                                    <span
                                                        className="hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                    >
                                                        <Video />
                                                        Recording Processing (Please Wait)
                                                    </span>
                                                }
                                                {classDetails?.class_notes ?
                                                    <a
                                                        href={classDetails?.class_link}
                                                        target="_blank"
                                                        className="hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                    >
                                                        <Book />
                                                        Class Notes
                                                    </a>
                                                    :
                                                    <span
                                                        className="hover:bg-white hover:text-blue-500 inline-flex items-center gap-2 rounded-md px-4 py-2 lg:text-lg text-sm text-gray-500 focus:relative"
                                                    >
                                                        <Book />
                                                        Notes to be updated
                                                    </span>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            classDetails?.class_recording &&
                                            <>
                                                <div className="mt-10">
                                                    <div>
                                                        <h3 className="mb-3 text-lg font-bold ">Class Recording</h3>
                                                    </div>
                                                </div>
                                                <div className="mt-5 flex items-center justify-center w-full">
                                                    {classDetails?.class_recording?.includes("drive") ?
                                                        <>
                                                            <iframe src={classDetails?.class_recording.replace("view", "preview")} className="w-full aspect-video" allow="autoplay"></iframe>
                                                        </> :
                                                        <ReactPlayer controls={true} url={classDetails?.class_recording} />
                                                    }
                                                </div>
                                            </>
                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="mt-10">
                                <LivePage topicname={""} noLive={true} />
                            </div>
                        </> : <>
                            <PageNotFound />
                        </>
                    }
                </>
            }
            {
                status == "loading" &&
                <>
                    <div className="mb-20 mt-20 animate-ping flex items-center justify-center">
                        <Logo />
                    </div>
                </>
            }
            {
                status == "error" &&
                <div className="mt-20">
                    <ErrorBanner />
                </div>
            }
        </div>
    );
}

export default LiveClassPage;