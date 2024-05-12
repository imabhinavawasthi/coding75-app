"use client"

import ResourceCard from "@/components/cards/resource-card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { class_topics } from "@/components/constants";
import { fetchUpcomingClasses } from "../../(api)/fetchUpcomingClasses";
import { fetchPastClasses } from "../../(api)/fetchPastClasses";
import { BookText, Code2, ExternalLink, GraduationCap, Radio, Route, UserCheck, Users, Video } from "lucide-react";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import Link from "next/link";
import ResourceCard2 from "@/components/cards/resource-card-2";
import Banner from "../../(components)/banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/cards/dashboard-card";
import ClassroomHeader from "../../(components)/classroom-header";
import Image from "next/image";
import WhatsappSupport from "../../../../public/images/whatsapp-support.png"
import { pro_discussion_group, pro_updates_group, whatsapp_link } from "@/components/social-links";
import SubscriptionCheck from "../../(components)/subscription-check";

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

    return (
        <div className="md:container px-3">
            <Banner />
            <div className="mb-5 grid md:grid-cols-10 grid-col-8 gap-x-5">
                <div className="md:col-span-6 lg:col-span-8">
                    <ClassroomHeader />
                </div>
                <div className="md:block hidden md:col-span-4 lg:col-span-2">
                    <a target="_blank" href={whatsapp_link}>
                        <Image className="rounded-xl border border-gray-300 shadow-lg hover:shadow-inner" alt="whatsapp-support" src={WhatsappSupport} />
                    </a>
                </div>
            </div>
            <div className='mb-4 mt-5 md:mt-4 md:flex items-center justify-center '>
                <a className="flex justify-center items-center" target="_blank" href={pro_updates_group}>
                    <span className="ml-2 hover:underline flex items-center font-semibold">
                        Join coding75 Pro Updates
                        <svg className="ml-1 mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1faf38" /><stop offset="100%" stop-color="#60d669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#f9f9f9" /><stop offset="100%" stop-color="#fff" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z" /><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" />
                        </svg>
                        Group
                    </span>
                </a>
                <Users className='hidden md:block h-4 w-4 mx-3' />
                <a className="md:mt-0 mt-3 flex justify-center items-center" target="_blank" href={pro_discussion_group}>
                    <span className="ml-2 hover:underline flex items-center font-semibold">
                        Join coding75 Pro Discussion
                        <svg className="ml-1 mr-1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 258"><defs><linearGradient id="logosWhatsappIcon0" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#1faf38" /><stop offset="100%" stop-color="#60d669" /></linearGradient><linearGradient id="logosWhatsappIcon1" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stop-color="#f9f9f9" /><stop offset="100%" stop-color="#fff" /></linearGradient></defs><path fill="url(#logosWhatsappIcon0)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a122.994 122.994 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004" /><path fill="url(#logosWhatsappIcon1)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z" /><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561c0 15.67 11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716c-3.186-1.593-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64" />
                        </svg>
                        Group
                    </span>
                </a>
            </div>
            <div className="flex flex-col mb-4 lg:mb-8 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <Link className="w-full" href={"/pro/details"}>
                    <Button variant={"outline"} className="w-full flex items-center">
                        <BookText className="mr-2 -ml-1 w-5 h-5" />
                        Read Curriculum and Details of coding75 Pro Batch
                    </Button>
                </Link>
                <Link className="w-full" href={"/pro/schedule"} >
                    <Button variant={"outline"} className="w-full flex items-center">
                        <Route className="mr-2 -ml-1 w-5 h-5" />
                        Check Complete Weekly Schedule
                    </Button>
                </Link>
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
                <>
                    <SubscriptionCheck type={"live"}>
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
                                            {
                                                classDetails?.pastClasses?.length > 0 &&
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
                                            }

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
                    </SubscriptionCheck>
                </>
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