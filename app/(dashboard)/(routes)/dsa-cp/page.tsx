import ResourceCard2 from "@/components/cards/resource-card-2";
import PageHeaders from "@/components/page-headers";
import { BookKeyIcon, Code2Icon, ComputerIcon, FunctionSquareIcon, GitForkIcon, SearchCodeIcon } from "lucide-react";

const DSACPPage = () => {
    return ( 
        <div className="container">
            <div className="mt-3">
                <PageHeaders
                    heading="Explore DSA and CP Resources 🎯"
                    description="Empower your coding journey with a rich collection of Data Structures and Competitive Programming resources, thoughtfully assembled to guide coding enthusiasts of varying skill levels through their learning journey." />
            </div>
            <div className="mt-3">
                    <div className="grid lg:grid-cols-2 grid-cols-1">
                        <div className="p-5">
                            <ResourceCard2 heading={"100 DSA Beginner Questions"} description={"Frontend Projects for Beginners with HTML, CSS and Javascript. "} link={"/dsa-cp/basicfrontend"} icon={<Code2Icon className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard2 heading={"Top DSA Interview Questions"} description={"Learn the basics of React by building fully functional applications."} link={"/dsa-cp/reactjs"} icon={<SearchCodeIcon className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard2 heading={"100 Codeforces Beginner Problems"} description={"Dive into full-stack web development with MongoDB, Express.js, React, and Node.js."} link={"/dsa-cp/mern"} icon={<GitForkIcon className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard2 heading={"Complete DSA Problem Sheet"} description={"Explore cross-platform app development with Flutter's versatility."} link={"/dsa-cp/flutter"} icon={<ComputerIcon className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard2 heading={"Top FAANG Problem List"} description={"Explore real-world applications, diverse algorithms, and hands-on experiences to master the art of AI."} link={"/dsa-cp/flutter"} icon={<BookKeyIcon className="text-indigo-500 h-8 w-8"/>} extra_details={true} trending_tag={"Recently Updated"}  />
                        </div>
                    </div>
                </div>
        </div>
     );
}
 
export default DSACPPage;