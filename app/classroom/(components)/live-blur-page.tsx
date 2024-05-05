import ResourceCard from "@/components/cards/resource-card";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Lock, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const LiveBlurPage = () => {

    return (
        <>
            <div className={"md:container px-3 pointer-events-none filter blur-sm opacity-50"}>
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle>
                            Live Classes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <>
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center"><Radio className="h-3 w-3 animate-ping mr-3 text-red-600" />Ongoing Live Class </h3>
                                <Separator className="mb-5" />
                                <>
                                    <Link className="flex justify-center items-center w-full mb-3" href={"/pro"}>
                                        <Button className="w-full flex items-center border border-amber-700 bg-amber-200 hover:bg-amber-300 text-amber-700 font-bold" variant="destructive">
                                            <Lock className="h-4 w-4 mr-2" /> Subscribe to coding75 Pro to Join Live Class
                                        </Button>
                                    </Link>
                                    <ResourceCard
                                        type={"live"}
                                        heading={"Dynamic Programming Live Class"}
                                        sub_title={"Data Structures and Algorithms"}
                                        link={""}
                                        instructor_name={"Abhinav Awasthi"}
                                        class_duration={60}
                                        class_subtopics={["DSA", "DP", "Problem Solving"]}
                                        class_timing={1714927563}
                                    />
                                </>
                            </div>
                            <div className="mt-5">
                                <Tabs defaultValue="upcoming" className="">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="upcoming">Upcoming Live Classes</TabsTrigger>
                                        <TabsTrigger value="past">Past Live Classes</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="upcoming">
                                        <div
                                            className="mb-3"
                                        >
                                            <ResourceCard
                                                type={"upcoming"}
                                                heading={"Operating System Class"}
                                                sub_title={"CS Fundamental"}
                                                link={""}
                                                instructor_name={"Harshit Varshney"}
                                                class_duration={45}
                                                class_subtopics={["Computer Science", "CS Fundamental", "OS"]}
                                                class_timing={1714947563}
                                            />
                                        </div>
                                        <div
                                            className="mb-3"
                                        >
                                            <ResourceCard
                                                type={"upcoming"}
                                                heading={"Next.js Live Project Building"}
                                                sub_title={"Project Building"}
                                                link={""}
                                                instructor_name={"Suraj Gaud"}
                                                class_duration={90}
                                                class_subtopics={["Frontend", "Javascript", "Next.js"]}
                                                class_timing={1714967563}
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="past">
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </>
                    </CardContent>
                </Card>
            </div>
        </>

    );
}

export default LiveBlurPage;