'use client'

import { useEffect, useState } from "react";
import { fetchProjects } from "../(api)/fetchProjects";
import PageHeaders from "@/components/page-headers/page-headers";
import ProjectCard from "@/components/cards/project-card";
import PageNotFound from "@/components/page-not-found";
import Loading from "@/components/loading";

const ProjectType = (params: any) => {
    const [projectDetails, setProjectsDetails] = useState([])
    const [isLoading, setIsLoading] = useState(true)
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
            {isLoading ? <div className="container">
                <div className="mt-3">
                    <PageHeaders 
                    heading="Projects Hub 🔥: Explore, Learn, Create 🚀" 
                    description="Explore a variety of coding projects—web development, mobile apps, machine learning, and more. From beginners to experienced coders, find inspiration and hands-on learning in our curated collection. 🚀"/>
                </div>
                <Loading title="Getting some great Projects for you 🚀" />
                
            </div> : <>
                {projectDetails ? <div className="container">
                    <div className="mt-3">
                        <PageHeaders
                            heading={projectDetails[0]?.project_type + " 👨🏻‍💻"}
                            description={projectDetails[0]?.project_type_description + " 🚀"} />
                    </div>
                    <div className="mt-3">
                        <div className="grid lg:grid-cols-2 grid-cols-1">

                            {projectDetails?.map((project, index) => (
                                <div className="p-3" key={index}>
                                    <ProjectCard
                                        project={project}
                                    />
                                </div>
                            ))}

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