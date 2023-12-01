import ProblemCard1 from "@/components/cards/problem-card-1";

const ResourcePage = (params: any) => {
    return (
        <div className="container">
            <div className="m-5">
                {params.params.resource}
            </div>
            <div className="grid grid-col-1 gap-3">
                <div>
                    <ProblemCard1 problem_name="House Robber" platform_name="Leetcode" problem_link="https://leetcode.com/problems/house-robber/" topic_tags={["Greedy", "Sorting", "Dynamic Programming", "Bit Manipulation"]} difficulty="Medium" status="solved" />
                </div>
                <div>
                    <ProblemCard1 problem_name="House Robber" platform_name="Leetcode" problem_link="https://leetcode.com/problems/house-robber/" topic_tags={["Greedy", "Sorting", "Dynamic Programming", "Bit Manipulation"]} difficulty="Easy" status="save" />
                </div>
                <div>
                    <ProblemCard1 problem_name="House Robber" platform_name="Leetcode" problem_link="https://leetcode.com/problems/house-robber/" topic_tags={["Greedy", "Sorting", "Dynamic Programming", "Bit Manipulation"]} difficulty="Hard" status="unsolved" />
                </div>
                <div>
                    <ProblemCard1 problem_name="House Robber" platform_name="Leetcode" problem_link="https://leetcode.com/problems/house-robber/" topic_tags={["Greedy", "Sorting", "Dynamic Programming", "Bit Manipulation"]} difficulty="Easy" status="trying" />
                </div>
                <div>
                    <ProblemCard1 problem_name="House Robber" platform_name="Leetcode" problem_link="https://leetcode.com/problems/house-robber/" topic_tags={["Greedy", "Sorting", "Dynamic Programming", "Bit Manipulation"]} difficulty="Easy" status="solved" />
                </div>
                <div>
                    <ProblemCard1 problem_name="House Robber" platform_name="Leetcode" problem_link="https://leetcode.com/problems/house-robber/" topic_tags={["Greedy", "Sorting", "Dynamic Programming", "Bit Manipulation"]} difficulty="Easy" status="solved" />
                </div>
            </div>
        </div>
    );
}

export default ResourcePage;