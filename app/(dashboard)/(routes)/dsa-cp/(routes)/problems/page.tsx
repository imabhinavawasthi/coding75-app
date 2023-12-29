"use client"

import ProblemCard1 from "@/components/cards/problem-card-1";
import { useEffect, useState } from "react";
import { fetchProblems } from "./(api)/fetchProblems";
import Loading from "@/components/loading";

const DSAProblems = () => {
    const [problem_list, setProblemList] = useState([])
    const [loading,setLoading] = useState(true)
    useEffect(() => {
        async function fetchProblemsFun() {
            try {
                const { dsaproblems } = await fetchProblems();
                setProblemList(dsaproblems);
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchProblemsFun();
    }, [])

    return (
        <div className="container">
            <div className="m-5">
                Problem List
            </div>
            {!loading?<>
                <div className="grid grid-col-1 gap-3">
                {problem_list?.map((problem) => (
                    <div key={problem.id}>
                        <ProblemCard1 
                        problem_name={problem.problem_name} platform_name={problem.platform} problem_link={problem.problem_link} topic_tags={problem.topic_tags.map((topic)=>(topic.label)).slice(0, 3)} company_tags={problem.company_tags.map((company)=>(company.label)).slice(0, 3)} difficulty={problem.difficulty} status="trying" slug_url={problem.slug_url} />
                    </div>
                ))}
            </div>
            </>:
            <>
            <Loading title="Loading Problems"/>
            </>}
            
        </div>
    );
}

export default DSAProblems;