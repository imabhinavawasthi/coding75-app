import ResourceCard2 from "@/components/cards/resource-card-2";
import PageHeaders from "@/components/page-headers/page-headers";
import { BookKeyIcon, Code2Icon, ComputerIcon, GitForkIcon, LayoutListIcon, SearchCodeIcon } from "lucide-react";

const DSACPPage = () => {
    return (
        <div className="">
            <div className="mt-3">
                <PageHeaders
                    greenHeading="DSA & CP"
                    heading="Practice"
                    description="Empower your coding journey with a rich collection of Data Structures and Competitive Programming resources, thoughtfully assembled to guide coding enthusiasts of varying skill levels through their learning journey." 
                />
            </div>
            <div className="container mt-3">
                <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="p-5">
                        <ResourceCard2 heading={"Complete DSA Course"} description={"Complete list of resources for all Data Structures and Algorithms topics"} link={"/dsa-cp/complete-dsa-course"} icon={<LayoutListIcon className="text-indigo-500 h-8 w-8" />} extra_details={true} />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 heading={"Competitive Programming Hub"} description={"Explore complete list of competitive programming resources."} link={"/dsa-cp/cp-hub"} icon={<BookKeyIcon className="text-indigo-500 h-8 w-8" />} extra_details={true} />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 heading={"DSA CP Problem Sheets"} description={"Our curated problem sheets with top interview problems."} link={"/dsa-cp/sheets"} icon={<Code2Icon className="text-indigo-500 h-8 w-8" />} extra_details={false} />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 heading={"Company Wise Problems"} description={"Problems asked in top tech companies like Google, Amazon, Microsoft etc."} link={"/dsa-cp/company-wise-problems"} icon={<SearchCodeIcon className="text-indigo-500 h-8 w-8" />} extra_details={false} />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 heading={"Topicwise Problems"} description={"Important and common problems covering DSA and CP topics"} link={"/dsa-cp/topic-wise-problems"} icon={<GitForkIcon className="text-indigo-500 h-8 w-8" />} extra_details={false} />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 heading={"Today's Problem"} description={"Solve a new challenging problem everyday with dedicated editorials and solutions to help."} link={"/dsa-cp/potd"} icon={<ComputerIcon className="text-indigo-500 h-8 w-8" />} extra_details={false} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DSACPPage;