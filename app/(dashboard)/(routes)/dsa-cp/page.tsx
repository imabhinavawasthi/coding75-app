import ResourceCard2 from "@/components/cards/resource-card-2";
import PageHeaders from "@/components/page-headers/page-headers";
import { BookKeyIcon, Code2Icon, ComputerIcon, GitForkIcon, LayoutListIcon, SearchCodeIcon } from "lucide-react";

const DSACPPage = () => {
    return (
        <div className="">
            <div>
                <PageHeaders
                    greenHeading="DSA & CP"
                    heading="Practice"
                    description="Empower your coding journey with a rich collection of Data Structures and Competitive Programming resources, thoughtfully assembled to guide coding enthusiasts of varying skill levels through their learning journey." 
                />
            </div>
            <div className="container mt-3">
                <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="p-5">
                        <ResourceCard2 
                        heading={"Leetcode POTD Editorials"} 
                        description={"In-depth LeetCode POTD editorials for efficient problem-solving."} 
                        link={"/dsa-cp/leetcode-potd"}
                        icon_link={"https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/leetcode.png"} 
                        extra_details={true} 
                        />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 
                        heading={"Codeforces Contest Editorials"} 
                        description={"Optimize your programming skills with detailed solutions to Codeforces contest problems."} 
                        link={"/dsa-cp/codeforces"}
                        icon_link={"https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/codeforces.svg"} 
                        extra_details={true} 
                        />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 
                        heading={"CodeChef Contest Editorials"} 
                        description={"Optimize your programming skills with detailed solutions to CodeChef contest problems."} 
                        link={"/dsa-cp/codechef"}
                        icon_link={"https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/codechef.png"} 
                        extra_details={true} 
                        />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 heading={"coding75 Beginners DSA Sheet"} 
                        description={"Beginner-friendly DSA sheet with Coding75 for a solid foundation in programming."} 
                        link={"/dsa-cp/dsa-beginner"} 
                        icon_link={"https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/coding75.png"} 
                        extra_details={false} 
                        />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 
                        heading={"Newbie to Specialist CP Sheet"} 
                        description={"Level up your coding journey from newbie to specialist with Coding75's concise CP Sheet."} 
                        link={"/dsa-cp/company-wise-problems"} 
                        icon_link={"https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/coding75.png"} 
                        extra_details={false} 
                        />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 
                        heading={"Important Interview Problems"} 
                        description={"Unlock success in interviews with a curated collection of crucial coding problems."} 
                        link={"/dsa-cp/potd"} 
                        icon_link={"https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/coding75.png"} 
                        extra_details={false} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DSACPPage;