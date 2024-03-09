"use client"

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import PageHeadersButton from "@/components/page-headers/page-headers-button";
import LeetcodeContestsProblemTable from "../../_components/leetcode-contests-table";
import { fetchLeetcodeContestProblems } from "../../(api)/leetcode/fetchLeetcodeContestsProblems";
import router from "next/navigation";
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from "next/navigation";
import { CaretSortIcon } from "@radix-ui/react-icons";

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

const LeetcodeContests = () => {
    const router = useRouter()
    const [problemList, setProblemList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uniqueContests, setUniqueContests] = useState<any>();
    const [open, setOpen] = useState(false)

    useEffect(() => {
        async function fetchProblemsFun() {
            try {
                const { dsaproblems } = await fetchLeetcodeContestProblems();
                const uniqueContestsSet = new Set(dsaproblems?.map(item => item.contest_name));
                    const uniqueContestsArray = Array.from(uniqueContestsSet);
                    const allContests = uniqueContestsArray?.map((data: any) => {
                        return {
                            value: data,
                            label: data
                        }
                    })
                    setUniqueContests(allContests)
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
                    heading="Leetcode Contest"
                    description="In-depth LeetCode Contest editorials for efficient problem-solving."
                />
            </div>
            <div className="lg:container md:container mt-10">
                {!loading ?
                    <>
                    <div className="w-full px-5 mb-5">
                            <p className="font-bold text-lg mb-3">Select Contest:</p>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger className="w-full" asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="justify-between w-full"
                                    >
                                        {"Select Contest"}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-full">
                                    <Command className="w-full">
                                        <CommandInput placeholder="Search Contest..." className="h-9 w-full" />
                                        <CommandEmpty>No Contest found.</CommandEmpty>
                                        <CommandGroup className="w-full">
                                            {uniqueContests.map((contest) => (
                                                <CommandItem
                                                    className="w-full"
                                                    key={contest.value}
                                                    value={contest.value}
                                                    onSelect={(currentValue) => {
                                                        router.push(`/dsa-cp/leetcode-contests/contest/${contest.label}`)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    {contest.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
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