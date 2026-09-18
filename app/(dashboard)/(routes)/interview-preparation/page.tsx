import ProductCard from "@/components/cards/product-card";
import ResourceCard3 from "@/components/cards/resource-card-3";
import PremiumPageHeader from "@/components/page-headers/premium-page-header";
import { BookText, Code2, GitBranch, Monitor, Rocket, ScrollText } from "lucide-react";

const InterviewPreparation = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
            <PremiumPageHeader
                title={<span>Interview <span className="text-primary">Preparation</span></span>}
                subtitle="Gear up for success in tech interviews by honing your skills on topic-specific coding challenges. Explore our curated repository designed to help you ace interviews with top companies."
            />

            <div className="mt-4">
                <div className="grid h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <ProductCard icon={Rocket} title={"DSA Resources"} description={"Top Interview DSA Problems"} href={"/dsa"} tags={["Problem Sheets", "DSA Guide", "Company Wise Problems"]} />
                    </div>
                    <div>
                        <ProductCard icon={Code2} title={"Projects"} description={"Explore a variety of Coding Projects"} href={"/projects"} tags={["Web Development", "MERN Stack", "Android", "Machine Learning"]} />
                    </div>
                    <div>
                        <ProductCard icon={ScrollText} title={"Resume Builder & Review"} description={"Create ATS Friendly Resumes & Get It Reviewed by Our Experts"} href={"/resume"} tags={["1:1 Mentorship", "Resume Review", "ATS Friendly Resume Templates"]} />
                    </div>
                    <div>
                        <ProductCard icon={Monitor} title={"CS Fundamentals"} description={"Curated Notes and Resources for CS Subjects"} href={"/cs-fundamentals"} tags={["Operating System", "Computer Networks", "DBMS", "OOPs"]} />
                    </div>
                    <div>
                        <ProductCard icon={BookText} title={"Interview Preparation Guide"} description={"Perfect Guide for Interview Preparation 🔥"} href={"/interview-preparation/guide"} tags={["Roadmap", "Guidance", "Interview Experience"]} />
                    </div>
                    <div>
                        <ProductCard icon={GitBranch} title={"System Design"} description={"Important System Design Topics for Interviews"} href={"/system-design"} tags={["Low Level Design", "High Level Design", "Interview Questions"]} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterviewPreparation;