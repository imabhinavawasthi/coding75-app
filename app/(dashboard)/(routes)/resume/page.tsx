"use client"

import { cn } from '@/lib/utils';
import { AlertCircle, Award, Briefcase, Check, Code2, ExternalLink, Minus, Plus, RotateCw, SaveAll, School, ScrollText, Trash2Icon, UploadCloud, User2, Workflow } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import supabase from '@/supabase';
import { toast } from 'sonner';
import ErrorBanner from '../../_components/banners/error-banner';
import Loading from '@/components/loading';
import LoginRequiredPage from "../../_components/components/login-required"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { createResume } from './make-resume';
import resumeBuilderPic from "../../../../public/images/resume-builder.png"
import Image from 'next/image';

const resumeButtons = [
    {
        icon: User2,
        label: "Personal Details",
        tab: "personal-details",
        changeKey: "personalDetailsChange",
        completeKey: "personalDetailsComplete"
    },
    {
        icon: School,
        label: "Education",
        tab: "education",
        changeKey: "educationDetailsChange",
        completeKey: "educationDetailsComplete"
    },
    {
        icon: Briefcase,
        label: "Experience",
        tab: "experience",
        changeKey: "experienceDetailsChange",
        completeKey: "experienceDetailsComplete"
    },
    {
        icon: Code2,
        label: "Projects",
        tab: "projects",
        changeKey: "projectDetailsChange",
        completeKey: "projectDetailsComplete"
    },
    {
        icon: Award,
        label: "Achievements",
        tab: "achievements",
        changeKey: "achievementDetailsChange",
        completeKey: "achievementDetailsComplete"
    },
    {
        icon: Workflow,
        label: "Skills",
        tab: "skills",
        changeKey: "skillDetailsChange",
        completeKey: "skillDetailsComplete"
    },
    {
        icon: Plus,
        label: "Extra Curricular",
        tab: "extra-curricular",
        changeKey: "extraCurricularDetailsChange",
        completeKey: "extraCurricularDetailsComplete"
    },
];

interface statusType {
    loadData: "pending" | "loading" | "done" | "error",
    personalDetails: "pending" | "loading" | "done" | "error",
    educationDetails: "pending" | "loading" | "done" | "error",
    experienceDetails: "pending" | "loading" | "done" | "error",
    projectDetails: "pending" | "loading" | "done" | "error",
    achievementDetails: "pending" | "loading" | "done" | "error",
    extraCurricularDetails: "pending" | "loading" | "done" | "error",
    skillDetails: "pending" | "loading" | "done" | "error",
}

interface updateChangeType {
    personalDetailsChange: boolean;
    educationDetailsChange: boolean;
    experienceDetailsChange: boolean;
    projectDetailsChange: boolean;
    achievementDetailsChange: boolean;
    extraCurricularDetailsChange: boolean;
    skillDetailsChange: boolean;
}

interface completeType {
    personalDetailsComplete: boolean;
    educationDetailsComplete: boolean;
    experienceDetailsComplete: boolean;
    projectDetailsComplete: boolean;
    achievementDetailsComplete: boolean;
    extraCurricularDetailsComplete: boolean;
    skillDetailsComplete: boolean;
    loading: boolean;
}

interface personalDetailsType {
    fullName: any;
    email: any;
    contactNumber: any;
    address: any;
    pincode: any;
}

interface socialLinksType {
    linkedin: any;
    github: any;
}

interface educationDetailsType {
    universityName: any;
    degreeName: any;
    score: any;
    fromDate: any;
    toDate: any;
    location: any;
    branch: any;
}

interface experienceDetailsType {
    jobRole: any;
    companyName: any;
    fromDate: any;
    toDate: any;
    location: any;
    details: [any];
}

interface projectDetailsType {
    projectName: any;
    techStack: any;
    fromDate: any;
    toDate: any;
    deployLink: any;
    githubLink: any;
    details: [any];
}

interface achievementDetailsType {
    details: any;
}

interface extraCurricularDetailsType {
    details: any;
}

interface skillDetailsType {
    technologiesAndFrameworks: any;
    languages: any;
    developerTools: any;
    relevantCoursework: any;
}

const Resume = () => {
    const [currentTab, setCurrentTab] = useState('personal-details')
    const [user, setUser] = useState<any>(null)
    const [createResumeStatus, setCreateResumeStatus] = useState("pending")
    const [status, setStatus] = useState<statusType>({
        loadData: "pending",
        personalDetails: "pending",
        educationDetails: "pending",
        experienceDetails: "pending",
        projectDetails: "pending",
        achievementDetails: "pending",
        extraCurricularDetails: "pending",
        skillDetails: "pending"
    })

    const [updateChange, setUpdateChange] = useState<updateChangeType>(
        {
            personalDetailsChange: false,
            educationDetailsChange: false,
            experienceDetailsChange: false,
            projectDetailsChange: false,
            achievementDetailsChange: false,
            extraCurricularDetailsChange: false,
            skillDetailsChange: false
        }
    )

    const [complete, setComplete] = useState<completeType>(
        {
            personalDetailsComplete: true,
            educationDetailsComplete: true,
            experienceDetailsComplete: true,
            projectDetailsComplete: true,
            achievementDetailsComplete: true,
            extraCurricularDetailsComplete: true,
            skillDetailsComplete: true,
            loading: true
        }
    )

    const [personalDetails, setPersonalDetails] = useState<personalDetailsType>(
        {
            fullName: undefined,
            email: undefined,
            contactNumber: undefined,
            address: undefined,
            pincode: undefined
        }
    )

    const [socialLinks, setSocialLinks] = useState<socialLinksType>(
        {
            linkedin: undefined,
            github: undefined
        }
    )

    const [educationDetails, setEducationDetails] = useState<educationDetailsType[]>([
        {
            universityName: undefined,
            degreeName: undefined,
            score: undefined,
            fromDate: undefined,
            toDate: undefined,
            location: undefined,
            branch: undefined
        }
    ])

    const [experienceDetails, setExperienceDetails] = useState<experienceDetailsType[]>([
        {
            jobRole: undefined,
            companyName: undefined,
            fromDate: undefined,
            toDate: undefined,
            location: undefined,
            details: [
                undefined
            ]
        }
    ])

    const [projectDetails, setProjectDetails] = useState<projectDetailsType[]>([
        {
            projectName: undefined,
            techStack: undefined,
            fromDate: undefined,
            toDate: undefined,
            deployLink: undefined,
            githubLink: undefined,
            details: [
                undefined
            ]
        }
    ])

    const [achievementDetails, setAchievementDetails] = useState<achievementDetailsType>(
        {
            details: [
                undefined
            ]
        }
    )

    const [extraCurricularDetails, setExtraCurricularDetails] = useState<extraCurricularDetailsType>(
        {
            details: [
                undefined
            ]
        }
    )

    const [skillDetails, setSkillDetails] = useState<skillDetailsType>(
        {
            technologiesAndFrameworks: undefined,
            languages: undefined,
            developerTools: undefined,
            relevantCoursework: undefined
        }
    )

    async function checkUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (data) {
                if (data.user) {
                    setUser(data.user)
                    return data.user.email
                }
                else {
                    setUser(null)
                    return null
                }
            }
            else {
                console.error(error);
                toast.error('Error! Something went wrong.')
            }
        }
        catch (e) {
            console.log(e);
            toast.error('Error! Something went wrong.')
        }
    }

    async function loadPersonalDetails(user_email) {
        try {
            let { data, error } = await supabase
                .from('resume-details')
                .select("personal_details")
                .eq('user_email', user_email);

            if (error) {
                console.log(error);
                setStatus({
                    ...status,
                    loadData: "error"
                })
            } else {
                if (data && data.length > 0) {
                    setPersonalDetails({
                        ...personalDetails,
                        fullName: data[0]?.['personal_details']?.['fullName'],
                        email: data[0]?.['personal_details']?.['email'],
                        contactNumber: data[0]?.['personal_details']?.['contactNumber'],
                        address: data[0]?.['personal_details']?.['address'],
                        pincode: data[0]?.['personal_details']?.['pincode']
                    })
                }

            }
        } catch (e) {
            console.log(e);
            setStatus({
                ...status,
                loadData: "error"
            })
        }
    }

    async function loadSocialLinks(user_email) {
        try {
            let { data, error } = await supabase
                .from('resume-details')
                .select("social_links")
                .eq('user_email', user_email);

            if (error) {
                console.log(error);
                setStatus({
                    ...status,
                    loadData: "error"
                })
            } else {
                if (data && data.length > 0) {
                    setSocialLinks({
                        ...socialLinks,
                        linkedin: data[0]?.['social_links']?.['linkedin'],
                        github: data[0]?.['social_links']?.['github']
                    })
                }
            }
        } catch (e) {
            console.log(e);
            setStatus({
                ...status,
                loadData: "error"
            })
        }
    }

    async function loadEducationDetails(user_email) {
        try {
            let { data, error } = await supabase
                .from('resume-details')
                .select("education")
                .eq('user_email', user_email);

            if (error) {
                console.log(error);
                setStatus({
                    ...status,
                    loadData: "error"
                })
            } else {
                const educationData = data?.[0]?.["education"]
                const educationDataJson = educationData?.map((data) => {
                    return (
                        {
                            universityName: data?.["universityName"],
                            degreeName: data?.["degreeName"],
                            score: data?.["score"],
                            fromDate: data?.["fromDate"],
                            toDate: data?.["toDate"],
                            location: data?.["location"],
                            branch: data?.["branch"],
                        }
                    )
                })
                if (educationDataJson?.length > 0) {
                    setEducationDetails(educationDataJson)
                }
            }
        } catch (e) {
            console.log(e);
            setStatus({
                ...status,
                loadData: "error"
            })
        }
    }

    async function loadExperienceDetails(user_email) {
        try {
            let { data, error } = await supabase
                .from('resume-details')
                .select("experience")
                .eq('user_email', user_email);

            if (error) {
                console.log(error);
                setStatus({
                    ...status,
                    loadData: "error"
                })
            } else {
                const experienceData = data?.[0]?.["experience"]
                const experienceDataJson = experienceData?.map((data) => {
                    return (
                        {
                            jobRole: data?.["jobRole"],
                            companyName: data?.["companyName"],
                            fromDate: data?.["fromDate"],
                            toDate: data?.["toDate"],
                            location: data?.["location"],
                            details: data?.["details"] || [""],
                        }
                    )
                })
                if (experienceDataJson?.length > 0) {
                    setExperienceDetails(experienceDataJson)
                }
            }
        } catch (e) {
            console.log(e);
            setStatus({
                ...status,
                loadData: "error"
            })
        }
    }

    async function loadProjectsDetails(user_email) {
        try {
            let { data, error } = await supabase
                .from('resume-details')
                .select("projects")
                .eq('user_email', user_email);

            if (error) {
                console.log(error);
                setStatus({
                    ...status,
                    loadData: "error"
                })
            } else {
                const projectData = data?.[0]?.["projects"]
                const projectDataJson = projectData?.map((data) => {
                    return (
                        {
                            projectName: data?.["projectName"],
                            techStack: data?.["techStack"],
                            fromDate: data?.["fromDate"],
                            toDate: data?.["toDate"],
                            deployLink: data?.["deployLink"],
                            githubLink: data?.["githubLink"],
                            details: data?.["details"] || [""],
                        }
                    )
                })
                if (projectDataJson?.length > 0) {
                    setProjectDetails(projectDataJson)
                }
            }
        } catch (e) {
            console.log(e);
            setStatus({
                ...status,
                loadData: "error"
            })
        }
    }

    async function loadAchievementDetails(user_email) {
        try {
            let { data, error } = await supabase
                .from('resume-details')
                .select("achievements")
                .eq('user_email', user_email);

            if (error) {
                console.log(error);
                setStatus({
                    ...status,
                    loadData: "error"
                })
            } else {
                const achievementData = data?.[0]?.["achievements"]
                const achievementDataJson = {
                    details: achievementData?.["details"] || [""],
                }
                setAchievementDetails(achievementDataJson)
            }
        } catch (e) {
            console.log(e);
            setStatus({
                ...status,
                loadData: "error"
            })
        }
    }

    async function loadExtraCurricularDetails(user_email) {
        try {
            let { data, error } = await supabase
                .from('resume-details')
                .select("extra_curricular")
                .eq('user_email', user_email);

            if (error) {
                console.log(error);
                setStatus({
                    ...status,
                    loadData: "error"
                })
            } else {
                const extraCurricularData = data?.[0]?.["extra_curricular"]
                const extraCurricularJson = {
                    details: extraCurricularData?.["details"] || [""],
                }
                setExtraCurricularDetails(extraCurricularJson)
            }
        } catch (e) {
            console.log(e);
            setStatus({
                ...status,
                loadData: "error"
            })
        }
    }

    async function loadSkillDetails(user_email) {
        try {
            let { data, error } = await supabase
                .from('resume-details')
                .select("skills")
                .eq('user_email', user_email);

            if (error) {
                console.log(error);
                setStatus({
                    ...status,
                    loadData: "error"
                })
            } else {
                if (data && data.length > 0) {
                    setSkillDetails(data[0]?.['skills'])
                }
            }
        } catch (e) {
            console.log(e);
            setStatus({
                ...status,
                loadData: "error"
            })
        }
    }

    useEffect(() => {
        setComplete(
            {
                personalDetailsComplete: personalDetails?.fullName ? true : false,
                educationDetailsComplete: (educationDetails?.length > 0 && educationDetails?.[0].universityName) ? true : false,
                experienceDetailsComplete: (experienceDetails?.length > 0 && experienceDetails?.[0].companyName) ? true : false,
                projectDetailsComplete: (projectDetails?.length > 0 && projectDetails?.[0]?.projectName != undefined) ? true : false,
                achievementDetailsComplete: (achievementDetails?.details?.[0]) ? true : false,
                extraCurricularDetailsComplete: (extraCurricularDetails?.details?.[0]) ? true : false,
                skillDetailsComplete: (skillDetails?.developerTools) ? true : false,
                loading: false
            }
        )
    }, [personalDetails, socialLinks, skillDetails, educationDetails, experienceDetails, extraCurricularDetails, achievementDetails, projectDetails])

    async function loadDetails() {
        setStatus({
            ...status,
            loadData: "loading"
        })
        const user_email = await checkUser()
        if (user_email == null) {
            setStatus({
                ...status,
                loadData: "done"
            })
            return;
        }
        try {
            let { data, error } = await supabase
                .from('resume-details')
                .select("*")
                .eq('user_email', user_email);

            if (error) {
                console.log(error);
                setStatus({
                    ...status,
                    loadData: "error"
                })
            } else {
                if (data?.length == 0) {
                    try {
                        const { data, error } = await supabase
                            .from('resume-details')
                            .insert([
                                { user_email: user_email },
                            ])
                            .select();
                        if (error) {
                            console.log(error);
                            // toast.error("Some Error Happened")
                            // setStatus({
                            //     ...status,
                            //     loadData: "error"
                            // })
                        } else {
                            setStatus({
                                ...status,
                                loadData: "done"
                            })
                        }
                        location.reload()
                    } catch (e) {
                        console.log(e);
                        location.reload()
                        toast.error("Some Error Happened")
                        setStatus({
                            ...status,
                            loadData: "error"
                        })
                    }
                    return
                }
                else {
                    loadPersonalDetails(user_email)
                    loadSocialLinks(user_email)
                    loadEducationDetails(user_email)
                    loadExperienceDetails(user_email)
                    loadProjectsDetails(user_email)
                    loadAchievementDetails(user_email)
                    loadExtraCurricularDetails(user_email)
                    loadSkillDetails(user_email)
                    setStatus({
                        ...status,
                        loadData: "done"
                    })
                }
            }
        } catch (e) {
            console.log(e);
            setStatus({
                ...status,
                loadData: "error"
            })
            toast.error("Some Error Happened")
        }
    }

    useEffect(() => {
        loadDetails()
    }, [])


    async function handleSubmitPersonalDetails(e) {
        e.preventDefault()
        setStatus({
            ...status,
            personalDetails: "loading"
        })
        try {
            const { data, error } = await supabase
                .from('resume-details')
                .update([
                    {
                        personal_details: {
                            email: personalDetails.email,
                            fullName: personalDetails.fullName,
                            address: personalDetails.address,
                            contactNumber: personalDetails.contactNumber,
                            pincode: personalDetails.pincode,
                        }
                    }
                ])
                .eq('user_email', user.email);


            if (error) {
                console.log(error);
                toast.error("Something went wrong")
                setStatus({
                    ...status,
                    personalDetails: "error"
                })
                return;
            } else {
                setComplete({
                    ...complete,
                    personalDetailsComplete: true
                })
                toast.info("Personal Details Saved")
            }
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong")
            setStatus({
                ...status,
                personalDetails: "error"
            })
            return;
        }
        try {
            const { data, error } = await supabase
                .from('resume-details')
                .update([
                    {
                        social_links: {
                            linkedin: socialLinks.linkedin,
                            github: socialLinks.github
                        }
                    },
                ])
                .eq('user_email', user.email);

            if (error) {
                console.log(error);
                toast.error("Something went wrong")
                setStatus({
                    ...status,
                    personalDetails: "error"
                })
                return;
            } else {
                toast.info("Social Links Saved")
            }
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong")
            setStatus({
                ...status,
                personalDetails: "error"
            })
            return;
        }
        setUpdateChange({
            ...updateChange,
            personalDetailsChange: false
        })
        setStatus({
            ...status,
            personalDetails: "done"
        })
    }

    async function handleSubmitEducationDetails(e) {
        e.preventDefault()
        setStatus({
            ...status,
            educationDetails: "loading"
        })
        try {
            const { data, error } = await supabase
                .from('resume-details')
                .update([
                    {
                        education: educationDetails
                    }
                ])
                .eq('user_email', user.email);


            if (error) {
                console.log(error);
                toast.error("Something went wrong")
                setStatus({
                    ...status,
                    educationDetails: "error"
                })
                return;
            } else {
                setComplete({
                    ...complete,
                    educationDetailsComplete: true
                })
                toast.info("Education Details Saved")
            }
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong")
            setStatus({
                ...status,
                educationDetails: "error"
            })
            return;
        }
        setUpdateChange({
            ...updateChange,
            educationDetailsChange: false
        })
        setStatus({
            ...status,
            educationDetails: "done"
        })
    }

    async function handleSubmitExperienceDetails(e) {
        e.preventDefault()
        setStatus({
            ...status,
            experienceDetails: "loading"
        })
        try {
            const { data, error } = await supabase
                .from('resume-details')
                .update([
                    {
                        experience: experienceDetails
                    }
                ])
                .eq('user_email', user.email);

            if (error) {
                console.log(error);
                toast.error("Something went wrong")
                setStatus({
                    ...status,
                    experienceDetails: "error"
                })
                return;
            } else {
                setComplete({
                    ...complete,
                    experienceDetailsComplete: true
                })
                toast.info("Experience Details Saved")
            }
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong")
            setStatus({
                ...status,
                experienceDetails: "error"
            })
            return;
        }
        setUpdateChange({
            ...updateChange,
            experienceDetailsChange: false
        })
        setStatus({
            ...status,
            experienceDetails: "done"
        })
    }

    async function handleSubmitProjectDetails(e) {
        e.preventDefault()
        setStatus({
            ...status,
            projectDetails: "loading"
        })
        try {
            const { data, error } = await supabase
                .from('resume-details')
                .update([
                    {
                        projects: projectDetails
                    }
                ])
                .eq('user_email', user.email);

            if (error) {
                console.log(error);
                toast.error("Something went wrong")
                setStatus({
                    ...status,
                    projectDetails: "error"
                })
                return;
            } else {
                setComplete({
                    ...complete,
                    projectDetailsComplete: true
                })
                toast.info("Project Details Saved")
            }
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong")
            setStatus({
                ...status,
                projectDetails: "error"
            })
            return;
        }
        setUpdateChange({
            ...updateChange,
            projectDetailsChange: false
        })
        setStatus({
            ...status,
            projectDetails: "done"
        })
    }

    async function handleSubmitAchievementDetails(e) {
        e.preventDefault()
        setStatus({
            ...status,
            achievementDetails: "loading"
        })
        try {
            const { data, error } = await supabase
                .from('resume-details')
                .update([
                    {
                        achievements: achievementDetails
                    }
                ])
                .eq('user_email', user.email);

            if (error) {
                console.log(error);
                toast.error("Something went wrong")
                setStatus({
                    ...status,
                    achievementDetails: "error"
                })
                return;
            } else {
                setComplete({
                    ...complete,
                    achievementDetailsComplete: true
                })
                toast.info("Achivements Details Saved")
            }
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong")
            setStatus({
                ...status,
                achievementDetails: "error"
            })
            return;
        }
        setUpdateChange({
            ...updateChange,
            achievementDetailsChange: false
        })
        setStatus({
            ...status,
            achievementDetails: "done"
        })
    }

    async function handleSubmitExtraCurricularDetails(e) {
        e.preventDefault()
        setStatus({
            ...status,
            extraCurricularDetails: "loading"
        })
        try {
            const { data, error } = await supabase
                .from('resume-details')
                .update([
                    {
                        extra_curricular: extraCurricularDetails
                    }
                ])
                .eq('user_email', user.email);

            if (error) {
                console.log(error);
                toast.error("Something went wrong")
                setStatus({
                    ...status,
                    extraCurricularDetails: "error"
                })
                return;
            } else {
                setComplete({
                    ...complete,
                    extraCurricularDetailsComplete: true
                })
                toast.info("Extra Curricular Details Saved")
            }
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong")
            setStatus({
                ...status,
                extraCurricularDetails: "error"
            })
            return;
        }
        setUpdateChange({
            ...updateChange,
            extraCurricularDetailsChange: false
        })
        setStatus({
            ...status,
            extraCurricularDetails: "done"
        })
    }

    async function handleSubmitSkillDetails(e) {
        e.preventDefault()
        setStatus({
            ...status,
            skillDetails: "loading"
        })
        try {
            const { data, error } = await supabase
                .from('resume-details')
                .update([
                    {
                        skills: skillDetails
                    }
                ])
                .eq('user_email', user.email);

            if (error) {
                console.log(error);
                toast.error("Something went wrong")
                setStatus({
                    ...status,
                    skillDetails: "error"
                })
                return;
            } else {
                setComplete({
                    ...complete,
                    skillDetailsComplete: true
                })
                toast.info("Skill Details Saved")
            }
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong")
            setStatus({
                ...status,
                skillDetails: "error"
            })
            return;
        }
        setUpdateChange({
            ...updateChange,
            skillDetailsChange: false
        })
        setStatus({
            ...status,
            skillDetails: "done"
        })
    }

    async function createResumeUtil(e) {
        e.preventDefault()
        setCreateResumeStatus("loading")
        const resume = await createResume(user.email)
        const base64EncodedContent = btoa(resume);
        const form = document.createElement('form');
        form.method = 'post';
        form.action = 'https://www.overleaf.com/docs';
        form.target = '_blank';
        form.className = "hidden"

        // Create an input field for snip_uri
        const inputUri = document.createElement('input');
        inputUri.type = 'text';
        inputUri.name = 'snip_uri';
        inputUri.value = `data:application/x-tex;base64,${base64EncodedContent}`;
        inputUri.className = "hidden"

        // Create an input field for snip_name
        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.name = 'snip_name';
        inputName.value = `${personalDetails?.fullName.slice(0, personalDetails?.fullName.indexOf(' ')).toLowerCase()}_resume_coding75`;
        inputName.className = "hidden"
        // Append the input fields to the form
        form.appendChild(inputUri);
        form.appendChild(inputName);

        // Submit the form
        document.body.appendChild(form);
        form.submit();
        setCreateResumeStatus("pending")
    }

    return (
        <>
            {/* <div>
        <Navbar isLogo={true}/>
        </div> */}
            <div className="mt-10 flex md:hidden justify-center items-center">
                <div className="w-[calc(90%)] aspect-video hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] z-40">
                    <Image
                        className="cursor-pointer w-full h-full rounded-xl p-1"
                        src={resumeBuilderPic}
                        alt="coding75-pro" />
                </div>
            </div>
            <div className='mt-5 lg:container md:container px-3 overflow-y-scroll'>
                <header >
                    <div className="mx-auto mb-5 px-4 sm:px-6 py-4 lg:px-8">
                        <div className="sm:flex sm:items-center sm:justify-between">
                            <div className="text-left sm:text-left">
                                <h1 className="text-2xl mr-5 font-bold text-gray-900 sm:text-3xl flex items-center text-left justify-start"><ScrollText className='mr-2' /> Resume Builder</h1>
                                <p className="mt-1.5 text-sm text-gray-500">Create an ATS Friendly Latex Resume 🚀</p>
                                <p className="mt-2 text-sm text-gray-500">Having difficulty in making resume? <a className='underline text-red-600 font-semibold' href="https://youtu.be/VLZ1YCw5cY8" target="_blank">Watch Walkthrough</a> 🎯</p>
                            </div>
                            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                                {
                                    user != null &&
                                    <>
                                        {
                                            (complete.achievementDetailsComplete &&
                                                complete.educationDetailsComplete &&
                                                complete.experienceDetailsComplete &&
                                                complete.extraCurricularDetailsComplete &&
                                                complete.personalDetailsComplete &&
                                                complete.projectDetailsComplete &&
                                                complete.skillDetailsComplete) ?
                                                <button
                                                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-400 bg-white px-5 py-3 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring"
                                                    type="button"
                                                    disabled={createResumeStatus == "loading"}
                                                    onClick={createResumeUtil}
                                                >
                                                    <span className="text-sm flex items-center font-medium">
                                                        {
                                                            createResumeStatus == "loading" ?
                                                                <>
                                                                    <RotateCw className='h-4 w-4 animate-spin mr-2' /> Building Resume
                                                                </>
                                                                :
                                                                <>
                                                                    Build Resume <ExternalLink className="h-4 w-4 ml-2" />
                                                                </>
                                                        }
                                                    </span>

                                                </button>
                                                :
                                                <TooltipProvider delayDuration={0} >
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-400 bg-white px-5 py-3 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring"
                                                                type="button"
                                                                disabled
                                                            >
                                                                <span className="text-sm font-medium"> Build Resume </span>
                                                                <ExternalLink className="h-4 w-4" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom">
                                                            <p>Complete All the Fields to Build Resume</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                        }
                                    </>

                                }
                                <Link
                                    href="/pro"
                                    className="block text-center rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-700 focus:outline-none focus:ring"
                                >
                                    Resume Review - coding75 Pro 🚀
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>
                {
                    status.loadData == "done" &&
                    <>
                        {
                            user == null ?
                                <>
                                    <LoginRequiredPage />
                                </> :
                                <>
                                    <div className='grid grid-cols-12 gap-x-5'>
                                        <div className='lg:col-span-3 md:col-span-4 col-span-12'>
                                            <div>
                                                <div>
                                                    <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                                                        {resumeButtons.map((tab, index) => (
                                                            <li className='w-full' key={index}>
                                                                <button onClick={() => { setCurrentTab(tab.tab) }} className={cn("hover:border hoverborder-gray-600 inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white", currentTab == tab.tab && "hover:text-primary-900 text-primary-800 bg-primary-100 hover:bg-primary-200 border border-primary-600")}>
                                                                    <tab.icon className="w-5 h-5 me-2" />
                                                                    {tab.label}
                                                                    {
                                                                        complete.loading ?
                                                                            <>
                                                                                <span className='text-xs text-right ml-auto text-blue-600 flex items-center'>
                                                                                    <RotateCw className='animate-spin h-4 w-4 mr-1' /> loading
                                                                                </span>

                                                                            </>
                                                                            :
                                                                            <>
                                                                                {
                                                                                    (complete[tab.completeKey] == false && updateChange[tab.changeKey] == false) ?
                                                                                        <>
                                                                                            <span className='text-xs text-right ml-auto text-amber-600 flex items-center'>
                                                                                                <AlertCircle className='h-4 w-4 mr-1' /> incomplete
                                                                                            </span>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <span className='text-xs text-right flex ml-auto'>
                                                                                                {updateChange[tab.changeKey] ? <>
                                                                                                    <span className='text-yellow-600 flex items-center'>
                                                                                                        <UploadCloud className='h-4 w-4 mr-1' /> unsaved
                                                                                                    </span>
                                                                                                </> :
                                                                                                    <>
                                                                                                        <span className='text-green-600 flex items-center'>
                                                                                                            <Check className='h-4 w-4 mr-1' /> saved
                                                                                                        </span>
                                                                                                    </>
                                                                                                }
                                                                                            </span>
                                                                                        </>
                                                                                }
                                                                            </>
                                                                    }
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='lg:col-span-9 md:col-span-8 col-span-12'>
                                            {
                                                currentTab == "personal-details" &&
                                                <form onSubmit={handleSubmitPersonalDetails}>
                                                    <Card className="w-full shadow-lg rounded-2xl min-h-screen">
                                                        <CardHeader>
                                                            <div className="flex">
                                                                <div>
                                                                    <CardTitle className='mb-2'>Personal Details</CardTitle>
                                                                    <CardDescription>Enter your personal details.</CardDescription>
                                                                </div>
                                                                <div className='flex-grow'></div>
                                                                <div className='flex items-center justify-end'>
                                                                    {
                                                                        updateChange.personalDetailsChange &&
                                                                        <p className='mr-2 text-gray-600 text-sm'>unsaved changes *</p>
                                                                    }
                                                                    {
                                                                        status.personalDetails == "loading" ?
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><RotateCw className='animate-spin h-4 w-4 mr-2' /> Saving...</Button>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><SaveAll className='h-4 w-4 mr-2' /> Save</Button>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <Separator />
                                                        <CardContent className='mt-5'>

                                                            <div className="grid lg:grid-cols-2 w-full items-center gap-4">
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="name">Name*</Label>
                                                                    <Input
                                                                        value={personalDetails?.fullName}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    personalDetailsChange: true
                                                                                }
                                                                            )
                                                                            setPersonalDetails({
                                                                                ...personalDetails,
                                                                                fullName: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='text' id="name" placeholder="Full Name" />
                                                                </div>
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="email">Email*</Label>
                                                                    <Input
                                                                        value={personalDetails?.email}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    personalDetailsChange: true
                                                                                }
                                                                            )
                                                                            setPersonalDetails({
                                                                                ...personalDetails,
                                                                                email: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='email' id="email" placeholder="Email" />
                                                                </div>
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="contact-number">Contact Number*</Label>
                                                                    <Input
                                                                        value={personalDetails?.contactNumber}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    personalDetailsChange: true
                                                                                }
                                                                            )
                                                                            setPersonalDetails({
                                                                                ...personalDetails,
                                                                                contactNumber: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='number' id="contact-number" placeholder="Contact Number" />
                                                                </div>
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="address">Address*</Label>
                                                                    <Input
                                                                        value={personalDetails?.address}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    personalDetailsChange: true
                                                                                }
                                                                            )
                                                                            setPersonalDetails({
                                                                                ...personalDetails,
                                                                                address: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='text' id="address" placeholder="Address" />
                                                                </div>
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="pin-code">Pin Code*</Label>
                                                                    <Input
                                                                        value={personalDetails?.pincode}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    personalDetailsChange: true
                                                                                }
                                                                            )
                                                                            setPersonalDetails({
                                                                                ...personalDetails,
                                                                                pincode: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='number' id="pin-code" placeholder="Pin Code" />
                                                                </div>
                                                            </div>
                                                            <Separator className='my-5' />
                                                            <p className='mb-5 font-semibold'>Social Links</p>
                                                            <div className="grid w-full items-center gap-4">
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="linkedin">Linkedin*</Label>
                                                                    <Input
                                                                        value={socialLinks?.linkedin}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    personalDetailsChange: true
                                                                                }
                                                                            )
                                                                            setSocialLinks({
                                                                                ...socialLinks,
                                                                                linkedin: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='text' id="linkedin" placeholder="Linkedin Profile Link" />
                                                                </div>
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="github">Github*</Label>
                                                                    <Input
                                                                        value={socialLinks?.github}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    personalDetailsChange: true
                                                                                }
                                                                            )
                                                                            setSocialLinks({
                                                                                ...socialLinks,
                                                                                github: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='text' id="github" placeholder="Github Profile Link" />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </form>
                                            }
                                            {
                                                currentTab == "education" &&
                                                <form onSubmit={handleSubmitEducationDetails}>
                                                    <Card className="w-full shadow-lg rounded-2xl min-h-screen">
                                                        <CardHeader>
                                                            <div className="flex">
                                                                <div>
                                                                    <CardTitle className='mb-2'>Education Details</CardTitle>
                                                                    <CardDescription>Enter your education details.</CardDescription>
                                                                </div>
                                                                <div className='flex-grow'></div>
                                                                <div className='flex items-center justify-end'>
                                                                    {
                                                                        updateChange.educationDetailsChange &&
                                                                        <p className='mr-2 text-gray-600 text-sm'>unsaved changes *</p>
                                                                    }
                                                                    {
                                                                        status.educationDetails == "loading" ?
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><RotateCw className='animate-spin h-4 w-4 mr-2' /> Saving...</Button>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><SaveAll className='h-4 w-4 mr-2' /> Save</Button>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <Separator />
                                                        <CardContent className='mt-5'>
                                                            {
                                                                educationDetails.map((data, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            <div className='mb-5 flex'>
                                                                                <p className='text-gray-700 font-semibold'>Education {index + 1}</p>
                                                                                <button
                                                                                    onClick={
                                                                                        (e) => {
                                                                                            e.preventDefault()
                                                                                            const educationDetailsTemp = educationDetails.filter((data, index1) => {
                                                                                                if (index != index1) {
                                                                                                    return true
                                                                                                }
                                                                                            })
                                                                                            setEducationDetails(educationDetailsTemp)
                                                                                            setUpdateChange({
                                                                                                ...updateChange,
                                                                                                educationDetailsChange: true
                                                                                            })
                                                                                        }
                                                                                    }
                                                                                    className='ml-5 text-red-600 text-sm flex justify-center items-center'>
                                                                                    <Trash2Icon className='w-3 h-3 mr-1' /> remove</button>
                                                                            </div>
                                                                            <div className="grid lg:grid-cols-2 w-full items-center gap-4">

                                                                                <div className="flex lg:col-span-2 flex-col space-y-1.5">
                                                                                    <Label htmlFor="University">University Name*</Label>
                                                                                    <Input
                                                                                        value={educationDetails[index]?.universityName}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    educationDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const educationDetailsTemp = educationDetails
                                                                                            educationDetailsTemp[index].universityName = e.target.value
                                                                                            setEducationDetails(educationDetailsTemp)
                                                                                        }}
                                                                                        required type='text' id="University" placeholder="University Name" />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label htmlFor="degree">Degree Name*</Label>
                                                                                    <Input
                                                                                        value={educationDetails[index]?.degreeName}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    educationDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const educationDetailsTemp = educationDetails
                                                                                            educationDetailsTemp[index].degreeName = e.target.value
                                                                                            setEducationDetails(educationDetailsTemp)
                                                                                        }}
                                                                                        required type="text"
                                                                                        id="degree"
                                                                                        placeholder="Bachelor of Technology"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label>Branch Name*</Label>
                                                                                    <Input
                                                                                        value={educationDetails[index]?.branch}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    educationDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const educationDetailsTemp = educationDetails
                                                                                            educationDetailsTemp[index].branch = e.target.value
                                                                                            setEducationDetails(educationDetailsTemp)
                                                                                        }}
                                                                                        required type="text"
                                                                                        id="branch"
                                                                                        placeholder="Information Technology"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label>From</Label>
                                                                                    <Input
                                                                                        value={educationDetails[index]?.fromDate}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    educationDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const educationDetailsTemp = educationDetails
                                                                                            educationDetailsTemp[index].fromDate = e.target.value
                                                                                            setEducationDetails(educationDetailsTemp)
                                                                                        }}
                                                                                        type='text' id="fromdate" placeholder="for example- May 2020" />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label>To (Expected)</Label>
                                                                                    <Input
                                                                                        value={educationDetails[index]?.toDate}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    educationDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const educationDetailsTemp = educationDetails
                                                                                            educationDetailsTemp[index].toDate = e.target.value
                                                                                            setEducationDetails(educationDetailsTemp)
                                                                                        }}
                                                                                        type='text' id="todate" placeholder="for example- June 2024" />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label>Score</Label>
                                                                                    <Input
                                                                                        value={educationDetails[index]?.score}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    educationDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const educationDetailsTemp = educationDetails
                                                                                            educationDetailsTemp[index].score = e.target.value
                                                                                            setEducationDetails(educationDetailsTemp)
                                                                                        }}
                                                                                        type='text' id="score" placeholder="CGPA- 8.5 or 95%" />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label>Location</Label>
                                                                                    <Input
                                                                                        value={educationDetails[index]?.location}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    educationDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const educationDetailsTemp = educationDetails
                                                                                            educationDetailsTemp[index].location = e.target.value
                                                                                            setEducationDetails(educationDetailsTemp)
                                                                                        }}
                                                                                        type='text' id="location" placeholder="Bangalore or Remote" />
                                                                                </div>
                                                                            </div>
                                                                            <Separator className='my-5' />
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {
                                                                <div className='flex items-center justify-center'>
                                                                    <button
                                                                        onClick={
                                                                            (e) => {
                                                                                e.preventDefault()
                                                                                const educationDetailsTemp = educationDetails
                                                                                educationDetailsTemp.push(
                                                                                    {
                                                                                        universityName: undefined,
                                                                                        degreeName: undefined,
                                                                                        score: undefined,
                                                                                        fromDate: undefined,
                                                                                        toDate: undefined,
                                                                                        location: undefined,
                                                                                        branch: undefined
                                                                                    }
                                                                                )
                                                                                setEducationDetails(educationDetailsTemp)
                                                                                setUpdateChange({
                                                                                    ...updateChange,
                                                                                    educationDetailsChange: true
                                                                                })
                                                                            }
                                                                        }
                                                                        className='ml-5 text-blue-600 text-sm flex justify-center items-center'>
                                                                        <Plus className='w-3 h-3 mr-1' />
                                                                        Add Education</button>
                                                                </div>
                                                            }
                                                        </CardContent>
                                                    </Card>
                                                </form>
                                            }
                                            {
                                                currentTab == "experience" &&
                                                <form onSubmit={handleSubmitExperienceDetails}>
                                                    <Card className="w-full shadow-lg rounded-2xl min-h-screen">
                                                        <CardHeader>
                                                            <div className="flex">
                                                                <div>
                                                                    <CardTitle className='mb-2'>Experience Details</CardTitle>
                                                                    <CardDescription>Enter your experience details.</CardDescription>
                                                                </div>
                                                                <div className='flex-grow'></div>
                                                                <div className='flex items-center justify-end'>
                                                                    {
                                                                        updateChange.experienceDetailsChange &&
                                                                        <p className='mr-2 text-gray-600 text-sm'>unsaved changes *</p>
                                                                    }
                                                                    {
                                                                        status.experienceDetails == "loading" ?
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><RotateCw className='animate-spin h-4 w-4 mr-2' /> Saving...</Button>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><SaveAll className='h-4 w-4 mr-2' /> Save</Button>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <Separator />
                                                        <CardContent className='mt-5'>
                                                            {
                                                                experienceDetails.map((data, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            <div className='mb-5 flex'>
                                                                                <p className='text-gray-700 font-semibold'>Experience {index + 1}</p>
                                                                                <button
                                                                                    onClick={
                                                                                        (e) => {
                                                                                            e.preventDefault()
                                                                                            const experienceDetailsTemp = experienceDetails.filter((data, index1) => {
                                                                                                if (index != index1) {
                                                                                                    return true
                                                                                                }
                                                                                            })
                                                                                            setExperienceDetails(experienceDetailsTemp)
                                                                                            setUpdateChange({
                                                                                                ...updateChange,
                                                                                                experienceDetailsChange: true
                                                                                            })
                                                                                        }
                                                                                    }
                                                                                    className='ml-5 text-red-600 text-sm flex justify-center items-center'>
                                                                                    <Trash2Icon className='w-3 h-3 mr-1' /> remove</button>
                                                                            </div>
                                                                            <div className="grid lg:grid-cols-2 w-full items-center gap-4">

                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label htmlFor="jobrole">Job Role*</Label>
                                                                                    <Input
                                                                                        value={experienceDetails[index]?.jobRole}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    experienceDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const experienceDetailsTemp = experienceDetails
                                                                                            experienceDetailsTemp[index].jobRole = e.target.value
                                                                                            setExperienceDetails(experienceDetailsTemp)
                                                                                        }}
                                                                                        required type='text' id="jobrole" placeholder="Software Developement Engineer" />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label htmlFor="company">Company Name*</Label>
                                                                                    <Input
                                                                                        value={experienceDetails[index]?.companyName}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    experienceDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const experienceDetailsTemp = experienceDetails
                                                                                            experienceDetailsTemp[index].companyName = e.target.value
                                                                                            setExperienceDetails(experienceDetailsTemp)
                                                                                        }}
                                                                                        required type="text"
                                                                                        id="company"
                                                                                        placeholder="Google"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label>From</Label>
                                                                                    <Input
                                                                                        value={experienceDetails[index]?.fromDate}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    experienceDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const experienceDetailsTemp = experienceDetails
                                                                                            experienceDetailsTemp[index].fromDate = e.target.value
                                                                                            setExperienceDetails(experienceDetailsTemp)
                                                                                        }}
                                                                                        type='text' id="fromdatejob" placeholder="for example- May 2020" />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label>To (or Present)</Label>
                                                                                    <Input
                                                                                        value={experienceDetails[index]?.toDate}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    experienceDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const experienceDetailsTemp = experienceDetails
                                                                                            experienceDetailsTemp[index].toDate = e.target.value
                                                                                            setExperienceDetails(experienceDetailsTemp)
                                                                                        }}
                                                                                        type='text' id="todatejob" placeholder="for example- Present" />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label>Location</Label>
                                                                                    <Input
                                                                                        value={experienceDetails[index]?.location}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    experienceDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const experienceDetailsTemp = experienceDetails
                                                                                            experienceDetailsTemp[index].location = e.target.value
                                                                                            setExperienceDetails(experienceDetailsTemp)
                                                                                        }}
                                                                                        type='text' id="locationjob" placeholder="Bangalore or Remote" />
                                                                                </div>
                                                                                <div className="flex col-span-2 flex-col space-y-1.5">
                                                                                    <Label>Job Details</Label>
                                                                                    {experienceDetails[index]?.details?.map((data, index1) => {
                                                                                        return (
                                                                                            <div
                                                                                                key={index1}
                                                                                                className='flex items-center'
                                                                                            >
                                                                                                <p className='mr-2 text-sm flex'>Detail-<span>{index1 + 1}</span></p>
                                                                                                <Input

                                                                                                    value={experienceDetails[index]?.details?.[index1]}
                                                                                                    onChange={(e) => {
                                                                                                        setUpdateChange(
                                                                                                            {
                                                                                                                ...updateChange,
                                                                                                                experienceDetailsChange: true
                                                                                                            }
                                                                                                        )
                                                                                                        const experienceDetailsTemp = experienceDetails
                                                                                                        experienceDetailsTemp[index].details[index1] = e.target.value
                                                                                                        setExperienceDetails(experienceDetailsTemp)
                                                                                                    }}
                                                                                                    id="jobdetails" required placeholder="I worked with frontend team to develop application." />
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                    <div
                                                                                        className='flex mt-3 items-center'
                                                                                    >
                                                                                        <button
                                                                                            onClick={
                                                                                                (e) => {
                                                                                                    e.preventDefault()
                                                                                                    setUpdateChange(
                                                                                                        {
                                                                                                            ...updateChange,
                                                                                                            experienceDetailsChange: true
                                                                                                        }
                                                                                                    )
                                                                                                    const experienceDetailsTemp = experienceDetails
                                                                                                    experienceDetailsTemp[index].details.push("")
                                                                                                    setExperienceDetails(experienceDetailsTemp)
                                                                                                }
                                                                                            }
                                                                                            className='text-xs text-blue-600 flex items-center'>
                                                                                            <Plus className='mr-1 h-3 w-3' /> Add New Detail
                                                                                        </button>
                                                                                        {
                                                                                            experienceDetails?.[index]?.details?.length > 0 &&
                                                                                            <button
                                                                                                onClick={
                                                                                                    (e) => {
                                                                                                        e.preventDefault()
                                                                                                        setUpdateChange(
                                                                                                            {
                                                                                                                ...updateChange,
                                                                                                                experienceDetailsChange: true
                                                                                                            }
                                                                                                        )
                                                                                                        const experienceDetailsTemp = experienceDetails
                                                                                                        experienceDetailsTemp[index].details.pop()
                                                                                                        setExperienceDetails(experienceDetailsTemp)
                                                                                                    }
                                                                                                }
                                                                                                className='text-xs ml-2 text-red-600 flex items-center'>
                                                                                                <Minus className='mr-1 h-3 w-3' /> Delete Last
                                                                                            </button>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <Separator className='my-5' />
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {
                                                                <div className='flex items-center justify-center'>
                                                                    <button
                                                                        onClick={
                                                                            (e) => {
                                                                                e.preventDefault()
                                                                                const experienceDetailsTemp = experienceDetails
                                                                                experienceDetailsTemp.push(
                                                                                    {
                                                                                        jobRole: undefined,
                                                                                        companyName: undefined,
                                                                                        fromDate: undefined,
                                                                                        toDate: undefined,
                                                                                        location: undefined,
                                                                                        details: [undefined]
                                                                                    }
                                                                                )
                                                                                setExperienceDetails(experienceDetailsTemp)
                                                                                setUpdateChange({
                                                                                    ...updateChange,
                                                                                    experienceDetailsChange: true
                                                                                })
                                                                            }
                                                                        }
                                                                        className='ml-5 text-blue-600 text-sm flex justify-center items-center'>
                                                                        <Plus className='w-3 h-3 mr-1' />
                                                                        Add Experience</button>
                                                                </div>
                                                            }
                                                        </CardContent>
                                                    </Card>
                                                </form>
                                            }
                                            {
                                                currentTab == "projects" &&
                                                <form onSubmit={handleSubmitProjectDetails}>
                                                    <Card className="w-full shadow-lg rounded-2xl min-h-screen">
                                                        <CardHeader>
                                                            <div className="flex">
                                                                <div>
                                                                    <CardTitle className='mb-2'>Project Details</CardTitle>
                                                                    <CardDescription>Enter your project details.</CardDescription>
                                                                </div>
                                                                <div className='flex-grow'></div>
                                                                <div className='flex items-center justify-end'>
                                                                    {
                                                                        updateChange.projectDetailsChange &&
                                                                        <p className='mr-2 text-gray-600 text-sm'>unsaved changes *</p>
                                                                    }
                                                                    {
                                                                        status.projectDetails == "loading" ?
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><RotateCw className='animate-spin h-4 w-4 mr-2' /> Saving...</Button>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><SaveAll className='h-4 w-4 mr-2' /> Save</Button>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <Separator />
                                                        <CardContent className='mt-5'>
                                                            {
                                                                projectDetails.map((data, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            <div className='mb-5 flex'>
                                                                                <p className='text-gray-700 font-semibold'>Project {index + 1}</p>
                                                                                <button
                                                                                    onClick={
                                                                                        (e) => {
                                                                                            e.preventDefault()
                                                                                            const projectDetailsTemp = projectDetails.filter((data, index1) => {
                                                                                                if (index != index1) {
                                                                                                    return true
                                                                                                }
                                                                                            })
                                                                                            setProjectDetails(projectDetailsTemp)
                                                                                            setUpdateChange({
                                                                                                ...updateChange,
                                                                                                projectDetailsChange: true
                                                                                            })
                                                                                        }
                                                                                    }
                                                                                    className='ml-5 text-red-600 text-sm flex justify-center items-center'>
                                                                                    <Trash2Icon className='w-3 h-3 mr-1' /> remove</button>
                                                                            </div>
                                                                            <div className="grid lg:grid-cols-2 w-full items-center gap-4">
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label htmlFor="project">Project Name*</Label>
                                                                                    <Input
                                                                                        value={projectDetails[index]?.projectName}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    projectDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const projectDetailsTemp = projectDetails
                                                                                            projectDetailsTemp[index].projectName = e.target.value
                                                                                            setProjectDetails(projectDetailsTemp)
                                                                                        }}
                                                                                        required type="text"
                                                                                        id="project"
                                                                                        placeholder="Notes App"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label htmlFor="techstack">Tech Stack Used (Separate with commas)*</Label>
                                                                                    <Input
                                                                                        value={projectDetails[index]?.techStack}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    projectDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const projectDetailsTemp = projectDetails
                                                                                            projectDetailsTemp[index].techStack = e.target.value
                                                                                            setProjectDetails(projectDetailsTemp)
                                                                                        }}
                                                                                        required type="text"
                                                                                        id="techstack"
                                                                                        placeholder="HTML, CSS, JS, ReactJS, NodeJS"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label htmlFor="deployLink">Deploy Link</Label>
                                                                                    <Input
                                                                                        value={projectDetails[index]?.deployLink}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    projectDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const projectDetailsTemp = projectDetails
                                                                                            projectDetailsTemp[index].deployLink = e.target.value
                                                                                            setProjectDetails(projectDetailsTemp)
                                                                                        }}
                                                                                        type="text"
                                                                                        id="deployLink"
                                                                                        placeholder="https://coding75.com"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label htmlFor="githubLink">Github Link</Label>
                                                                                    <Input
                                                                                        value={projectDetails[index]?.githubLink}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    projectDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const projectDetailsTemp = projectDetails
                                                                                            projectDetailsTemp[index].githubLink = e.target.value
                                                                                            setProjectDetails(projectDetailsTemp)
                                                                                        }}
                                                                                        type="text"
                                                                                        id="githubLink"
                                                                                        placeholder="https://github.com/myproject"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label>From</Label>
                                                                                    <Input
                                                                                        value={projectDetails[index]?.fromDate}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    projectDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const projectDetailsTemp = projectDetails
                                                                                            projectDetailsTemp[index].fromDate = e.target.value
                                                                                            setProjectDetails(projectDetailsTemp)
                                                                                        }}
                                                                                        type='text' id="fromdateproject" placeholder="for example- June 2023" />
                                                                                </div>
                                                                                <div className="flex flex-col space-y-1.5">
                                                                                    <Label>To (or Present)</Label>
                                                                                    <Input
                                                                                        value={projectDetails[index]?.toDate}
                                                                                        onChange={(e) => {
                                                                                            setUpdateChange(
                                                                                                {
                                                                                                    ...updateChange,
                                                                                                    projectDetailsChange: true
                                                                                                }
                                                                                            )
                                                                                            const projectDetailsTemp = projectDetails
                                                                                            projectDetailsTemp[index].toDate = e.target.value
                                                                                            setProjectDetails(projectDetailsTemp)
                                                                                        }}
                                                                                        type='text' id="todateproject" placeholder="for example- Present" />
                                                                                </div>
                                                                                <div className="flex col-span-2 flex-col space-y-1.5">
                                                                                    <Label>Project Details</Label>
                                                                                    {projectDetails[index]?.details?.map((data, index1) => {
                                                                                        return (
                                                                                            <div
                                                                                                key={index1}
                                                                                                className='flex items-center'
                                                                                            >
                                                                                                <p className='mr-2 text-sm flex'>Detail-<span>{index1 + 1}</span></p>
                                                                                                <Input

                                                                                                    value={projectDetails[index]?.details?.[index1]}
                                                                                                    onChange={(e) => {
                                                                                                        setUpdateChange(
                                                                                                            {
                                                                                                                ...updateChange,
                                                                                                                projectDetailsChange: true
                                                                                                            }
                                                                                                        )
                                                                                                        const projectDetailsTemp = projectDetails
                                                                                                        projectDetailsTemp[index].details[index1] = e.target.value
                                                                                                        setProjectDetails(projectDetailsTemp)
                                                                                                    }}
                                                                                                    id="projectdetails" required placeholder="Created a frontend application using HTML, CSS, JSS." />
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                    <div
                                                                                        className='flex mt-3 items-center'
                                                                                    >
                                                                                        <button
                                                                                            onClick={
                                                                                                (e) => {
                                                                                                    e.preventDefault()
                                                                                                    setUpdateChange(
                                                                                                        {
                                                                                                            ...updateChange,
                                                                                                            projectDetailsChange: true
                                                                                                        }
                                                                                                    )
                                                                                                    const projectDetailsTemp = projectDetails
                                                                                                    projectDetailsTemp[index].details.push("")
                                                                                                    setProjectDetails(projectDetailsTemp)
                                                                                                }
                                                                                            }
                                                                                            className='text-xs text-blue-600 flex items-center'>
                                                                                            <Plus className='mr-1 h-3 w-3' /> Add New Detail
                                                                                        </button>
                                                                                        {
                                                                                            projectDetails[index]?.details?.length > 0 &&
                                                                                            <button
                                                                                                onClick={
                                                                                                    (e) => {
                                                                                                        e.preventDefault()
                                                                                                        setUpdateChange(
                                                                                                            {
                                                                                                                ...updateChange,
                                                                                                                projectDetailsChange: true
                                                                                                            }
                                                                                                        )
                                                                                                        const projectDetailsTemp = projectDetails
                                                                                                        projectDetailsTemp[index].details.pop()
                                                                                                        setProjectDetails(projectDetailsTemp)
                                                                                                    }
                                                                                                }
                                                                                                className='text-xs ml-2 text-red-600 flex items-center'>
                                                                                                <Minus className='mr-1 h-3 w-3' /> Delete Last
                                                                                            </button>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <Separator className='my-5' />
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {
                                                                <div className='flex items-center justify-center'>
                                                                    <button
                                                                        onClick={
                                                                            (e) => {
                                                                                e.preventDefault()
                                                                                const projectDetailsTemp = projectDetails
                                                                                projectDetailsTemp.push(
                                                                                    {
                                                                                        projectName: undefined,
                                                                                        techStack: undefined,
                                                                                        fromDate: undefined,
                                                                                        toDate: undefined,
                                                                                        deployLink: undefined,
                                                                                        githubLink: undefined,
                                                                                        details: [
                                                                                            undefined
                                                                                        ]
                                                                                    }
                                                                                )
                                                                                setProjectDetails(projectDetailsTemp)
                                                                                setUpdateChange({
                                                                                    ...updateChange,
                                                                                    projectDetailsChange: true
                                                                                })
                                                                            }
                                                                        }
                                                                        className='ml-5 text-blue-600 text-sm flex justify-center items-center'>
                                                                        <Plus className='w-3 h-3 mr-1' />
                                                                        Add Project</button>
                                                                </div>
                                                            }
                                                        </CardContent>
                                                    </Card>
                                                </form>
                                            }
                                            {
                                                currentTab == "achievements" &&
                                                <form onSubmit={handleSubmitAchievementDetails}>
                                                    <Card className="w-full shadow-lg rounded-2xl min-h-screen">
                                                        <CardHeader>
                                                            <div className="flex">
                                                                <div>
                                                                    <CardTitle className='mb-2'>Achievement Details</CardTitle>
                                                                    <CardDescription>Enter your achievement details.</CardDescription>
                                                                </div>
                                                                <div className='flex-grow'></div>
                                                                <div className='flex items-center justify-end'>
                                                                    {
                                                                        updateChange.achievementDetailsChange &&
                                                                        <p className='mr-2 text-gray-600 text-sm'>unsaved changes *</p>
                                                                    }
                                                                    {
                                                                        status.achievementDetails == "loading" ?
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><RotateCw className='animate-spin h-4 w-4 mr-2' /> Saving...</Button>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <Button type='submit' className='bg-primary-600 hover:bg-primary-700' variant="basic"><SaveAll className='h-4 w-4 mr-2' /> Save</Button>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <Separator />
                                                        <CardContent className='mt-5'>
                                                            <div className="flex col-span-2 flex-col space-y-3">
                                                                <Label className='mb-2'>List Your Achievements</Label>
                                                                {achievementDetails?.details?.map((data, index1) => {
                                                                    return (
                                                                        <div
                                                                            key={index1}
                                                                        >
                                                                            <div className='mb-2 flex items-center'>
                                                                                <Label>Achievements {index1 + 1}</Label>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        setUpdateChange(
                                                                                            {
                                                                                                ...updateChange,
                                                                                                achievementDetailsChange: true
                                                                                            }
                                                                                        )
                                                                                        const achievementDetailsTemp = [""]
                                                                                        achievementDetails["details"].map((detail: any, index) => {
                                                                                            if (index != index1) {
                                                                                                achievementDetailsTemp.push(detail)
                                                                                            }
                                                                                        })
                                                                                        setAchievementDetails({
                                                                                            details: achievementDetailsTemp.slice(1)
                                                                                        })
                                                                                    }}
                                                                                    className='text-red-600 ml-2'>
                                                                                    <Trash2Icon className='h-3 w-3' />
                                                                                </button>
                                                                            </div>
                                                                            <Input

                                                                                value={achievementDetails?.details?.[index1]}
                                                                                onChange={(e) => {
                                                                                    setUpdateChange(
                                                                                        {
                                                                                            ...updateChange,
                                                                                            achievementDetailsChange: true
                                                                                        }
                                                                                    )
                                                                                    const achievementDetailsTemp = achievementDetails
                                                                                    achievementDetailsTemp["details"][index1] = e.target.value
                                                                                    setAchievementDetails(achievementDetailsTemp)
                                                                                }}
                                                                                id="achievementdetails" required
                                                                                placeholder={[
                                                                                    "Max. CodeForces Rating – 1648 (Expert)",
                                                                                    "Max. CodeChef Rating – 2157 (5*)",
                                                                                    "Qualified for ACM-ICPC Regionals 2022 with Rank of 57.",
                                                                                    "Secured Global Rank 22 in Codechef April Lunchtime 2022 out of 2,100 (top 1.0 percent )."
                                                                                ][index1 % 4]} />
                                                                        </div>
                                                                    )
                                                                })}
                                                                <div
                                                                    className='flex mt-5 justify-center items-center'
                                                                >
                                                                    <button
                                                                        onClick={
                                                                            (e) => {
                                                                                e.preventDefault()
                                                                                setUpdateChange(
                                                                                    {
                                                                                        ...updateChange,
                                                                                        achievementDetailsChange: true
                                                                                    }
                                                                                )
                                                                                const achievementDetailsTemp = achievementDetails
                                                                                achievementDetailsTemp.details.push("")
                                                                                setAchievementDetails(achievementDetailsTemp)
                                                                            }
                                                                        }
                                                                        className='text-sm text-blue-600 flex items-center'>
                                                                        <Plus className='mr-1 h-3 w-3' /> Add New Achievement
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </form>
                                            }
                                            {
                                                currentTab == "extra-curricular" &&
                                                <form onSubmit={handleSubmitExtraCurricularDetails}>
                                                    <Card className="w-full shadow-lg rounded-2xl min-h-screen">
                                                        <CardHeader>
                                                            <div className="flex">
                                                                <div>
                                                                    <CardTitle className='mb-2'>Extra Curricular Activities</CardTitle>
                                                                    <CardDescription>Enter your extra curricular activitiy details.</CardDescription>
                                                                </div>
                                                                <div className='flex-grow'></div>
                                                                <div className='flex items-center justify-end'>
                                                                    {
                                                                        updateChange.extraCurricularDetailsChange &&
                                                                        <p className='mr-2 text-gray-600 text-sm'>unsaved changes *</p>
                                                                    }
                                                                    {
                                                                        status.extraCurricularDetails == "loading" ?
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><RotateCw className='animate-spin h-4 w-4 mr-2' /> Saving...</Button>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <Button type='submit' className='bg-primary-600 hover:bg-primary-700' variant="basic"><SaveAll className='h-4 w-4 mr-2' /> Save</Button>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <Separator />
                                                        <CardContent className='mt-5'>
                                                            <div className="flex col-span-2 flex-col space-y-3">
                                                                <Label className='mb-2'>List Your Extra Curricular Activities</Label>
                                                                {extraCurricularDetails?.details?.map((data, index1) => {
                                                                    return (
                                                                        <div
                                                                            key={index1}
                                                                        >
                                                                            <div className='mb-2 flex items-center'>
                                                                                <Label>Activity {index1 + 1}</Label>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault()
                                                                                        setUpdateChange(
                                                                                            {
                                                                                                ...updateChange,
                                                                                                extraCurricularDetailsChange: true
                                                                                            }
                                                                                        )
                                                                                        const extraCurricularDetailsTemp = [""]
                                                                                        extraCurricularDetails["details"].map((detail: any, index) => {
                                                                                            if (index != index1) {
                                                                                                extraCurricularDetailsTemp.push(detail)
                                                                                            }
                                                                                        })
                                                                                        setExtraCurricularDetails({
                                                                                            details: extraCurricularDetailsTemp.slice(1)
                                                                                        })
                                                                                    }}
                                                                                    className='text-red-600 ml-2'>
                                                                                    <Trash2Icon className='h-3 w-3' />
                                                                                </button>
                                                                            </div>
                                                                            <Input
                                                                                value={extraCurricularDetails?.details?.[index1]}
                                                                                onChange={(e) => {
                                                                                    setUpdateChange(
                                                                                        {
                                                                                            ...updateChange,
                                                                                            extraCurricularDetailsChange: true
                                                                                        }
                                                                                    )
                                                                                    const extraCurricularDetailsTemp = extraCurricularDetails
                                                                                    extraCurricularDetailsTemp["details"][index1] = e.target.value
                                                                                    setExtraCurricularDetails(extraCurricularDetailsTemp)
                                                                                }}
                                                                                id="extracurricular" required
                                                                                placeholder={[
                                                                                    "Competitive Programming Lead of my college coding club",
                                                                                    "coding75 Campus Ambassador",
                                                                                    "Basketball Team Captain of my College",
                                                                                ][index1 % 3]} />
                                                                        </div>
                                                                    )
                                                                })}
                                                                <div
                                                                    className='flex mt-5 justify-center items-center'
                                                                >
                                                                    <button
                                                                        onClick={
                                                                            (e) => {
                                                                                e.preventDefault()
                                                                                setUpdateChange(
                                                                                    {
                                                                                        ...updateChange,
                                                                                        extraCurricularDetailsChange: true
                                                                                    }
                                                                                )
                                                                                const extraCurricularDetailsTemp = extraCurricularDetails
                                                                                extraCurricularDetailsTemp.details.push("")
                                                                                setExtraCurricularDetails(extraCurricularDetailsTemp)
                                                                            }
                                                                        }
                                                                        className='text-sm text-blue-600 flex items-center'>
                                                                        <Plus className='mr-1 h-3 w-3' /> Add New Activity
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </form>
                                            }
                                            {
                                                currentTab == "skills" &&
                                                <form onSubmit={handleSubmitSkillDetails}>
                                                    <Card className="w-full shadow-lg rounded-2xl min-h-screen">
                                                        <CardHeader>
                                                            <div className="flex">
                                                                <div>
                                                                    <CardTitle className='mb-2'>Skill Details</CardTitle>
                                                                    <CardDescription>Enter your skill details.</CardDescription>
                                                                </div>
                                                                <div className='flex-grow'></div>
                                                                <div className='flex items-center justify-end'>
                                                                    {
                                                                        updateChange.skillDetailsChange &&
                                                                        <p className='mr-2 text-gray-600 text-sm'>unsaved changes *</p>
                                                                    }
                                                                    {
                                                                        status.skillDetails == "loading" ?
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><RotateCw className='animate-spin h-4 w-4 mr-2' /> Saving...</Button>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <Button className='bg-primary-600 hover:bg-primary-700' variant="basic"><SaveAll className='h-4 w-4 mr-2' /> Save</Button>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        <Separator />
                                                        <CardContent className='mt-5'>
                                                            <div className="grid w-full items-center gap-4">
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="techs">Technologies/Frameworks*</Label>
                                                                    <Input
                                                                        value={skillDetails?.technologiesAndFrameworks}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    skillDetailsChange: true
                                                                                }
                                                                            )
                                                                            setSkillDetails({
                                                                                ...skillDetails,
                                                                                technologiesAndFrameworks: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='text' id="techs" placeholder="ReactJS, NodeJS, Bootstrap CSS, Tailwind CSS" />
                                                                </div>
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="techlanguages">Languagess*</Label>
                                                                    <Input
                                                                        value={skillDetails?.languages}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    skillDetailsChange: true
                                                                                }
                                                                            )
                                                                            setSkillDetails({
                                                                                ...skillDetails,
                                                                                languages: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='text' id="techlanguages" placeholder="C++, HTML/CSS, JavaScript" />
                                                                </div>
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="devtools">Developer Tools*</Label>
                                                                    <Input
                                                                        value={skillDetails?.developerTools}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    skillDetailsChange: true
                                                                                }
                                                                            )
                                                                            setSkillDetails({
                                                                                ...skillDetails,
                                                                                developerTools: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='text' id="devtools" placeholder="VS Code, Figma, Firebase, Github, MongoDB" />
                                                                </div>
                                                                <div className="flex flex-col space-y-1.5">
                                                                    <Label htmlFor="coursework">Relevant Coursework*</Label>
                                                                    <Input
                                                                        value={skillDetails?.relevantCoursework}
                                                                        onChange={(e) => {
                                                                            setUpdateChange(
                                                                                {
                                                                                    ...updateChange,
                                                                                    skillDetailsChange: true
                                                                                }
                                                                            )
                                                                            setSkillDetails({
                                                                                ...skillDetails,
                                                                                relevantCoursework: e.target.value
                                                                            })
                                                                        }}
                                                                        required type='text' id="coursework" placeholder="Data Structures, Algorithms, Object Oriented Programming, Computer Networks" />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </form>
                                            }
                                        </div>
                                    </div>
                                </>
                        }
                    </>
                }
                {
                    status.loadData == "error" &&
                    <div className='mt-20 mb-20 flex justify-center items-center'>
                        <ErrorBanner />
                    </div>
                }
                {
                    status.loadData == "loading" &&
                    <div className='mt-20 mb-20 flex justify-center items-center'>
                        <Loading title="Loading Details" />
                    </div>
                }
            </div>
            <div className='mt-10'>
                <div className='grid md:grid-cols-2 gap-x-5'>
                    <div className="lg:mt-0 flex justify-center items-center">
                        <div className="w-[calc(90%)] aspect-video hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] z-40">
                            <Image
                                className="cursor-pointer w-full h-full rounded-xl p-1"
                                src={resumeBuilderPic}
                                alt="coding75-pro" />
                        </div>
                    </div>
                    <div className="lg:mt-0 mt-10 flex justify-center items-center">
                        <div className="w-[calc(90%)] aspect-video hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] z-40">
                            <iframe
                                className="w-full h-full rounded-xl p-1"
                                src="https://www.youtube.com/embed/VLZ1YCw5cY8?si=HwnCoDC0ypeiUUEb"
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Resume;
