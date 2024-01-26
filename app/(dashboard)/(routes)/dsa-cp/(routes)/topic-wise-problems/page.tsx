"use client"

import ImageCard2 from "@/components/cards/image-card-2";
import PageHeaders from "@/components/page-headers/page-headers";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const list_of_frequently_searched_companies = [
    {
        name: "Array",
        link: "/dsa-cp/problems/topic/array",
        image_link: undefined,
    },
    {
        name: "Strings",
        link: "/dsa-cp/problems/topic/string",
        image_link: undefined,
    },
    {
        name: "Graph",
        link: "/dsa-cp/problems/topic/graph",
        image_link: undefined,
    },
    {
        name: "DP",
        link: "/dsa-cp/problems/topic/dp",
        image_link: undefined,
    },
    {
        name: "Binary Tree",
        link: "/dsa-cp/problems/topic/binary-tree",
        image_link: undefined,
    },
    {
        name: "Stack",
        link: "/dsa-cp/problems/topic/stack",
        image_link: undefined,
    },
    {
        name: "Queue",
        link: "/dsa-cp/problems/topic/queue",
        image_link: undefined,
    },
    {
        name: "Heaps",
        link: "/dsa-cp/problems/topic/heaps",
        image_link: undefined,
    },
    {
        name: "Hashing",
        link: "/dsa-cp/problems/topic/hashing",
        image_link: undefined,
    },
    {
        name: "Binary Search",
        link: "/dsa-cp/problems/topic/binary-search",
        image_link: undefined,
    },
    {
        name: "Two Pointers",
        link: "/dsa-cp/problems/topic/two-pointers",
        image_link: undefined,
    },
    {
        name: "Sorting",
        link: "/dsa-cp/problems/topic/sorting",
        image_link: undefined,
    },
]

const TopicWiseProblems = () => {
    const passedPlaceholder=["Array", "String", "Dynamic Programming", "Stack", "Queue", "Graph", "Trees"]
    const [placeholder, setPlaceholder] = useState(passedPlaceholder[0]);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [searchedTopic, setSearchedTopic]= useState("")
    const router = useRouter()

    useEffect(() => {
        const intr = setInterval(() => {
            setPlaceholder(passedPlaceholder[placeholderIndex]);
            if (placeholderIndex + 1 >= passedPlaceholder.length) {
                setPlaceholderIndex(0)
            } else {
                setPlaceholderIndex(placeholderIndex + 1)
            }
        }, 1000);
        return () => {
            clearInterval(intr)
        }
    },);

    function searchTopic(e){
        e.preventDefault()
        let topicName=searchedTopic.toLowerCase();
        topicName=topicName.trim().split(/[\s,\t,\n]+/).join('-');
        console.log(topicName);
        
        router.push(`/dsa-cp/problems/topic/${topicName}`)
    }

    return (
        <div className="container">
            <div className="mt-3">
                <PageHeaders
                    heading="Topic Wise Interview Problems 💻"
                    description="Gear up for success in tech interviews by honing your skills on topic-specific coding challenges. Explore our curated repository designed to help you ace interviews with top companies." />
            </div>
            <h3 className="mt-5 flex justify-center font-bold text-lg lg:text-2xl">Select Topic Name 👇🏻</h3>
            <div className="mt-3 p-5">
                <form>

                    <div className="relative mt-1.5">
                        <input
                            type="text"
                            list="TopicList"
                            id="TopicListId"
                            onChange={(e)=>{setSearchedTopic(e.target.value);}}
                            className="font-semibold p-3 outline-slate-600 outline-double w-full text-md lg:text-xl rounded-sm border-gray-300 pe-10 text-gray-700 sm:text-sm [&::-webkit-calendar-picker-indicator]:opacity-0"
                            placeholder={placeholder + "  Problems"}
                        />

                        <span className="absolute inset-y-0 end-0 flex w-8 items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-5 w-5 text-gray-500"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                />
                            </svg>
                        </span>
                    </div>
                    {searchedTopic!=""&&<>
                    <Button  onClick={searchTopic} className="mt-3 bg-indigo-600 hover:bg-indigo-700">
                        Search 
                    </Button>
                    </>}

                    <datalist id="TopicList">
                        <option>Array</option>
                        <option>String</option>
                        <option>Dynamic Programming</option>
                        <option>Graphs</option>
                        <option>Hashing</option>
                        <option>Stack</option>
                        <option>Queue</option>
                        <option>Heaps</option>
                        <option>Deque</option>
                        <option>Trie</option>
                        <option>Binary Search</option>

                    </datalist>
                </form>
            </div>
            <h3 className="mt-5 flex justify-center font-bold text-lg lg:text-2xl">Frequently Searched Topics 👇🏻</h3>
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {list_of_frequently_searched_companies.map((topic) => (
                    <div key={topic.name}>
                        <ImageCard2 title={topic.name + " Problems"} link={topic.link} button_text={"Start Solving"} image_link={topic.image_link} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TopicWiseProblems;