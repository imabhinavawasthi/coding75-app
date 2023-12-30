"use client"

import { Button } from "@/components/ui/button";
import supabase from "@/supabase";
import { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { company_tags, topic_tags } from "@/components/constants";
import Loading from "@/components/loading";
import { useRouter } from 'next/navigation'

const AddProblem = () => {
    const router = useRouter()
    const [problem_name, setProblemName] = useState("")
    const [problem_description, setProblemDescription] = useState("")
    const [problem_link, setProblemLink] = useState("")
    const [platform, setPlatform] = useState("leetcode")
    const [video_editorial, setVideoEditorial] = useState("")
    const [editorial, setEditorial] = useState("")
    const [difficulty, setDifficulty] = useState("0")
    const [topic_tag, setTopicTag] = useState([])
    const [company_tag, setCompanyTag] = useState([])
    const [loading, setLoading] = useState(false)
    const [password,setPassword]=useState("")

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

    function create_url_slug(name: string) {
        let s = name.toLowerCase()
        s = s.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-').replace(/^(-)+|(-)+$/g, '');
        return s
    }


    async function addProblem(e) {
        e.preventDefault()
        if(password!=process.env.NEXT_PUBLIC_CODING_75){
            alert("Wrong Password")
            return
        }
        setLoading(true)
        let slug_url = create_url_slug(problem_name)
        try {
            const { data, error } = await supabase
                .from('dsaproblems')
                .insert([
                    {
                        company_tags: company_tag,
                        problem_name: problem_name,
                        topic_tags: topic_tag,
                        problem_description: problem_description,
                        problem_link: problem_link,
                        platform: platform,
                        video_editorial: video_editorial,
                        editorial: editorial,
                        difficulty: difficulty,
                        slug_url: slug_url
                    },
                ])
                .select()

            if (error) {
                alert(error.message);
                console.error('An error occurred:', error);
                setLoading(false)
            } else {
                console.log(data);
                router.push(`/dsa-cp/problems/${slug_url}`)
                setLoading(false)
            }
            setLoading(false)
            return { data, error };
        } catch (error) {
            alert('Error adding problem:');
            console.error('An error occurred:', error);
            setLoading(false)
            return { error };
        }
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3 className="text-center text-2xl font-semibold text-indigo-700 ">
                    Add DSA Problems
                </h3>
                <div className="mt-5 p-5 border-solid border-2 border-black rounded-lg">
                    <form>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setProblemName(e.target.value) }}
                                type="text"
                                name="problem_name"
                                id="problem_name"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Problem Name"
                                required />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setProblemDescription(e.target.value) }}
                                type="text"
                                name="problem_description"
                                id="problem_description"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Problem Description"
                                required />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setProblemLink(e.target.value) }}
                                type="text"
                                name="problem_link"
                                id="problem_link"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Problem Link"
                                required />
                        </div>
                        <div className="mt-2">
                            <select
                                onChange={(e) => { setPlatform(e.target.value) }}
                                id="platform"
                                name="platform"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required>
                                <option value="Leetcode">Leetcode</option>
                                <option value="Geeksforgeeks">GeeksforGeeks</option>
                                <option value="Coding Ninjas" >Coding Ninjas</option>
                                <option value="HackerRank" >HackerRank</option>
                                <option value="HackerEarth" >HackerEarth</option>
                                <option value="Spoj">Spoj</option>
                                <option value="Codeforces" >Codeforces</option>
                                <option value="Codechef" >Codechef</option>
                                <option value="Others" >Others</option>
                            </select>
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setVideoEditorial(e.target.value) }}
                                type="text"
                                name="video_editorial"
                                id="video_editorial"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Video Editorial"
                                required />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setEditorial(e.target.value) }}
                                type="text"
                                name="editorial"
                                id="editorial"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Editorial"
                                required />
                        </div>
                        <div className="mt-2">
                            <p className="text-sm mb-1 ml-1">Select Companies</p>
                            {/* <pre>{JSON.stringify(company_tag)}</pre> */}
                            <MultiSelect
                                options={company_tags_list}
                                value={company_tag}
                                onChange={setCompanyTag}
                                labelledBy="Select Companies"
                            />
                        </div>
                        <div className="mt-2">
                            <p className="text-sm mb-1 ml-1">Select Topics</p>
                            {/* <pre>{JSON.stringify(topic_tag)}</pre> */}
                            <MultiSelect
                                options={topic_tags_list}
                                value={topic_tag}
                                onChange={setTopicTag}
                                labelledBy="Select Topics"
                            />
                        </div>
                        <div className="mt-2">
                            <select
                                onChange={(e) => { setDifficulty(e.target.value) }}
                                id="currency"
                                name="currency"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                required>
                                <option value={0}>Easy</option>
                                <option value={1}>Medium</option>
                                <option value={2}>Hard</option>
                                <option value={3}>Advanced</option>
                            </select>
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="text"
                                name="password"
                                id="password"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="coding75 Password"
                                required />
                        </div>
                        <div className="mt-2">
                            {loading ? <>
                                <Button
                                    disabled={true}
                                ><Loading title="" /></Button>
                            </> : <>
                                <Button
                                    onClick={(e) => { addProblem(e) }}
                                >Upload</Button></>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProblem;