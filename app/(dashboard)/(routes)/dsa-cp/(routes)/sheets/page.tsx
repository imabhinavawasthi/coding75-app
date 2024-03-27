import ProductCard from "@/components/cards/product-card";
import PageHeadersButton from "@/components/page-headers/page-headers-button";
import { BookText, Code2, GitBranch, Monitor, Rocket, ScrollText } from "lucide-react";

const InterviewPreparation = () => {
    return (
        <div >
           <div className="mt-5 lg:container md:container px-3">
           <PageHeadersButton
                    heading="DSA/CP"
                    greenHeading="Sheets"
                    description="Gear up for success by solving specially designed sheets with hand picked problems . Explore our curated repository designed to help you ace interviews with top companies." 
                    />
            <div className="mt-3">
                <div className="grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <ProductCard 
                        icon={Rocket} 
                        title={"Newbie → Specialist CP Sheet"} 
                        description={"Hand Picked Codeforces Problems with Video Editorials"} 
                        href={"/dsa-cp/sheets/specialist-sheet"} 
                        href_text={"Start Solving"}
                        />
                    </div>
                    <div>
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
           </div>
        </div>
    );
}

export default InterviewPreparation;