"use client"

import ResourceCard from "@/components/cards/resource-card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { class_topics } from "@/components/constants";
import { fetchPastClasses } from "../../(api)/fetchPastClasses";
import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import { Logo } from "@/app/(dashboard)/_components/components/logo";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";

const ClassMaterialPage = () => {

    const [noOfRows, setNoOfRows] = useState(10)

    const [status, setStatus] = useState("loading")

    const [searchQuery, setSearchQuery] = useState("")

    const [classDetails, setClassDetails] = useState<any>()

    async function fetchPastClassDetails() {
        try {
            const { classes, error } = await fetchPastClasses("")
            if (classes) {
                setClassDetails(classes)
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
            <Card className="min-h-screen w-full overflow-y-scroll">
                <CardHeader>
                    <CardTitle>Class Recordings and Resources</CardTitle>
                    <CardDescription>Recording of Live Classes and Class Materials.</CardDescription>
                </CardHeader>
                <Separator className="mb-5" />
                <CardContent>
                    {
                        status == "done" &&
                        <div>
                            <Input
                                type="text"
                                className="mb-5"
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                }}
                                placeholder="Search for Class (Eg. Codeforces Round 743 Discussion)"
                            />
                            {
                                classDetails?.slice(0, noOfRows)?.map((data, index) => {
                                    if (data?.class_name.toLowerCase()?.includes(searchQuery.toLowerCase().trim()) ||
                                        data?.instructor_name.toLowerCase()?.includes(searchQuery.toLowerCase().trim()) ||
                                        data?.class_topic.toLowerCase()?.includes(searchQuery.toLowerCase().trim()))
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
                                                    class_recording={data?.class_recording}
                                                    class_notes={data?.class_notes}
                                                    class_resources={true}
                                                />
                                            </div>
                                        )
                                })
                            }
                            {
                                (noOfRows < classDetails?.length)
                                &&
                                <div className="mt-5 flex justify-center items-center">
                                    <button className="text-blue-600" onClick={(e) => {
                                        e.preventDefault()
                                        setNoOfRows(noOfRows + 10)
                                    }}>
                                        Load More Classes ↓
                                    </button>
                                </div>
                            }
                        </div>
                    }
                    {
                        status == "loading" &&
                        <>
                            <div className="flex justify-center items-center mt-20 animate-ping">
                                <Logo />
                            </div>
                        </>
                    }
                    {
                        status == "error" &&
                        <ErrorBanner />
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export default ClassMaterialPage;