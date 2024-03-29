"use client"

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import PageHeadersButton from "@/components/page-headers/page-headers-button";
import CodeforcesProblemTable from "../../_components/codeforces-table";
import { fetchCodeforcesProblems } from "../../(api)/codeforces/fetchCodeforcesProblems";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
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
    const [uniqueContests, setUniqueContests] = useState<any>();
    const [open, setOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        async function fetchProblemsFun() {
            try {
                const { dsaproblems } = await fetchCodeforcesProblems();
                if (dsaproblems) {
                    dsaproblems.sort((a, b) => {
                        return extractSubmissionNumber(b?.solution_link) - extractSubmissionNumber(a?.solution_link);
                    });
                    const uniqueContestsSet = new Set(dsaproblems.map(item => item.contest));
                    const uniqueContestsArray = Array.from(uniqueContestsSet);
                    const allContests = uniqueContestsArray?.map((data: any) => {
                        return {
                            value: data,
                            label: data
                        }
                    })
                    setUniqueContests(allContests)
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
                                                        router.push(`/dsa-cp/codeforces/contest/${contest.label}`)
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
                            <p className="font-bold text-lg">All Problems:</p>
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