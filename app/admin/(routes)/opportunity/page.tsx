"use client"

import { Button } from "@/components/ui/button";
import supabase from "@/supabase";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import QuillEditor from '../../../(dashboard)/_components/components/quill-editor';
import { toast } from "sonner";
import { RotateCw } from "lucide-react";

const AddOpportunity = () => {
    const router = useRouter()
    const [internship_title, setInternshipTitle] = useState("")
    const [internship_description, setInternshipDescription] = useState("")
    const [company_name, setCompanyName] = useState("")
    const [company_logo, setCompanyLogo] = useState("")
    const [batch_eligible, setBatchEligible] = useState("")
    const [skills, setSkills] = useState("")
    const [experience, setExperience] = useState("")
    const [internship_duration, setInternshipDuration] = useState("Duration Not Specified")
    const [internship_location, setInternshipLocation] = useState("Location Not Specified")
    const [apply_link, setApplyLink] = useState("")
    const [stipend, setStipend] = useState("")
    const [password, setPassword] = useState("")
    const [status, setStatus] = useState("done")

    function create_url_slug(name: string, company_name:string) {
        let s = name.toLowerCase()
        let cn = company_name.toLowerCase()
        cn = cn.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-').replace(/^(-)+|(-)+$/g, '');
        s = s.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-').replace(/^(-)+|(-)+$/g, '');
        s = cn + "-" + s + "-" + Math.floor((new Date()).getTime() / 1000).toString()
        return s
    }

    async function AddOpportunity(e: any) {
        e.preventDefault()
        setStatus("loading")
        if (password != process.env.NEXT_PUBLIC_CODING_75) {
            alert("Wrong Password")
            return
        }
        let batches = batch_eligible.split(",")
        let batches_int = batches.map((value) => { return parseInt(value) })
        let skillsArray = skills.split(",")
        let slug_url = create_url_slug(internship_title,company_name)
        try {
            const { data, error } = await supabase
                .from('internships')
                .insert([
                    {
                        internship_title: internship_title,
                        internship_description: String(internship_description),
                        company_name: company_name,
                        company_logo: company_logo,
                        batch_eligible: batch_eligible?batches_int:null,
                        internship_duration: internship_duration,
                        internship_location: internship_location,
                        apply_link: apply_link,
                        url_slug: slug_url,
                        stipend: stipend,
                        skills: skills?skillsArray:null,
                        experience: experience
                    },
                ])
                .select()

            if (error) {
                alert('Error adding problem:');
                console.error('An error occurred:', error);
                toast.error("Error")
                setStatus("done")
            } else {
                router.push(`/opportunities/${slug_url}`)
            }

        } catch (error) {
            alert('Error adding problem:');
            console.error('An error occurred:', error);
            setStatus("done")
            toast.error("Error")
        }
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3 className="text-center text-2xl font-semibold text-indigo-700 ">
                    Add Opportunities
                </h3>
                <div className="mt-5 p-5 border-solid border-2 border-black rounded-lg">
                    <form onSubmit={AddOpportunity}>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setInternshipTitle(e.target.value) }}
                                type="text"
                                name="internship_title"
                                id="internship_title"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Internship Title"
                                required />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setCompanyName(e.target.value) }}
                                type="text"
                                name="company_name"
                                id="company_name"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Company Name"
                                required />
                        </div>
                        <div className="mt-2">
                            <QuillEditor value={internship_description} onChange={(e) => { setInternshipDescription(e) }} />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setCompanyLogo(e.target.value) }}
                                type="text"
                                name="company_logo"
                                id="company_logo"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Company Logo"
                            />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setInternshipDuration(e.target.value) }}
                                type="text"
                                name="internship_duration"
                                id="internship_duration"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Internship Duration"
                            />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setInternshipLocation(e.target.value) }}
                                type="text"
                                name="internship_location"
                                id="internship_location"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Internship Location"
                            />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setApplyLink(e.target.value) }}
                                type="text"
                                name="apply_link"
                                id="apply_link"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Apply Link"
                                required />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setBatchEligible(e.target.value) }}
                                type="text"
                                name="batch_eligible"
                                id="batch_eligible"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Batch Eligible"
                                />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setExperience(e.target.value) }}
                                type="text"
                                name="experience"
                                id="experience"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Experience"
                                />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setSkills(e.target.value) }}
                                type="text"
                                name="skills"
                                id="skills"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Skills"
                                />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setStipend(e.target.value) }}
                                type="text"
                                name="stipend"
                                id="stipend"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Stipend"
                                 />
                        </div>
                        <div className="mt-2">
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="text"
                                name="password"
                                id="password"
                                autoComplete="off"
                                className="block w-full rounded-md border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="coding75 Password"
                                required />
                        </div>
                        <div className="mt-2">
                            <Button
                            variant="outline"
                            className="flex items-center"
                            disabled={status=="loading"}
                                type="submit"
                            >
                                {
                                 status=="loading"&&
                                 <RotateCw className="animate-spin h-4 w-4 mr-2"/>
                                }
                                Upload
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddOpportunity;