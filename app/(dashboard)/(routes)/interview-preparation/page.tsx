import ProductCard from "@/components/cards/product-card";
import ResourceCard3 from "@/components/cards/resource-card-3";
import PageHeadersButton from "@/components/page-headers/page-headers-button";
import { BookText, Code2, GitBranch, Monitor, Rocket, ScrollText } from "lucide-react";

const InterviewPreparation = () => {
    return (
        <div >
                
           <div className="mt-5 lg:container md:container px-3">
           <PageHeadersButton
                    heading="Interview"
                    greenHeading="Preparation"
                    description="Gear up for success in tech interviews by honing your skills on topic-specific coding challenges. Explore our curated repository designed to help you ace interviews with top companies." 
                    />
            <div className="mt-3">
                <div className="grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                        <ProductCard icon={BookText} title={"Interview Preparation Guide"} description={"Perfect Guide for Interview Preparation 🔥"} href={"/interview-preparation/guide"} tags={["Roadmap", "Guidance", "Interview Experience"]} />
                    </div>
                    <div>
                        <ProductCard icon={Rocket} title={"DSA Resources"} description={"Top Interview DSA Problems"} href={"/dsa-cp"} tags={["Problem Sheets", "DSA Guide", "Company Wise Problems"]} />
                    </div>
                    <div>
                        <ProductCard icon={Code2} title={"Projects"} description={"Explore a variety of Coding Projects"} href={"/projects"} tags={["Web Development", "MERN Stack", "Andriod", "Machine Learning"]} />
                    </div>
                    <div>
                        <ProductCard icon={ScrollText} title={"Resume Builder & Review"} description={"Create ATS Friendly Resumes & Get It Reviewed by Our Experts"} href={"/resume"} tags={["1:1 Mentorship", "Resume Review", "ATS Friendly Resume Templates"]} />
                    </div>
                    <div>
                        <ProductCard icon={Monitor} title={"CS Fundamentals"} description={"Curated Notes and Resources for CS Subjects"} href={"/cs-fundamentals"} tags={["Operating System", "Computer Networks", "DBMS", "OOPs"]} />
                    </div>
                    <div>
                        <ProductCard icon={GitBranch} title={"System Design"} description={"Important System Design Topics for Interviews"} href={"/system-design"} tags={["Low Level Design", "High Level Design", "Interview Questions"]} />
                    </div>
                </div>
            </div>
           </div>

        </div>
    );
}

export default InterviewPreparation;