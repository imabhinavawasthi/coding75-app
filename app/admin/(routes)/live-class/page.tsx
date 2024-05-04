"use client"

import { class_topics } from "@/components/constants"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import supabase from "@/supabase"
import { RotateCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type classDetailsType = {
    className: any,
    classLink: any,
    classTopic: any,
    classSubTopic: any,
    instructorName: any,
    classTime: any,
    classDuration: any
}

function istToEpochSeconds(timeStr) {
    // Create a Date object from the input string
    let dateObj = new Date(timeStr);

    // Convert the Date object to epoch milliseconds
    let epochMilliseconds = dateObj.getTime();

    // Convert milliseconds to seconds and return
    return Math.floor(epochMilliseconds / 1000);
}

function create_url_slug(class_name: string, topic_name:string, class_timing:string) {
    let s = class_name.toLowerCase()
    let cn = topic_name.toLowerCase()
    cn = cn.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-').replace(/^(-)+|(-)+$/g, '');
    s = s.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-').replace(/^(-)+|(-)+$/g, '');
    s = s + "-" + cn + "-" + class_timing.toString().slice(0,10)
    return s
}

const AddLiveClass = () => {
    const [status, setStatus] = useState(false)
    const router = useRouter()
    const [classDetails, setClassDetails] = useState<classDetailsType>({
        className: "",
        classLink: "",
        classSubTopic: "",
        classTime: "",
        classTopic: "",
        instructorName: "",
        classDuration: 60
    })

    async function addClass() {
        setStatus(true)
        try {
            const { data, error } = await supabase
                .from('live-classes')
                .insert([
                    { 
                        class_link: classDetails?.classLink, 
                        class_name: classDetails?.className,
                        instructor_name: classDetails?.instructorName,
                        class_topic: classDetails?.classTopic,
                        class_subtopics: classDetails?.classSubTopic.split(","),
                        class_time_epoch: istToEpochSeconds(classDetails?.classTime),
                        class_url_slug: create_url_slug(classDetails?.className,classDetails?.classTopic,classDetails?.classTime),
                        class_duration: classDetails?.classDuration
                    },
                ])
                .select()
            if(!error){
                toast.success("Class added successfully")
                router.push(`/classroom/live/${create_url_slug(classDetails?.className,classDetails?.classTopic,classDetails?.classTime)}`)
            }
            else{
                setStatus(false)
                console.log(error);
                toast.error("Some error occured")
            }
        }
        catch {
            setStatus(false)
            toast.error("Some error occured")
        }
    }

    return (
        <>
            <div className="md:container px-3 items-center justify-center flex w-full">
                <div className="w-full">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Add Live Class</CardTitle>
                        </CardHeader>
                        <Separator className="mb-5" />
                        <CardContent>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                addClass()
                            }}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="classname">Class Name</Label>
                                        <Input
                                            onChange={(e) => {
                                                setClassDetails({
                                                    ...classDetails,
                                                    className: e.target.value
                                                })
                                            }}
                                            required id="classname" placeholder="Enter Class Name" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="classlink">Class Link</Label>
                                        <Input
                                            onChange={(e) => {
                                                setClassDetails({
                                                    ...classDetails,
                                                    classLink: e.target.value
                                                })
                                            }}
                                            required id="classlink" placeholder="Enter Class Link" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="classtopic">Class Topic</Label>
                                        <Select
                                            onValueChange={(e) => {
                                                setClassDetails({
                                                    ...classDetails,
                                                    classTopic: e
                                                })
                                            }}
                                            required>
                                            <SelectTrigger id="classtopic">
                                                <SelectValue placeholder="Select Class Topic" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
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
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="classsubtopics">Class Sub Topics</Label>
                                        <Input
                                            onChange={(e) => {
                                                setClassDetails({
                                                    ...classDetails,
                                                    classSubTopic: e.target.value
                                                })
                                            }}
                                            id="classsubtopics" placeholder="Enter Class Sub Topics" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="instructor">Instructor Name</Label>
                                        <Input
                                            onChange={(e) => {
                                                setClassDetails({
                                                    ...classDetails,
                                                    instructorName: e.target.value
                                                })
                                            }}
                                            required id="instructor" placeholder="Enter Instructor Name" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="duration">Class Duration</Label>
                                        <Input
                                            onChange={(e) => {
                                                setClassDetails({
                                                    ...classDetails,
                                                    classDuration: e.target.value
                                                })
                                            }}
                                            required type="number" id="duration" placeholder="Enter Class Duration (in minutes)" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="class-time">Choose Class Time</Label>
                                        <Input
                                            type="datetime-local"
                                            id="class-time"
                                            name="class-time"
                                            onChange={(e) => {
                                                setClassDetails({
                                                    ...classDetails,
                                                    classTime: e.target.value
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" disabled={status==true} className="mt-5" variant="outline">{
                                    status&&
                                    <RotateCw className="h-4 w-4 animate-spin mr-2"/>
                                } Add Class</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default AddLiveClass;