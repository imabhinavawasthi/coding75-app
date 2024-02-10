"use client"

import ProblemCard1 from "@/components/cards/problem-card-1";
import { useEffect, useState } from "react";
import { fetchProblems } from "./(api)/fetchProblems";
import Loading from "@/components/loading";
import PageHeaders from "@/components/page-headers/page-headers";
import { MultiSelect } from "react-multi-select-component";
import { company_tags, topic_tags } from "@/components/constants";
import { ArrowDown, Filter } from "lucide-react";

const DSAProblems = () => {
    const [problem_list, setProblemList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [topic_tag, setTopicTag] = useState([])
    const [company_tag, setCompanyTag] = useState([])
    const [difficulty, setDifficulty] = useState([])
    const [pageCount, setPageCount] = useState(20)

    function resetFilters(e) {
        e.preventDefault()
        setTopicTag([])
        setCompanyTag([])
        setDifficulty([])
    }

    const difficulty_tags_list = [
        {
            label: "Easy",
            value: 0
        },
        {
            label: "Medium",
            value: 1
        },
        {
            label: "Hard",
            value: 2
        },
        {
            label: "Advanced",
            value: 3
        },
    ]

    const company_tags_list = company_tags.map((data) => (
        {
            value: data[0],
            label: data[1],
            link: data[2]
        }
    ))
    const topic_tags_list = topic_tags.map((data) => (
        {
            value: data[0],
            label: data[1]
        }
    ))

    useEffect(() => {
        async function fetchProblemsFun() {
            try {
                const { dsaproblems } = await fetchProblems();
                if(dsaproblems){
                    setProblemList(dsaproblems);
                }
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchProblemsFun();
    }, [])


    return (
        <div className="container">
            <div className="mt-3">
                <PageHeaders
                    heading="Explore DSA and CP Problems 🎯"
                    description="Empower your coding journey with a rich collection of Data Structures and Competitive Programming Problems, with detailed editorials." />
            </div>
            <div className="mt-5">
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 ml-2 mr-2">
                    <details
                        className="rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
                    >
                        <summary
                            className="flex cursor-pointer items-center justify-between bg-white p-2 text-gray-900 transition"
                        >
                            <span className="ml-3 flex text-sm font-medium justify-center"><Filter className="mr-2 w-4 h-4" /> Filter Problems </span>

                            <button
                                onClick={resetFilters}
                            >
                                <span className="text-sm mr-3 flex justify-center hover:underline">
                                    Reset ⤬
                                </span>
                            </button>
                        </summary>
                    </details>
                    <div >
                            <MultiSelect
                                options={company_tags_list}
                                value={company_tag}
                                onChange={setCompanyTag}
                                labelledBy="Select Companies"
                                overrideStrings={{ "selectSomeItems": "Select Companies","allItemsAreSelected":"All companies are selected"}}
                            />
                        </div>
                    <div >
                            <MultiSelect
                                options={topic_tags_list}
                                value={topic_tag}
                                onChange={setTopicTag}
                                labelledBy="Select Topics"
                                overrideStrings={{ "selectSomeItems": "Select Topics","allItemsAreSelected":"All topics are selected"}}
                            />
                        </div>
                        <div >
                                <MultiSelect
                                    options={difficulty_tags_list}
                                    value={difficulty}
                                    onChange={setDifficulty}
                                    labelledBy="Select Difficulty"
                                    overrideStrings={{ "selectSomeItems": "Select Difficulty","allItemsAreSelected":"All Difficulty Levels"}}
                                />
                            </div>
                </div>
            </div>
            <div className="mt-5">
                {!loading ? <>
                    <div className="grid grid-col-1 gap-3">
                        {problem_list.slice(0, pageCount)?.map((problem:any) => (
                            <div key={problem.id}>
                                <ProblemCard1
                                    problem_name={problem.problem_name} platform_name={problem.platform} problem_link={problem.problem_link} topic_tags={problem.topic_tags.map((topic) => (topic.label)).slice(0, 3)} company_tags={problem.company_tags.map((company) => (company.label)).slice(0, 3)} difficulty={problem.difficulty} status="trying" slug_url={problem.slug_url} editorial={problem.editorial} video_editorial={problem.video_editorial} />
                            </div>
                        ))}
                    </div>
                    {pageCount < problem_list.length &&
                        <div className="mt-5 flex justify-center">
                            <button
                                className="flex justify-center whitespace-nowrap rounded-full bg-indigo-100 px-5 py-3 text-indigo-700"
                                onClick={() => { setPageCount(pageCount * 2) }}
                            >
                                Load More Problems <ArrowDown />
                            </button>
                        </div>
                    }
                </> :
                    <>
                        <Loading title="Loading Problems" />
                    </>}
            </div>

        </div>
    );
}

export default DSAProblems;