"use client"

import ErrorBanner from "@/app/(dashboard)/_components/banners/error-banner";
import LoginRequiredPage from "@/app/(dashboard)/_components/components/login-required";
import Loading from "@/components/loading";
import supabase from "@/supabase";
import { Fullscreen, Rocket, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchSheet } from "../../../(api)/sheets/fetchSheet";
import CPSheetTable from "../../../_components/cp-sheet-table";
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


interface statusType {
    getUser: "loading" | "error" | "done";
    getSheetData: "pending" | "loading" | "error" | "done";
}

interface ProblemType {
    id: any;
    ProblemName: string
    Submission: string
    ProblemLink: string
    TopicTags: string[]
    Status: string
    Bookmark: boolean
    VideoEditorial: string
    Difficulty: number
}

interface ProblemStatusType {
    Bookmark: any,
    Revise: any,
    Trying: any,
    Pending: any,
    Solved: any
}

const Sheet = (params) => {
    const [user, setUser] = useState<any>(null)
    const [fullScreen, setFullScreen] = useState(false)
    const [refresh, setRefresh] = useState(0)
    const [difficulty, setDifficulty] = useState<number>(0)
    const [difficultyMax, setDifficultyMax] = useState<number>(0)
    const [problemStatus, setProblemStatus] = useState<ProblemStatusType>({
        Bookmark: [""],
        Revise: [""],
        Trying: [""],
        Pending: [""],
        Solved: [""]
    })
    const [sheetDetails, setSheetDetails] = useState<any>({
        sheetName: undefined,
        sheetDescription: undefined
    })
    const [status, setStatus] = useState<statusType>({
        getUser: "loading",
        getSheetData: "pending"
    })
    const [problems, setProblems] = useState<ProblemType[]>([])

    async function initialiseUser(email) {
        let { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_email', email)

        if (error) {
            console.log(error);
        }
        else {
            if (users && users?.length == 0) {
                const { data, error } = await supabase
                    .from('users')
                    .insert([
                        { 'user_email': email },
                    ])
                    .select()
                if (error) {
                    console.log(error);
                }

            }
            else if (users && users?.length >= 0) {
                console.log(users[0]);
                setProblemStatus({
                    ...problemStatus,
                    Bookmark: users[0]?.bookmarked_problems,
                    Revise: users[0]?.revise_problems,
                    Trying: users[0]?.trying_problems,
                    Pending: users[0]?.pending_problems,
                    Solved: users[0]?.solved_problems
                })
                fetchSheetProblems({
                    ...problemStatus,
                    Bookmark: users[0]?.bookmarked_problems,
                    Revise: users[0]?.revise_problems,
                    Trying: users[0]?.trying_problems,
                    Pending: users[0]?.pending_problems,
                    Solved: users[0]?.solved_problems
                })
                return;
            }
        }
        fetchSheetProblems(problemStatus)
    }

    async function fetchSheetProblems(problemStatus) {
        setStatus({
            ...status,
            getSheetData: "loading"
        })
        try {
            const { dsaproblems } = await fetchSheet();
            if (dsaproblems) {
                setSheetDetails({
                    sheetName: dsaproblems?.[0]?.sheet_title,
                    sheetDescription: dsaproblems?.[0]?.sheet_description
                })
                const problems_list: ProblemType[] = dsaproblems.map((data: any) => {
                    if (difficulty != 0 && (data?.difficulty>difficultyMax||data?.difficulty<difficulty)) return {
                        id: null,
                        ProblemName: "null",
                        Submission: "null",
                        ProblemLink: "null",
                        TopicTags: [],
                        Difficulty: 0,
                        Status: "null",
                        Bookmark: false,
                        VideoEditorial: "null"
                    }
                    let topic_tags = []
                    if (data?.topic_tags) {
                        topic_tags = data?.topic_tags?.map((topic) => (topic.label)).slice(0, 3)
                    }

                    function getStatus(link): string {
                        if (problemStatus?.Solved.includes(data?.problem_link))
                            return "Solved"
                        if (problemStatus?.Revise.includes(data?.problem_link))
                            return "Revise"
                        if (problemStatus?.Trying.includes(data?.problem_link))
                            return "Trying"

                        return "Pending"
                    }

                    return {
                        id: data?.id,
                        ProblemName: data?.problem_name,
                        Submission: data?.code_link,
                        ProblemLink: data?.problem_link,
                        TopicTags: topic_tags,
                        Difficulty: data?.difficulty,
                        Status: getStatus(data?.problem_link),
                        Bookmark: problemStatus?.Bookmark.includes(data?.problem_link),
                        VideoEditorial: data?.video_link
                    }
                }).filter((data) => { if (data?.id) return true })
                setProblems(problems_list);
                setStatus({
                    ...status,
                    getSheetData: "done",
                    getUser: "done"
                })
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setStatus({
                ...status,
                getSheetData: "error"
            })
        }
    }

    async function checkUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error && error?.status != 401) {
                setStatus({
                    ...status,
                    getUser: "error"
                })
            }
            else {
                if (data.user) {
                    setUser(data.user)
                    await initialiseUser(data?.user?.email)
                    setStatus({
                        ...status,
                        getUser: "done"
                    })
                }
                else {
                    setUser(null)
                    setStatus({
                        ...status,
                        getUser: "done"
                    })
                }
            }
        }
        catch {
            setStatus({
                ...status,
                getUser: "error"
            })
        }
    }
    useEffect(() => {
        checkUser()
        setTimeout(() => {
            setRefresh(refresh+1)
        }, 1000);
    }, [])

    useEffect(() => {
        fetchSheetProblems(problemStatus)
    }, [difficulty, refresh, problemStatus])

    return (
        <div>
            {
                !fullScreen &&
                <Breadcrumb className="md:container my-5 text-sm px-5">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dsa-cp">DSA & CP</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dsa-cp/sheets">Sheets</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{sheetDetails.sheetName || "DSA & CP Sheets"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            }
            {
                !fullScreen &&
                <div className="md:container px-5">
                    <div className="bg-blue-50 mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div className="text-center sm:text-left">
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    {sheetDetails.sheetName || "DSA & CP Sheets"}
                                </h1>
                                <p className="mt-1.5 text-sm text-gray-500">
                                    {sheetDetails.sheetDescription || "Let's start today's learning, Happy Coding!"}  🚀
                                </p>
                            </div>
                            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                                <div className='hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]'>
                                    <Link href="/pro" className=" w-full bg-white inline-flex items-center justify-center px-4 py-2 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                        Live DSA & CP Classes
                                        <Rocket className="ml-2 -mr-1 w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                status.getUser == "done" &&
                <div>
                    {
                        user != null ?
                            <>
                                <div className="md:container mt-5 px-5 flex items-center">
                                    {
                                        refresh==0?
                                        <p className="flex items-center text-sm">Loading User Data <RotateCcw className="animate-spin ml-2 h-3 w-3" /> </p>
                                        :
                                        <p className="flex items-center text-sm">Problem status not updated? <button onClick={(e) => { e.preventDefault(); setRefresh(refresh + 1) }} className="ml-2 flex items-center text-xs">reload now <RotateCcw className="ml-1 h-2 w-2" /></button></p>
                                    }
                                    
                                    {
                                        fullScreen ?
                                            <Button onClick={(e) => {
                                                e.preventDefault();
                                                setFullScreen(false)
                                            }} variant={"outline"} className="flex items-center ml-auto">
                                                <Fullscreen className="h-4 w-4 mr-2" /> Default Mode
                                            </Button> :
                                            <Button onClick={(e) => {
                                                e.preventDefault();
                                                setFullScreen(true)
                                            }} variant={"outline"} className="flex items-center ml-auto">
                                                <Fullscreen className="h-4 w-4 mr-2" /> Full Screen Mode
                                            </Button>
                                    }
                                </div>
                                {
                                    !fullScreen &&
                                    <Tabs defaultValue="0" className="md:container mt-5 px-5 w-full flex overflow-scroll">
                                        <TabsList className="grid w-full grid-cols-5">
                                            <TabsTrigger
                                                onClick={(e) => {
                                                    setDifficulty(0)
                                                    setDifficultyMax(0)
                                                }}
                                                value="0">All</TabsTrigger>
                                            <TabsTrigger
                                                onClick={(e) => {
                                                    setDifficulty(800)
                                                    setDifficultyMax(1000)
                                                }}
                                                value="1000">800 - 1000</TabsTrigger>
                                            <TabsTrigger
                                                onClick={(e) => {
                                                    setDifficulty(1100)
                                                    setDifficultyMax(1200)
                                                }}
                                                value="1200">1100 - 1200</TabsTrigger>
                                            <TabsTrigger
                                                onClick={(e) => {
                                                    setDifficulty(1300)
                                                    setDifficultyMax(1400)
                                                }}
                                                value="1400">1300 - 1400</TabsTrigger>
                                            <TabsTrigger
                                                onClick={(e) => {
                                                    setDifficulty(1500)
                                                    setDifficultyMax(1600)
                                                }}
                                                value="1600">1500 - 1600</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                }
                                {
                                    status.getSheetData == "done" &&
                                    <div className="md:container mt-5 px-5">
                                        <CPSheetTable tableData={problems} user_email={user?.email} fullScreen={fullScreen} />
                                    </div>
                                }
                                {
                                    (status.getSheetData == "loading" || status.getSheetData == "pending") &&
                                    <div className="md:container px-5">
                                        <Loading title={"Loading Sheet Data"} />
                                        <Skeleton className="h-10 mt-5 w-full" />
                                        <Skeleton className="h-10 mt-5 w-1/2" />
                                        <Skeleton className="h-10 mt-5 w-full" />
                                        <Skeleton className="h-10 mt-5 w-full" />
                                        <Skeleton className="h-10 mt-5 w-3/4" />
                                        <Skeleton className="h-10 mt-5 w-full" />
                                        <Skeleton className="h-10 mt-5 w-1/2" />
                                        <Skeleton className="h-10 mt-5 w-full" />
                                    </div>
                                }
                                {
                                    status.getSheetData == "error" &&
                                    <div className="container mt-20">
                                        <ErrorBanner />
                                    </div>
                                }
                            </>
                            :
                            <>
                                <LoginRequiredPage />
                            </>
                    }
                </div>
            }
            {
                status.getUser == "loading" &&
                <div className="md:container px-5">
                    <Loading title={"Loading Sheet Data"} />
                    <Skeleton className="h-10 mt-5 w-full" />
                    <Skeleton className="h-10 mt-5 w-1/2" />
                    <Skeleton className="h-10 mt-5 w-full" />
                    <Skeleton className="h-10 mt-5 w-full" />
                    <Skeleton className="h-10 mt-5 w-3/4" />
                    <Skeleton className="h-10 mt-5 w-full" />
                    <Skeleton className="h-10 mt-5 w-1/2" />
                    <Skeleton className="h-10 mt-5 w-full" />
                </div>
            }
            {
                status.getUser == "error" &&
                <div className="container mt-20">
                    <ErrorBanner />
                </div>
            }
        </div>
    );
}

export default Sheet;