"use client"

import ErrorBanner from "@/app/(dashboard)/_components/error-banner"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import supabase from "@/supabase"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const NewProject = () => {
    const router = useRouter()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [projectType, setProjectType] = useState("")
    const [codeLink, setCodeLink] = useState("")
    const [deployLink, setDeployLink] = useState("")
    const [videoLink, setVideoLink] = useState("")
    const [blogLink, setBlogLink] = useState("")
    const [projectLevel, setProjectLevel] = useState("")
    const [techUsed, setTechUsed] = useState("")
    const [password, setPassword] = useState("")
    const [status,setStatus] = useState("")

    const projectTypeDetails={
        "basicfrontend":{
            title:"Basic Frontend",
            description:"Frontend Projects for Beginners with HTML, CSS and Javascript."
        },
        "reactjs": {
            "title": "ReactJS",
            "description": "Build interactive and responsive user interfaces using the powerful React library."
        },
        "nextjs": {
            "title": "Next.js",
            "description": "Server-side rendering, code splitting, and simplified routing for efficient web applications."
        },
        "mern": {
            "title": "MERN Stack",
            "description": "Create dynamic full-stack web applications with MongoDB, Express, React, and Node.js."
        },
        "flutter": {
            "title": "Flutter",
            "description": "Craft beautiful and responsive cross-platform mobile applications with Flutter."
        },
        "ml": {
            "title": "Machine Learning",
            "description": "Explore real-world applications, diverse algorithms, and hands-on experiences to master the art of AI."
        },
}

    function create_url_slug(name: string) {
        let s = name.toLowerCase()
        s = s.replace(/([~!@#$%^&*()_+=`{}\[\]\|\\:;'<>,.\/? ])+/g, '-').replace(/^(-)+|(-)+$/g, '');
        s=s+"-"+Math.floor((new Date()).getTime() / 1000).toString()
        return s
    }

    function getTechUsedArray(s:any){
        return s.split(",")
    }

    async function uploadProject(e:any){
        e.preventDefault()
        if(password!=process.env.NEXT_PUBLIC_CODING_75){
            alert("Wrong Password")
            return
        }
        setStatus("loading")
        const slug_href=create_url_slug(name+" "+projectType)
        try {
            const { data, error } = await supabase
                .from('projects')
                .insert([
                    {
                        project_name: name,
                        project_description: description,
                        code_link: codeLink,
                        deploy_link: deployLink,
                        video_link: videoLink,
                        blog_link: blogLink,
                        project_level: projectLevel,
                        project_type: projectTypeDetails[projectType]["title"],
                        project_type_description: projectTypeDetails[projectType]["description"],
                        slug_href: slug_href,
                        slug_url: projectType,
                        tech_used:getTechUsedArray(techUsed)
                    },
                ])
                .select()

            if (error) {
                console.log(error);
                setStatus("error")
            } else {
                router.push(`/projects/${projectType}/${slug_href}`)
            }
            return { data, error };
        } catch (error) {
            console.log(error);
            setStatus("error")
        }
    }

    return (
        <div className="mt-10 container">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>New project</CardTitle>
                    <CardDescription>Add your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="uploadproject">
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name*</Label>
                                <Input onChange={(e)=>{setName(e.target.value)}} required id="name" placeholder="Name of your project" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="description">Description*</Label>
                                <Input onChange={(e)=>{setDescription(e.target.value)}} required id="name" placeholder="Name of your project" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="projecttype">Project Type*</Label>
                                <Select onValueChange={(e)=>{setProjectType(e)}} required>
                                    <SelectTrigger id="projecttype">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="basicfrontend">Basic Frontend</SelectItem>
                                        <SelectItem value="reactjs">React JS</SelectItem>
                                        <SelectItem value="nextjs">Next JS</SelectItem>
                                        <SelectItem value="mern">MERN</SelectItem>
                                        <SelectItem value="flutter">Flutter</SelectItem>
                                        <SelectItem value="ml">Machine Learning</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="Blog">Blog Link*</Label>
                                <Input onChange={(e)=>{setBlogLink(e.target.value)}} id="Blog" placeholder="Blog Link" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="Video">Video Link*</Label>
                                <Input onChange={(e)=>{setVideoLink(e.target.value)}} id="Video" placeholder="Video Link" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="Code">Code Link</Label>
                                <Input onChange={(e)=>{setCodeLink(e.target.value)}} id="Code" placeholder="Code Link" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="Deploy">Deploy Link</Label>
                                <Input onChange={(e)=>{setDeployLink(e.target.value)}} id="Deploy" placeholder="Deploy Link" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="projectlevel">Project Level*</Label>
                                <Select onValueChange={(e)=>{setProjectLevel(e)}} required>
                                    <SelectTrigger id="projectlevel">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Expert">Expert</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="techused">Tech Used*</Label>
                                <Input onChange={(e)=>{setTechUsed(e.target.value)}} required id="techused" placeholder="With Commas Ex: HTML,CSS,Javascript,ReactJS" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password*</Label>
                                <Input type="text" onChange={(e)=>{setPassword(e.target.value)}} required id="password" placeholder="CrackDSA Admin Password" />
                            </div>
                        </div>
                        <div className="mt-5">
                        {status==""?<>
                        <Button type="submit" onClick={uploadProject}>Upload</Button>
                        </>:<>
                        {status=="loading"?<>
                        <Button><Loader2 className="animate-spin h-4 w-4 mr-2"/> Loading</Button>
                        </>:<>
                        <Button type="submit" className="mb-4" onClick={uploadProject}>Upload</Button>
                        <ErrorBanner/>
                        </>}
                        </>}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default NewProject;