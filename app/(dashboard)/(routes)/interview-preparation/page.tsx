import ResourceCard3 from "@/components/cards/resource-card-3";
import PageHeaders from "@/components/page-headers";

const InterviewPreparation = () => {
    return (
        <div className="container">
            <div className="mt-3">
                <PageHeaders
                    heading="Interview Preparation Zone 👨🏻‍💻"
                    description="Gear up for success in tech interviews by honing your skills on topic-specific coding challenges. Explore our curated repository designed to help you ace interviews with top companies." />
            </div>
            <div className="mt-5">
                <h2 className="font-bold text-lg">Here&apos;s all you need for Interview Preparation:-</h2>
            </div>
            <div className="mt-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                        <ResourceCard3 title={"Interview Preparation Guide"} sub_title={"Perfect Guide for Interview Preparation 🔥"} link={"/interview-preparation/guide"} tags={["Roadmap", "Guidance", "Interview Experience"]} />
                    </div>
                    <div>
                        <ResourceCard3 title={"DSA Resources"} sub_title={"Top Interview DSA Problems"} link={"/dsa-cp"} tags={["Problem Sheets", "DSA Guide", "Company Wise Problems"]} />
                    </div>
                    <div>
                        <ResourceCard3 title={"Projects"} sub_title={"Explore a variety of Coding Projects"} link={"/projects"} tags={["Web Development", "MERN Stack", "Andriod", "Machine Learning"]} />
                    </div>
                    <div>
                        <ResourceCard3 title={"Resume Review"} sub_title={"Get Your Resume Reviewed by Our Experts"} link={"/interview-preparation/resume-review"} tags={["1:1 Mentorship", "Resume Review", "ATS Friendly Resume Templates"]} />
                    </div>
                    <div>
                        <ResourceCard3 title={"CS Fundamentals"} sub_title={"Curated Notes and Resources for CS Subjects"} link={"/cs-fundamentals"} tags={["Operating System", "Computer Networks", "DBMS", "OOPs"]} />
                    </div>
                    <div>
                        <ResourceCard3 title={"System Design"} sub_title={"Important System Design Topics for Interviews"} link={"/system-design"} tags={["Low Level Design", "High Level Design", "Interview Questions"]} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default InterviewPreparation;