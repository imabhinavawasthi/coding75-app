import ProductCard from "@/components/cards/product-card";
import ResourceCard2 from "@/components/cards/resource-card-2";
import PageHeaders from "@/components/page-headers/page-headers";
import { Code2, Rocket } from "lucide-react";
import FeaturePic from "../../../../public/images/dsa-cp-feature.png"
import CodeforcesLogo from "../../../../public/logos/codeforces.svg"
import CodechefLogo from "../../../../public/logos/codechef.png"
import LeetcodeLogo from "../../../../public/logos/leetcode.png"

const DSACPPage = () => {
    return (
        <div className="">
            <div>
                <PageHeaders
                    greenHeading="DSA & CP"
                    heading="Practice"
                    description="Empower your coding journey with a rich collection of Data Structures and Competitive Programming resources, thoughtfully assembled to guide coding enthusiasts of varying skill levels through their learning journey."
                    image={FeaturePic}
                />
            </div>
            <div className="mt-3 lg:container md:container px-3">
                <div className="grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-5">
                        <ProductCard
                            icon={Code2}
                            title={"DSA & CP Sheets"}
                            description={"Explore all DSA & CP Sheets by coding75"}
                            href={"/dsa-cp/sheets"}
                        />
                    </div>
                    <div className="p-5">
                        <ProductCard
                            icon={Rocket}
                            title={"Newbie → Expert CP Sheet"}
                            description={"Hand Picked Codeforces Problems with Video Editorials"}
                            href={"/dsa-cp/sheets/expert-sheet"}
                            href_text={"Start Solving"}
                        />
                    </div>
                    <div className="p-5">
                        <ProductCard
                            icon={Code2}
                            title={"Interview Sheet"}
                            description={"Most asked questions in Interviews of Top Tech Companies"}
                            href={""}
                            href_text={"We are building this sheet."}
                        />
                    </div>
                </div>
            </div>
            <div className="lg:container md:container px-3 mt-3">
                <div className="grid lg:grid-cols-2 grid-cols-1">
                    <div className="p-5">
                        <ResourceCard2
                            heading={"Leetcode POTD Editorials"}
                            description={"In-depth LeetCode POTD editorials for efficient problem-solving."}
                            link={"/dsa-cp/leetcode-potd"}
                            icon_link={LeetcodeLogo}
                            extra_details={true}
                        />
                    </div>
                    <div className="p-5">
                        <ResourceCard2
                            heading={"Codeforces Contest Editorials"}
                            description={"Optimize your programming skills with detailed solutions to Codeforces contest problems."}
                            link={"/dsa-cp/codeforces"}
                            icon_link={CodeforcesLogo}
                            extra_details={true}
                        />
                    </div>
                    <div className="p-5">
                        <ResourceCard2
                            heading={"CodeChef Contest Editorials"}
                            description={"Optimize your programming skills with detailed solutions to CodeChef contest problems."}
                            link={"/dsa-cp/codechef"}
                            icon_link={CodechefLogo}
                            extra_details={true}
                        />
                    </div>
                    <div className="p-5">
                        <ResourceCard2
                            heading={"Leetcode Contest Editorials"}
                            description={"In-depth LeetCode Contest editorials for efficient problem-solving."}
                            link={"/dsa-cp/leetcode-contests"}
                            icon_link={LeetcodeLogo}
                            extra_details={true}
                        />
                    </div>
                    {/* <div className="p-5">
                        <ResourceCard2 
                        heading={"Newbie to Specialist CP Sheet"} 
                        description={"Level up your coding journey from newbie to specialist with Coding75's concise CP Sheet."} 
                        link={"/dsa-cp/cp-specialist-sheet"} 
                        icon_link={"https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/dsa-sheets.png"} 
                        extra_details={false} 
                        />
                    </div>
                    <div className="p-5">
                        <ResourceCard2 
                        heading={"Important Interview Problems"} 
                        description={"Unlock success in interviews with a curated collection of crucial coding problems."} 
                        link={"/dsa-cp/interview-sheet"} 
                        icon_link={"https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/icons/dsa-sheets.png"} 
                        extra_details={false} />
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default DSACPPage;