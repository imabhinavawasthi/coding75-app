"use client"

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import PageHeadersButton from "@/components/page-headers/page-headers-button";
import { fetchLeetcodeContest } from "../../../../(api)/leetcode/fetchLeetcodeContest";
import LeetcodeContestsProblemTable from "../../../../_components/leetcode-contests-table";

type Problem = {
    ProblemName: string
    Date: Date
    ProblemLink: string
    TopicTags: string[]
    CompanyTags: string[]
    Status: string
    SlugUrl: string
    Editorial: string
    VideoEditorial: string
    Difficulty: number
    ContestName: string
}

const LeetcodeContests = ({params}) => {
    const [problemList, setProblemList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProblemsFun() {
            try {
                const { dsaproblems } = await fetchLeetcodeContest(params.contestname.replaceAll("%20"," "));
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
                            Date: data?.date,
                            ProblemLink: data?.problem_link,
                            TopicTags: topic_tags,
                            CompanyTags: company_tags,
                            Difficulty: data?.difficulty,
                            Status: "Pending",
                            SlugUrl: data?.slug_url,
                            Editorial: data?.editorial,
                            VideoEditorial: data?.video_editorial,
                            ContestName: data?.contest_name
                        }
                    })
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
                    heading={params.contestname.replaceAll("%20"," ")}
                    description="In-depth Codeforces editorials for efficient problem-solving."
                />
            </div>
            <div className="lg:container md:container mt-10">
                {!loading ?
                    <>
                        <div className="w-full h-full overflow-y-scroll px-5">
                            <LeetcodeContestsProblemTable data={problemList} />
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

export default LeetcodeContests;