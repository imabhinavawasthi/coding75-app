"use client"

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import PageHeadersButton from "@/components/page-headers/page-headers-button";
import CodeforcesProblemTable from "../../_components/codeforces-table";
import { fetchCodeforcesProblems } from "../../(api)/fetchCodeforcesProblems";

type Problem = {
    ProblemName: string
    Submission: number
    Contest: String
    ProblemLink: string
    TopicTags: string[]
    CompanyTags: string[]
    Status: string
    SlugUrl: string
    Editorial: string
    VideoEditorial: string
    Difficulty: number
}

function extractSubmissionNumber(link) {
    const regex = /\/submission\/(\d+)/;
    
    const match = link.match(regex);
    
    return match ? match[1] : 0;
  }

const CodeforcesProblems = () => {
    const [problemList, setProblemList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProblemsFun() {
            try {
                const { dsaproblems } = await fetchCodeforcesProblems();
                if (dsaproblems) {
                    const problems_list: Problem[] = dsaproblems.map((data: any) => {
                        let topic_tags = []
                        if (data?.topic_tags) {
                            topic_tags = data?.topic_tags?.map((topic) => (topic.label)).slice(0, 3)
                        }
                        let company_tags = []
                        if (data?.company_tags) {
                            company_tags = data?.company_tags?.map((company) => (company.label)).slice(0, 3)
                        }
                        return {
                            ProblemName: data?.problem_name,
                            Contest: data?.contest,
                            ProblemLink: data?.problem_link,
                            TopicTags: topic_tags,
                            CompanyTags: company_tags,
                            Submission: extractSubmissionNumber(data?.solution_link),
                            Difficulty: data?.difficulty,
                            Status: "Pending",
                            SlugUrl: data?.slug_url,
                            Editorial: data?.editorial,
                            VideoEditorial: data?.video_editorial
                        }
                    })
                    problems_list.sort((a, b) => {
                        return b.Submission - a.Submission;
                      });
                    setProblemList(problems_list);
                }
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchProblemsFun();
    }, [])


    return (
        <div className="">
            <div>
                <PageHeadersButton
                    greenHeading=" Editorials"
                    heading="Codeforces"
                    description="In-depth Codeforces editorials for efficient problem-solving."
                />
            </div>
            <div className="lg:container md:container mt-10">
                {!loading ?
                    <>
                        <div className="w-full h-full overflow-y-scroll px-5">
                            <CodeforcesProblemTable data={problemList} />
                        </div>
                    </>
                    :
                    <>
                        <Loading title="Loading Problems" />
                    </>
                }
            </div>
        </div>
    );
}

export default CodeforcesProblems;