"use client"

import ProblemCard1 from "@/components/cards/problem-card-1";
import { useEffect, useState } from "react";
import { fetchProblems } from "./(api)/fetchProblems";
import Loading from "@/components/loading";
import PageHeaders from "@/components/page-headers";
import { MultiSelect } from "react-multi-select-component";
import { company_tags, topic_tags } from "@/components/constants";
import { ChevronDown, Filter } from "lucide-react";

const DSAProblems = () => {
    const [problem_list, setProblemList] = useState([])
    const [loading, setLoading] = useState(true)
    const [topic_tag, setTopicTag] = useState([])
    const [company_tag, setCompanyTag] = useState([])
    const [difficulty, setDifficulty] = useState("0")
    const [complete_problem_list, setCompleteProblemList] = useState([])

    function resetFilters(e) {
        e.preventDefault()
        setTopicTag([])
        setCompanyTag([])
        setDifficulty("0")
    }

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
                setProblemList(problem_list);
                setCompleteProblemList(dsaproblems);
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchProblemsFun();
    }, [])

    useEffect(() => {
        setLoading(true)
        setProblemList(complete_problem_list)
        if (topic_tag.length > 0) {
            setProblemList(problem_list.filter(function (problem) {
                let ok = false
                problem.topic_tags.map((value) => (
                    ok ||= topic_tag.includes(value.label)
                ))
                return ok
            }))
        }
        setLoading(false)
    }, [problem_list,complete_problem_list,topic_tag, company_tag, difficulty])

    return (
        <div className="container">
            <div className="mt-3">
                <PageHeaders
                    heading="Explore DSA and CP Problems 🎯"
                    description="Empower your coding journey with a rich collection of Data Structures and Competitive Programming Problems, with detailed editorials." />
            </div>
            <div className="mt-5">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-3 ml-2 mr-2">
                    <details
                        className="hidden lg:block rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
                    >
                        <summary
                            className="flex cursor-pointer items-center justify-between bg-white p-4 text-gray-900 transition"
                        >
                            <span className="flex text-sm font-medium justify-center"><Filter className="mr-2 w-4 h-4" /> Filter Problems </span>

                            <button
                                onClick={resetFilters}
                            >
                                <span className="text-sm flex justify-center hover:underline">
                                    Reset ⤬
                                </span>
                            </button>
                        </summary>
                    </details>
                    <details
                        className="rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
                    >
                        <summary
                            className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"
                        >
                            <span className="text-sm font-medium"> Companies </span>

                            <span className="transition group-open:-rotate-180">
                                <ChevronDown
                                    strokeWidth={1.5}
                                    className="h-4 w-4"
                                />
                            </span>
                        </summary>

                        <div className="border-t border-gray-200 bg-white p-2">
                            <MultiSelect
                                options={company_tags_list}
                                value={company_tag}
                                onChange={setCompanyTag}
                                labelledBy="Select Companies"
                            />
                        </div>
                    </details>
                    <details
                        className="rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
                    >
                        <summary
                            className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"
                        >
                            <span className="text-sm font-medium"> Topics </span>

                            <span className="transition group-open:-rotate-180">
                                <ChevronDown
                                    strokeWidth={1.5}
                                    className="h-4 w-4"
                                />
                            </span>
                        </summary>

                        <div className="border-t border-gray-200 bg-white p-2">
                            <MultiSelect
                                options={topic_tags_list}
                                value={topic_tag}
                                onChange={setTopicTag}
                                labelledBy="Select Topics"
                            />
                        </div>
                    </details>
                    <details
                        className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
                    >
                        <summary
                            className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"
                        >
                            <span className="text-sm font-medium"> Difficulty </span>

                            <span className="transition group-open:-rotate-180">
                                <ChevronDown
                                    strokeWidth={1.5}
                                    className="h-4 w-4"
                                />
                            </span>
                        </summary>

                        <div className="border-t border-gray-200 bg-white">
                            <div className="border-t border-gray-200 p-2">
                                <select
                                    onChange={(e) => { setDifficulty(e.target.value) }}
                                    id="currency"
                                    name="currency"
                                    className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required>
                                    <option value={-1}>All</option>
                                    <option value={0}>Easy</option>
                                    <option value={1}>Medium</option>
                                    <option value={2}>Hard</option>
                                    <option value={3}>Advanced</option>
                                </select>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
            <div className="mt-5">
                {!loading ? <>
                    <div className="grid grid-col-1 gap-3">
                        {problem_list?.map((problem) => (
                            <div key={problem.id}>
                                <ProblemCard1
                                    problem_name={problem.problem_name} platform_name={problem.platform} problem_link={problem.problem_link} topic_tags={problem.topic_tags.map((topic) => (topic.label)).slice(0, 3)} company_tags={problem.company_tags.map((company) => (company.label)).slice(0, 3)} difficulty={problem.difficulty} status="trying" slug_url={problem.slug_url} editorial={problem.editorial} video_editorial={problem.video_editorial} />
                            </div>
                        ))}
                    </div>
                </> :
                    <>
                        <Loading title="Loading Problems" />
                    </>}
            </div>

        </div>
    );
}

export default DSAProblems;