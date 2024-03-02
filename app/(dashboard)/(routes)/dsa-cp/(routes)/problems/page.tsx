"use client"

import { useEffect, useState } from "react";
import { fetchProblems } from "../../(api)/problem/fetchProblems";
import Loading from "@/components/loading";
import PageHeaders from "@/components/page-headers/page-headers";
import ProblemTable from "../../_components/problem-table";
import PageHeadersButton from "@/components/page-headers/page-headers-button";

type Problem = {
    ProblemName: string
    PlatformName: string
    ProblemLink: string
    TopicTags: string[]
    CompanyTags: string[]
    Status: string
    SlugUrl: string
    Editorial: string
    VideoEditorial: string
    Difficulty: number
}

const DSAProblems = () => {
    const [problemList, setProblemList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProblemsFun() {
            try {
                const { dsaproblems } = await fetchProblems();
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
                            PlatformName: data?.platform,
                            ProblemLink: data?.problem_link,
                            TopicTags: topic_tags,
                            CompanyTags: company_tags,
                            Difficulty: data?.difficulty,
                            Status: "Pending",
                            SlugUrl: data?.slug_url,
                            Editorial: data?.editorial,
                            VideoEditorial: data?.video_editorial
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
                    greenHeading="DSA Problems"
                    heading="Practice"
                    description="Empower your coding journey with a rich collection of DSA Problems, with detailed editorials."
                />
            </div>
            <div className="lg:container md:container mt-10">
                {!loading ?
                    <>
                        <div className="w-full h-full overflow-y-scroll px-5">
                            <ProblemTable data={problemList} />
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

export default DSAProblems;