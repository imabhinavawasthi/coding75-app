'use client'

import { useEffect, useState } from "react";
import { fetchProjects } from "../(api)/fetchProjects";
import ProjectCard from "@/components/cards/project-card";
import PageNotFound from "@/components/page-not-found";
import Loading from "@/components/loading";
import PageHeaderTechList from "@/components/page-headers/page-header-tech-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const ProjectType = (params: any) => {
    const [projectDetails, setProjectsDetails] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [level, setLevel] = useState("all")

    useEffect(() => {
        async function fetchData() {
            try {
                const { projects } = await fetchProjects({ "projecttype": params.params.projecttype });
                setProjectsDetails(projects);
                console.log(projects);


            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setIsLoading(false)
        }
        fetchData();

    }, [])

    return (
        <div>
            {isLoading ? <div>
                <div className="mt-3">
                    <PageHeaderTechList
                        focusHeading="Projects"
                        heading="Explore a variety of coding projects. Explore, Learn, Create"
                    /></div>
                <Loading title="Getting some great Projects for you 🚀" />

            </div> : <>
                {projectDetails ?
                    <div className="container">
                        <PageHeaderTechList
                            focusHeading="Projects"
                            heading={projectDetails[0]?.project_type_description} />
                        <div className="mt-3">
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
                                                            onValueChange={(e) => setLevel(e)}
                                                        >
                                                            <SelectTrigger id="batch">
                                                                <SelectValue defaultValue={"all"} placeholder="Select Project Difficulty" />
                                                            </SelectTrigger>
                                                            <SelectContent position="popper">
                                                                <SelectItem value="all">All Projects</SelectItem>
                                                                <SelectItem value="2023">Beginner</SelectItem>
                                                                <SelectItem value="2024">Intermediate</SelectItem>
                                                                <SelectItem value="2025">Expert</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="col-span-4 lg:col-span-3 md:col-span-3">
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
                                </div>

                            </div>
                        </div>
                    </div> :
                    <div>
                        <PageNotFound />
                    </div>
                }
            </>}

        </div>
    );
}

export default ProjectType;