'use client'

import { useEffect, useState } from "react";
import { fetchProjects } from "../(api)/fetchProjects";
import ProjectCard from "@/components/cards/project-card";
import Loading from "@/components/loading";
import PageHeaderTechList from "@/components/page-headers/page-header-tech-list";
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

const ProjectType = (params: any) => {
    const [projectDetails, setProjectsDetails] = useState([])
    const [status, setStatus] = useState("loading")
    const [level, setLevel] = useState("all")

    async function fetchData(levelProject = undefined) {
        setStatus("loading")
        try {
            const { projects, error } = await fetchProjects(params.params.projecttype, undefined, (!levelProject || levelProject == "all") ? undefined : levelProject);
            if (error) {
                setStatus("error")
                return
            }
            console.log(projects);
            setProjectsDetails(projects);
            setStatus("done")
        } catch (error) {
            setStatus("error")
            console.error("Error fetching data:", error);
        }
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
            {(status == "loading" || status == "error") ? <div>
                <div className="mt-3">
                    <PageHeaderTechList
                        focusHeading="Projects"
                        heading="Explore a variety of coding projects. Explore, Learn, Create"
                    /></div>
                {status == "loading" ? <>
                    <Loading title="Getting some great Projects for you 🚀" /></> : <>
                    <div className="p-10">
                        <ErrorBanner />
                    </div>
                </>}

            </div> : <>
                {projectDetails &&
                    <>
                        <div className="">
                            <PageHeaderTechList
                                focusHeading="Projects"
                                heading={projectDetails[0]?.project_type_description} />
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
                                    </div>

                                </div>
                            </div>
                        </div></>}
            </>}

        </div>
    );
}

export default ProjectType;