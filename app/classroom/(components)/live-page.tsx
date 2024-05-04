"use client"

import ResourceCard from "@/components/cards/resource-card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { class_topics } from "@/components/constants";
import { fetchUpcomingClasses } from "../(api)/fetchUpcomingClasses";
import { fetchPastClasses } from "../(api)/fetchPastClasses";
import { ExternalLink, Radio } from "lucide-react";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import Banner from "./banner";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

interface classDetailsType {
    upcomingClasses: any;
    pastClasses: any;
    liveClass: any;
}

const LivePage = ({ topicname }) => {

    const [status, setStatus] = useState("loading")

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
                if (classes?.[0]?.class_time_epoch <= Math.floor(new Date().getTime() / 1000) && + classes?.[0]?.class_duration + + classes?.[0]?.class_time_epoch >= Math.floor(new Date().getTime() / 1000)) {
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

    return (
        <div className="md:container px-3">
            <Banner />
            <div>
                <p className="flex items-center justify-center mb-5 text-lg font-semibold">{class_topics?.[topicname]} Live Classes</p>
                {
                    status == "done" &&
                    <>
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center"><Radio className="h-3 w-3 animate-ping mr-3 text-red-600" />Ongoing Live Class </h3>
                            <Separator className="mb-5" />
                            {
                                classDetails?.liveClass ?
                                    <>
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
                                    </>
                                    :
                                    <div>
                                        No Ongoing Class
                                    </div>
                            }
                        </div>
                        <div className="mt-5">
                            <Tabs defaultValue="upcoming" className="">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="upcoming">Upcoming Live Classes</TabsTrigger>
                                    <TabsTrigger value="past">Past Live Classes</TabsTrigger>
                                </TabsList>
                                <TabsContent value="upcoming">
                                    <div>
                                        {
                                            classDetails?.upcomingClasses.length > 0 ?
                                                <div>
                                                    {
                                                        classDetails?.upcomingClasses.slice(0, 5)?.map((data, index) => {
                                                            return (
                                                                <div
                                                                    className="mb-3"
                                                                    key={index}
                                                                >
                                                                    <ResourceCard
                                                                        type={"upcoming"}
                                                                        heading={data?.class_name}
                                                                        sub_title={class_topics?.[data?.class_topic]}
                                                                        link={`/classroom/live/${data?.class_url_slug}`}
                                                                        instructor_name={data?.instructor_name}
                                                                        class_duration={data?.class_duration}
                                                                        class_subtopics={data?.class_subtopics}
                                                                        class_timing={data?.class_time_epoch}
                                                                    />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                :
                                                <div>
                                                    No Upcoming Classes
                                                </div>
                                        }
                                    </div>
                                </TabsContent>
                                <TabsContent value="past">
                                    <div>
                                        {
                                            classDetails?.pastClasses?.length > 0 ?
                                                <div>
                                                    {
                                                        classDetails?.pastClasses.slice(0, 5)?.map((data, index) => {
                                                            return (
                                                                <div
                                                                    className="mb-3"
                                                                    key={index}
                                                                >
                                                                    <ResourceCard
                                                                        type={"past"}
                                                                        heading={data?.class_name}
                                                                        sub_title={class_topics?.[data?.class_topic]}
                                                                        link={`/classroom/live/${data?.class_url_slug}`}
                                                                        instructor_name={data?.instructor_name}
                                                                        class_duration={data?.class_duration}
                                                                        class_subtopics={data?.class_subtopics}
                                                                        class_timing={data?.class_time_epoch}
                                                                    />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                :
                                                <>
                                                    No Past Live Classes
                                                </>
                                        }
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </>
                }
                {
                    status == "loading" &&
                    <>
                        <div className="mt-20 animate-ping flex items-center justify-center">
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
        </div>
    );
}

export default LivePage;