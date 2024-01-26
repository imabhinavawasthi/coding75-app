import ResourceCard from "@/components/cards/resource-card";
import ResourceCard2 from "@/components/cards/resource-card-2";
import PageHeaders from "@/components/page-headers/page-headers";
import { BinaryIcon, BookKeyIcon, Code2Icon, ComputerIcon, GitForkIcon, SearchCodeIcon } from "lucide-react";

const Sheets = () => {
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
                            <ResourceCard heading={"Coding 75 DSA Sheet"} description={"Our curated sheet of most asked 75 DSA problems with detailed editorials."} link={"/dsa-cp/sheets/coding75"} sub_title={"Best for Interview Preparation 🔥"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard heading={"200 DSA Beginner Questions"} description={"List of DSA problems selected specifically for beginners to learn new patterns."} link={"/dsa-cp/200-dsa-beginner"} sub_title={"Beginner Friendly 📈"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard heading={"Top DSA Interview Questions"} description={"List of questions asked in interviews of top tech companies."} link={"/dsa-cp/sheets/top-dsa-interview"} sub_title={"Get Placement Ready 🚀"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard heading={"150 Codeforces Beginner Problems"} description={"List of problems for someone starting competitive programming."} link={"/dsa-cp/sheets/cp-beginner"} sub_title={"Master Competitive Programming 🎯"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard heading={"Complete DSA Problem Sheet"} description={"Curated list of DSA problems from beginner to advanced level."} link={"/dsa-cp/sheets/complete-dsa"} sub_title={"Recently Updated"}  />
                        </div>
                        <div className="p-5">
                            <ResourceCard heading={"Top FAANG Problem List"} description={"Solve problems asked in companies like Google, Amazon, Microsoft etc."} link={"/dsa-cp/sheets/top-faang"} sub_title={"Crack FAANG 🔥"}  />
                        </div>
                    </div>
                </div>
        </div>
     );
}
 
export default Sheets;