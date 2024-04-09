import ResourceCard2 from "@/components/cards/resource-card-2";
import PageHeaderTechList from "@/components/page-headers/page-header-projects";
import type { Metadata } from 'next'

//icons
import ReactIcon from "../../../../public/logos/react.png"
import DBIcon from "../../../../public/logos/db.png"
import FlutterIcon from "../../../../public/logos/flutter.png"
import JSIcon from "../../../../public/logos/js.png"
import NextIcon from "../../../../public/logos/next.svg"
import PythonIcon from "../../../../public/logos/python.svg.png"

export const metadata: Metadata = {
    title: 'Project Hub coding75',
    description: 'Explore a variety of coding projects—web development, mobile apps, machine learning, and more. From beginners to experienced coders, find inspiration and hands-on learning in our curated collection. 🚀',
}

const ProjectsPage = () => {
    return (
        <div>
            <PageHeaderTechList />
            <div className="lg:container px-2">
                <div className="mt-3">
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                        <div className="p-5">
                            <ResourceCard2
                                heading={"Basic Frontend Projects"}
                                description={"Frontend Projects for Beginners with HTML, CSS and Javascript. "}
                                link={"/projects/basicfrontend"}
                                icon_link={JSIcon}
                                extra_details={true} />
                        </div>
                        <div className="p-5">
                            <ResourceCard2
                                heading={"ReactJS Projects"}
                                description={"Learn the basics of React by building fully functional applications."}
                                link={"/projects/reactjs"}
                                icon_link={ReactIcon}
                                extra_details={true} />
                        </div>
                        <div className="p-5">
                            <ResourceCard2
                                heading={"NextJS Projects"}
                                description={"Unlock Next.js potential with innovative and dynamic projects."}
                                link={"/projects/nextjs"}
                                icon_link={NextIcon}
                                extra_details={true} />
                        </div>
                        <div className="p-5">
                            <ResourceCard2
                                heading={"MERN Stack Projects"}
                                description={"Dive into full-stack web development with MongoDB, Express.js, React, and Node.js."}
                                link={"/projects/mern"}
                                icon_link={DBIcon}
                                extra_details={true} />
                        </div>
                        <div className="p-5">
                            <ResourceCard2
                                heading={"Flutter Projects"}
                                description={"Explore cross-platform app development with Flutter's versatility."}
                                link={"/projects/flutter"}
                                icon_link={FlutterIcon}
                                extra_details={true} />
                        </div>
                        <div className="p-5">
                            <ResourceCard2
                                heading={"Machine Learning Projects"}
                                description={"Explore real-world applications, diverse algorithms, and hands-on experiences to master the art of AI."}
                                link={"/projects/ml"}
                                icon_link={PythonIcon}
                                extra_details={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectsPage;