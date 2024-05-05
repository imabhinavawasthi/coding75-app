"use client"

import ResourceCard from "@/components/cards/resource-card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { class_topics } from "@/components/constants";
import DashboardHeader from "@/components/page-headers/dashboard-header";
import { fetchUpcomingClasses } from "../../(api)/fetchUpcomingClasses";
import { fetchPastClasses } from "../../(api)/fetchPastClasses";
import { Code2, ExternalLink, GraduationCap, Radio, UserCheck, Video } from "lucide-react";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import Link from "next/link";
import ResourceCard2 from "@/components/cards/resource-card-2";
import Banner from "../../(components)/banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/cards/dashboard-card";

interface classDetailsType {
    upcomingClasses: any;
    pastClasses: any;
    liveClass: any;
}

const ClassroomDashboard = () => {

    const [status, setStatus] = useState("loading")

    const [classDetails, setClassDetails] = useState<classDetailsType>({
        upcomingClasses: null,
        pastClasses: null,
        liveClass: null
    })

    async function fetchUpcomingClassDetails() {
        try {
            const { classes, error } = await fetchUpcomingClasses("")
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
            const { classes, error } = await fetchPastClasses("")
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
            <div className="mb-5">
                <DashboardHeader />
            </div>
            <div className="grid mb-5 md:grid-cols-4 grid-cols-2 gap-x-5 gap-y-5">
                <div className="border-2 border-yellow-400 rounded-lg">
                    <DashboardCard
                        title="Live Classes"
                        heading="Start Learning"
                        description="Join daily interview preparation live classes"
                        href="/classroom/live"
                        icon={Radio}
                    />
                </div>
                <div className="border-2 border-green-300 rounded-lg">
                    <DashboardCard
                        title="1:1 Personalised"
                        heading="Mock Interview"
                        description="1:1 Personalized Mock Interview with coding75 Experts."
                        href="/classroom/mock-interview"
                        icon={UserCheck}
                    />
                </div>
                <div className="border-2 border-blue-300 rounded-lg">
                    <DashboardCard
                        title="Class Material"
                        heading="Class Recordings"
                        description="Access live class recordings and material."
                        href="/classroom/resources"
                        icon={Video}
                    />
                </div>
                <div className="border-2 border-pink-300 rounded-lg">
                    <DashboardCard
                        title="coding75 Pro"
                        heading="Subscription Details"
                        description="Details of your coding75 Pro subscription."
                        href="/classroom/subscription"
                        icon={Code2}
                    />
                </div>
            </div>
            {
                status == "done" &&
                <div>

                    <div className="md:hidden mb-5">
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
                    <div className="grid md:grid-cols-10 grid-cols-6 gap-x-10">
                        <div className="items-center md:col-span-4 col-span-6">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>
                                        Upcoming Live Classes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <Separator className="mb-5" />
                                        {
                                            classDetails?.upcomingClasses ?
                                                <div>
                                                    {
                                                        classDetails?.upcomingClasses.slice(0, 2)?.map((data, index) => {
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
                                    <div>
                                        <Separator className="mb-5" />
                                        <h3 className="font-semibold mb-3">Past Live Classes</h3>
                                        <Separator className="mb-5" />
                                        <div>
                                            {
                                                classDetails?.pastClasses.slice(0, 2)?.map((data, index) => {
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

                                    </div>
                                    <Link href="/classroom/live" className="text-blue-600">Explore More Classes →</Link>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="items-center col-span-6">
                            <Card className="shadow-lg mt-5 md:mt-0">
                                <CardContent className="mt-5">
                                    <>
                                        <div className="hidden md:block">
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
                                            <Separator className="mb-5 mt-5" />
                                        </div>
                                        <h3 className="font-semibold mb-3 flex items-center"><GraduationCap className="h-4 w-4 mr-3" />Personalised Mentorship </h3>
                                        <div className="mb-3">
                                            <ResourceCard2
                                                heading="Resume Review"
                                                description="Submit your resume for review by our experts"
                                                link="/classroom/resume-review"
                                                extra_details={false}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <ResourceCard2
                                                heading="Mock Interview"
                                                description="Book a mock interview session with our mentor"
                                                link="/classroom/mock-interview"
                                                extra_details={false}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <ResourceCard2
                                                heading="1:1 Mentorship Session"
                                                description="Book a 1:1 mentorship session with our mentor"
                                                link="/classroom/mentorship"
                                                extra_details={false}
                                            />
                                        </div>
                                        <Separator className="mb-5 mt-5" />
                                        <h3 className="font-semibold mb-3 flex items-center"><UserCheck className="h-4 w-4 mr-3" />Interview Preparation </h3>
                                        <Separator className="mb-5 mt-5" />
                                        <div className="mb-3">
                                            <ResourceCard2
                                                heading="CS Fundamental Sessions"
                                                description=""
                                                link="/classroom/cs-fundamental"
                                                extra_details={false}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <ResourceCard2
                                                heading="Live Project Building"
                                                description=""
                                                link="/classroom/projects"
                                                extra_details={false}
                                            />
                                        </div>
                                    </>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            }
            {
                status == "error" &&
                <div className="mt-20">
                    <ErrorBanner />
                </div>
            }
            {
                status == "loading" &&
                <div className="mt-20 animate-ping flex items-center justify-center">
                    <Logo />
                </div>
            }
        </div>
    );
}

export default ClassroomDashboard;