'use client'

import { useEffect, useState } from "react";
import { fetchProjects } from "../(api)/fetchProjects";
import PageHeaders from "@/components/page-headers";
import ProjectCard from "@/components/cards/project-card";
import PageNotFound from "@/components/page-not-found";

const ProjectType = (params: any) => {
    const [projectDetails, setProjectsDetails] = useState([])
    useEffect(() => {
        async function fetchData() {
            try {

                const { projects } = await fetchProjects({ "projecttype": params.params.projecttype });
                setProjectsDetails(projects);
                console.log(projects);


            } catch (error) {
                console.error("Error fetching data:", error);
            }

        }

        fetchData();
    }, [])

    return (
        <div>
            {projectDetails?<div className="container">
                <div className="mt-3">
                    <PageHeaders 
                    heading={projectDetails[0]?.project_type + " 👨🏻‍💻"} 
                    description={projectDetails[0]?.project_type_description + " 🚀"}/>
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
            </div>:
            <div>
                <PageNotFound/>
                </div>
            }
        </div>
    );
}

export default ProjectType;