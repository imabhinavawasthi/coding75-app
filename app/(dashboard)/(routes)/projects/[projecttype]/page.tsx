'use client'

import { useEffect, useState } from "react";
import { fetchProjects } from "../(api)/fetchProjects";
import ProjectCard from "@/components/cards/project-card";
import Loading from "@/components/loading";
import Feature2 from "../../../_components/img/feature2.png"
import PageHeaderProjects from "@/components/page-headers/page-header-projects";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Shapes } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import InfoBanner from "@/app/(dashboard)/_components/info-banner";
import ErrorBanner from "@/app/(dashboard)/_components/error-banner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PostgrestError } from "@supabase/supabase-js";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ProjectType = (params: any) => {
    const [projectDetails, setProjectsDetails] = useState<any>([])
    const [status, setStatus] = useState("loading")
    const [level, setLevel] = useState("all")

    async function fetchData(levelProject = undefined) {
        setStatus("loading")
        try {
            const response = await fetchProjects(params.params.projecttype, undefined, (!levelProject || levelProject == "all") ? undefined : levelProject);
            const { projects, error } = response as { projects: any[] | null; error: PostgrestError | null };
            if (error) {
                setStatus("error")
                return
            }
            if (projects) {
                setProjectsDetails(projects);
                setStatus("done")
                return projects
            }
            setStatus("done")
        } catch (error) {
            setStatus("error")
            console.error("Error fetching data:", error);
            return []
        }
        return []
    }

    async function handleSearch(e) {
        let projects: any = await fetchData()
        setProjectsDetails(
            projects.filter((data) => {
                if (data?.project_name.toLowerCase().includes(e.target.value.toLowerCase()) || data?.project_description.toLowerCase().includes(e.target.value.toLowerCase())) return true; else return false;
            })
        )
    }

    useEffect(() => {
        fetchData();
    }, [])

    function setLevelProjects(e) {
        setLevel(e)
        fetchData(e)
    }

    return (
        <div>
            <div className="">
                {
                    projectDetails ?
                        <>
                            <PageHeaderProjects
                                greenHeading="Projects"
                                heading={projectDetails[0]?.project_type}
                                description={projectDetails[0]?.project_type_description}
                            />
                        </> :
                        <>
                            <PageHeaderProjects />
                        </>
                }
                <div className="mt-3 container">
                    <a target="_blank" href="https://telegram.me/cpabhinav">
                        <Alert className='mb-2'>
                            <Shapes className="h-4 w-4 " />
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>
                                Join Our <h1 className="inline relative mb-4 font-bold leading-none tracking-tight text-gray-900 dark:text-white">
                                    <span className="text-blue-800">
                                        Telegram Channel
                                    </span>

                                </h1> and Stay Updated with all the latest Projects.
                            </AlertDescription>
                        </Alert>
                    </a>
                    <Separator className='my-4' />
                    <div className='lg:hidden mb-4'>
                        <div className='w-full'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className='w-full' variant="outline"><Filter className='w-4 h-4 mr-2' /> Filter</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle><Filter className='w-4 h-4 mr-2' /> Filter</DialogTitle>
                                        <DialogDescription>
                                            Explore different projects.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form>
                                        <div className="grid w-full items-center gap-4">
                                            <div className="flex flex-col space-y-1.5">
                                                <Select
                                                    defaultValue={level}
                                                    onValueChange={(e) => setLevelProjects(e)}
                                                >
                                                    <SelectTrigger id="batch">
                                                        <SelectValue defaultValue={"all"} placeholder="Select Project Difficulty" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="all">All Projects</SelectItem>
                                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="Expert">Expert</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-x-4">
                        <div className="hidden lg:block md:block">
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex justify-center items-center gap-x-2 text-lg'><Filter className='w-4 h-4' /> Filter</CardTitle>
                                    <CardDescription>Explore different projects.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form>
                                        <div className="grid w-full items-center gap-4">
                                            <div className="flex flex-col space-y-1.5">
                                                <Select
                                                    defaultValue={level}
                                                    onValueChange={(e) => setLevelProjects(e)}
                                                >
                                                    <SelectTrigger id="batch">
                                                        <SelectValue defaultValue={"all"} placeholder="Select Project Difficulty" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="all">All Projects</SelectItem>
                                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="Expert">Expert</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="col-span-4 lg:col-span-3 md:col-span-3">
                            <div className="container">
                                <Label>Search Projects</Label>
                                <Input className='mb-5' onChange={(e) => {
                                    if (e.target.value != "") {
                                        handleSearch(e)
                                    }
                                    else {
                                        fetchData()
                                    }
                                }} placeholder='Search Project Name' />
                            </div>
                            {(status == "loading" || status == "error") ?
                                <div>
                                    {status == "loading" ? <>
                                        <Loading title="Getting some great Projects for you 🚀" /></>
                                        :
                                        <>
                                            <div className="p-10">
                                                <ErrorBanner />
                                            </div>
                                        </>}
                                </div> : <>
                                    {projectDetails && <>
                                        {projectDetails.length > 0 ? <>
                                            {projectDetails?.map((project, index) => (
                                                <Link
                                                    href={`/projects/${project.slug_url}/${project.slug_href}`}
                                                    key={index}
                                                >
                                                    <div className="p-3">
                                                        <ProjectCard
                                                            project={project}
                                                        />
                                                    </div>
                                                </Link>
                                            ))}
                                        </> : <>
                                            <InfoBanner
                                                message="No Projects Found!"
                                                description="Try resetting your filters"
                                            />
                                        </>}
                                    </>}
                                </>}

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectType;