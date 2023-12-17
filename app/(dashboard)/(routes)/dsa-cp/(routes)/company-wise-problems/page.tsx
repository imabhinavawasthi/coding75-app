"use client"

import ImageCard2 from "@/components/cards/image-card-2";
import PageHeaders from "@/components/page-headers";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const list_of_frequently_searched_companies = [
    {
        name: "Google",
        link: "/dsa-cp/problems/company/google",
        image_link: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
        name: "Amazon",
        link: "/dsa-cp/problems/company/amazon",
        image_link: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
        name: "Linkedin",
        link: "/dsa-cp/problems/company/linkedin",
        image_link: "https://upload.wikimedia.org/wikipedia/commons/a/aa/LinkedIn_2021.svg",
    },
    {
        name: "Atlassian",
        link: "/dsa-cp/problems/company/atlassian",
        image_link: "https://upload.wikimedia.org/wikipedia/en/c/c8/Atlassian.svg",
    },
    {
        name: "Microsoft",
        link: "/dsa-cp/problems/company/microsoft",
        image_link: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    },
    {
        name: "Uber",
        link: "/dsa-cp/problems/company/uber",
        image_link: "https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg",
    },
]

const CompanyWiseProblems = () => {
    const passedPlaceholder=["Google", "Microsoft", "Ola", "Zomato", "Amazon", "Atlassian", "Samsung", "Uber", "Linkedin", "Media.net", "Directi"]
    const [placeholder, setPlaceholder] = useState(passedPlaceholder[0]);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [searchedCompany, setSearchedCompany]= useState("")
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

    function searchCompany(e){
        e.preventDefault()
        let companyName=searchedCompany.toLowerCase();
        companyName=companyName.trim().split(/[\s,\t,\n]+/).join('-');
        console.log(companyName);
        
        router.push(`/dsa-cp/problems/company/${companyName}`)
    }

    return (
        <div className="container">
            <div className="mt-3">
                <PageHeaders
                    heading="Company Wise Interview Problems 💻"
                    description="Gear up for success in tech interviews by honing your skills on company-specific coding challenges. Explore our curated repository designed to help you ace interviews with top companies." />
            </div>
            <h3 className="mt-5 flex justify-center font-bold text-lg lg:text-2xl">Select Company Name 👇🏻</h3>
            <div className="mt-3 p-5">
                <form>

                    <div className="relative mt-1.5">
                        <input
                            type="text"
                            list="CompanyList"
                            id="CompanyListId"
                            onChange={(e)=>{setSearchedCompany(e.target.value);}}
                            className="font-semibold p-3 outline-slate-600 outline-double w-full text-md lg:text-xl rounded-sm border-gray-300 pe-10 text-gray-700 sm:text-sm [&::-webkit-calendar-picker-indicator]:opacity-0"
                            placeholder={placeholder + " Interview Problems"}
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
                    {searchedCompany!=""&&<>
                    <Button  onClick={searchCompany} className="mt-3 bg-indigo-600 hover:bg-indigo-700">
                        Search 
                    </Button>
                    </>}

                    <datalist id="CompanyList">
                        <option>Apple</option>
                        <option>Google</option>
                        <option>Microsoft</option>
                        <option>Linkedin</option>
                        <option>Amazon</option>
                    </datalist>
                </form>
            </div>
            <h3 className="mt-5 flex justify-center font-bold text-lg lg:text-2xl">Frequently Searched Companies 👇🏻</h3>
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {list_of_frequently_searched_companies.map((company) => (
                    <div key={company.name}>
                        <ImageCard2 title={company.name + " Interview Problems"} link={company.link} button_text={"Start Solving"} image_link={company.image_link} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CompanyWiseProblems;