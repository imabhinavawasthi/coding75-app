"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { class_topics } from "@/components/constants";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { fetchUpcomingClasses } from "../../(api)/fetchUpcomingClasses";
import { fetchPastClasses } from "../../(api)/fetchPastClasses";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import ResourceCard, { convertEpochToIST } from "@/components/cards/resource-card";

interface classDetailsType {
    upcomingClasses: any;
    pastClasses: any;
    liveClass: any;
}

const SchedulePage = () => {

    const [status, setStatus] = useState("loading")
    const [topicname, setTopicname] = useState("")

    const [classDetails, setClassDetails] = useState<classDetailsType>({
        upcomingClasses: null,
        pastClasses: null,
        liveClass: null
    })

    async function fetchUpcomingClassDetails() {
        try {
            const { classes, error } = await fetchUpcomingClasses(topicname)
            if (classes) {
                return classes
            }
            else {
                console.error("Error fetching data", error);
                toast.error('Some error happened')
            }
        }
        catch {
            toast.error('Some error happened')
        }
        return null
    }

    async function fetchPastClassDetails() {
        try {
            const { classes, error } = await fetchPastClasses(topicname)
            const upcomingClassesDetails = await fetchUpcomingClassDetails()
            if (classes) {
                if (classes?.[0]?.class_time_epoch <= Math.floor(new Date().getTime() / 1000) && (classes?.[0]?.class_duration * 60 + classes?.[0]?.class_time_epoch) >= Math.floor(new Date().getTime() / 1000)) {
                    setClassDetails({
                        upcomingClasses: upcomingClassesDetails,
                        liveClass: classes[0],
                        pastClasses: classes.slice(1)
                    })
                }
                else {
                    setClassDetails({
                        upcomingClasses: upcomingClassesDetails,
                        liveClass: null,
                        pastClasses: classes
                    })
                }
                setStatus("done")
            }
            else {
                setStatus("error")
                console.error("Error fetching data", error);
                toast.error('Some error happened')
            }
        }
        catch {
            setStatus("error")
            toast.error('Some error happened')
        }
    }

    useEffect(() => {
        fetchPastClassDetails()
    }, [])

    useEffect(() => {
        setStatus("loading")
        fetchPastClassDetails()
    }, [topicname])

    return (
        <div className="md:container px-3">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Classes Schedule
                    </CardTitle>
                </CardHeader>
                <Separator className="mb-5" />
                <CardContent className="min-h-screen w-full">
                    <Select onValueChange={(e) => {
                        if (e == "all") {
                            setTopicname("")
                        }
                        else {
                            setTopicname(e)
                        }
                    }}>
                        <SelectTrigger className="mb-5">
                            <SelectValue placeholder="Select Class Topic" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {
                                Object.keys(class_topics).map((data, index) => {
                                    return (
                                        <SelectItem key={index} value={data}>
                                            {class_topics[data]}
                                        </SelectItem>
                                    )
                                })
                            }
                        </SelectContent>
                    </Select>
                    {
                        status == "done" &&
                        <div className="w-full">
                            {
                                classDetails?.liveClass &&
                                <div className="mb-5">
                                    <p className="mb-2 text-center">Ongoing Live Class</p>
                                    <a target="_blank" className="flex justify-center items-center w-full mb-3" href={classDetails?.liveClass?.class_link}>
                                        <Button className="w-full flex items-center" variant="destructive">
                                            Join Class <ExternalLink className="h-4 w-4 ml-3" />
                                        </Button>
                                    </a>
                                    <ResourceCard
                                        type={"live"}
                                        heading={classDetails?.liveClass?.class_name}
                                        sub_title={class_topics?.[classDetails?.liveClass?.class_topic]}
                                        link={`/classroom/live/${classDetails?.liveClass?.class_url_slug}`}
                                        instructor_name={classDetails?.liveClass?.instructor_name}
                                        class_duration={classDetails?.liveClass?.class_duration}
                                        class_subtopics={classDetails?.liveClass?.class_subtopics}
                                        class_timing={classDetails?.liveClass?.class_time_epoch}
                                    />
                                </div>
                            }
                            <Tabs defaultValue="upcoming" className="w-full">
                                <TabsList className="w-full mb-5" >
                                    <TabsTrigger className="w-full" value="upcoming">Upcoming</TabsTrigger>
                                    <TabsTrigger className="w-full" value="past">Past</TabsTrigger>
                                </TabsList>
                                <TabsContent value="upcoming">
                                    {
                                        classDetails?.upcomingClasses.length == 0 ?
                                            <>
                                                <p>No upcoming classes scheduled</p>
                                                <Link className="text-blue-600 underline" href="/classroom/resources">Check class recordings →</Link>
                                            </>
                                            :
                                            <>
                                                <ol className="relative border-s border-gray-200 dark:border-gray-700">
                                                    {
                                                        classDetails?.upcomingClasses?.map((data: any, index) => {
                                                            return (
                                                                <li className="mb-10 ms-6" key={index}>
                                                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                                                        </svg>
                                                                    </span>
                                                                    <time className="block mb-2 text-sm font-normal leading-none text-gray-600 dark:text-gray-500">{convertEpochToIST(data?.class_time_epoch)}</time>
                                                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                                        {data?.class_name}
                                                                        <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">
                                                                            {class_topics?.[data?.class_topic]}
                                                                        </span>
                                                                    </h3>
                                                                    <p className="mb-1 font-normal text-gray-500 dark:text-gray-400">Instructor: <strong>{data?.instructor_name}</strong></p>
                                                                    <p className="mb-1 font-normal text-gray-500 dark:text-gray-400">Duration: <strong>{data?.class_duration} Minutes</strong></p>
                                                                    <Link href={`/classroom/live/${data?.class_url_slug}`} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">

                                                                        Class Details →</Link>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ol>
                                            </>
                                    }
                                </TabsContent>
                                <TabsContent value="past">
                                    {
                                        classDetails?.pastClasses.length == 0 ?
                                            <>
                                                <p>No past classes</p>
                                            </>
                                            :
                                            <>
                                                <ol className="relative border-s border-gray-200 dark:border-gray-700">
                                                    {
                                                        classDetails?.pastClasses.slice(0, 5)?.map((data: any, index) => {
                                                            return (
                                                                <li className="mb-10 ms-6" key={index}>
                                                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                                                                        <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                                                        </svg>
                                                                    </span>
                                                                    <time className="block mb-2 text-sm font-normal leading-none text-gray-600 dark:text-gray-500">{convertEpochToIST(data?.class_time_epoch)}</time>
                                                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                                        {data?.class_name}
                                                                        <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">
                                                                            {class_topics?.[data?.class_topic]}
                                                                        </span>
                                                                    </h3>
                                                                    <p className="mb-1 font-normal text-gray-500 dark:text-gray-400">Instructor: <strong>{data?.instructor_name}</strong></p>
                                                                    <p className="mb-1 font-normal text-gray-500 dark:text-gray-400">Duration: <strong>{data?.class_duration} Minutes</strong></p>
                                                                    <Link href={`/classroom/live/${data?.class_url_slug}`} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
                                                                        Class Recording →
                                                                    </Link>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                    <Link className="text-center text-blue-600 underline mb-5" href="/classroom/resources">Click here for all the past classes and recordings</Link>
                                                </ol>
                                            </>
                                    }
                                </TabsContent>
                            </Tabs>
                        </div>
                    }
                    {
                        status == "error" &&
                        <ErrorBanner />
                    }
                    {
                        status == "loading" &&
                        <div className="mb-20 mt-20 animate-ping flex items-center justify-center">
                            <Logo />
                        </div>
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export default SchedulePage;