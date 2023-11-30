import ResourceCard2 from "@/components/cards/resource-card-2";
import Footer from "@/components/footer";
import PageHeaders from "@/components/page-headers";
import { CloudCogIcon, Code2Icon, ComputerIcon, FileJson2, FileJson2Icon, FileJsonIcon, LayoutDashboardIcon, LucideCode2 } from "lucide-react";

const ProjectsPage = () => {
    return (
        <div>
            <div className="container">
                <div className="mt-3">
                    <PageHeaders heading="Projects Hub 🔥: Explore, Learn, Create 🚀" description="Explore a variety of coding projects—web development, mobile apps, machine learning, and more. From beginners to experienced coders, find inspiration and hands-on learning in our curated collection. 🚀" b1text="Button" b1link={undefined}/>
                </div>
                <div className="mt-3">
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                        <div className="p-5">
                            <ResourceCard2 heading={"Basic Frontend Projects"} description={"Frontend Projects for Beginners with HTML, CSS and Javascript. "} link={"/projects/basicfrontend"} icon={<LayoutDashboardIcon className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard2 heading={"ReactJS Projects"} description={"Learn the basics of React by building fully functional applications."} link={"/projects/reactjs"} icon={<FileJson2Icon className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard2 heading={"NextJS Projects"} description={"Unlock Next.js potential with innovative and dynamic projects."} link={"/projects/nextjs"} icon={<FileJsonIcon className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard2 heading={"MERN Stack Projects"} description={"Dive into full-stack web development with MongoDB, Express.js, React, and Node.js."} link={"/projects/mern"} icon={<CloudCogIcon className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard2 heading={"Flutter Projects"} description={"Explore cross-platform app development with Flutter's versatility."} link={"/projects/flutter"} icon={<ComputerIcon className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard2 heading={"Machine Learning Projects"} description={"Explore real-world applications, diverse algorithms, and hands-on experiences to master the art of AI."} link={"/projects/flutter"} icon={<LucideCode2 className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectsPage;