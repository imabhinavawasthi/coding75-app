import ResourceCard2 from "@/components/cards/resource-card-2";
import PageHeaderTechList from "@/components/page-headers/page-header-projects";
import NextLogo from "../../../(dashboard)/_components/img/next.svg"
import ReactLogo from "../../../(dashboard)/_components/img/react.png"
import PythonLogo from "../../../(dashboard)/_components/img/python.svg.png"
import JSLogo from "../../../(dashboard)/_components/img/js.png"
import DBLogo from "../../../(dashboard)/_components/img/db.png"
import FlutterLogo from "../../../(dashboard)/_components/img/flutter.png"
import type { Metadata } from 'next'
import Feature2 from "../../_components/img/feature2.png"

export const metadata: Metadata = {
    title: 'Project Hub coding75',
    description: 'Explore a variety of coding projects—web development, mobile apps, machine learning, and more. From beginners to experienced coders, find inspiration and hands-on learning in our curated collection. 🚀',
}

const ProjectsPage = () => {
    return (
        <div>
            <PageHeaderTechList/>
            <div className="lg:container px-2">
                <div className="mt-3">
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                        <div className="p-5">
                            <ResourceCard2
                                heading={"Basic Frontend Projects"}
                                description={"Frontend Projects for Beginners with HTML, CSS and Javascript. "}
                                link={"/projects/basicfrontend"}
                                icon={JSLogo} extra_details={true} />
                        </div>
                        <div className="p-5">
                            <ResourceCard2
                                heading={"ReactJS Projects"}
                                description={"Learn the basics of React by building fully functional applications."}
                                link={"/projects/reactjs"}
                                icon={ReactLogo} extra_details={true} />
                        </div>
                        <div className="p-5">
                            <ResourceCard2
                                heading={"NextJS Projects"}
                                description={"Unlock Next.js potential with innovative and dynamic projects."}
                                link={"/projects/nextjs"}
                                icon={NextLogo} extra_details={true} />
                        </div>
                        <div className="p-5">
                            <ResourceCard2
                                heading={"MERN Stack Projects"}
                                description={"Dive into full-stack web development with MongoDB, Express.js, React, and Node.js."}
                                link={"/projects/mern"}
                                icon={DBLogo} extra_details={true} />
                        </div>
                        <div className="p-5">
                            <ResourceCard2
                                heading={"Flutter Projects"}
                                description={"Explore cross-platform app development with Flutter's versatility."}
                                link={"/projects/flutter"}
                                icon={FlutterLogo} extra_details={true} />
                        </div>
                        <div className="p-5">
                            <ResourceCard2
                                heading={"Machine Learning Projects"}
                                description={"Explore real-world applications, diverse algorithms, and hands-on experiences to master the art of AI."}
                                link={"/projects/ml"}
                                icon={PythonLogo} extra_details={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectsPage;