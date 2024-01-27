"use client";

import React, { useEffect, useState } from "react";
import { fetchInternships } from "../../(api)/fetchInternships";
import { BriefcaseIcon, CalendarIcon, Check, ExternalLink, IndianRupeeIcon, MapPinIcon, Share2 } from "lucide-react";
import ResumeReviewCard from "@/components/cards/resume-review-card";
import InternshipGuideCard from "@/components/cards/internship-guide-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/components/loading";
import ErrorBanner from "@/app/(dashboard)/_components/error-banner";

const OpportunityPage = (params: any) => {
  const [internshipDetails, setInternshipDetails] = useState([])
  const [isCopied, setIsCopied] = useState(false)
  const [status, setStatus] = useState("loading")
  function getCurrentURL() {
    return window.location.href
  }
  function copyurl() {
    const url = getCurrentURL()
    setIsCopied(true)
    navigator.clipboard.writeText(url);
    setTimeout(() => {
      setIsCopied(false)
    }, 2000);
  }
  async function fetchData() {
    try {

      const { internships, error } = await fetchInternships(params.params.opportunity, undefined);
      if(error){
        setStatus("error")
        return
      }
      setInternshipDetails(internships);
      document.title = `${internships[0]?.internship_title} - ${internships[0]?.company_name}`
      setStatus("done")
    } catch (error) {
      setStatus("error")
      console.error("Error fetching data:", error);
    }

  }
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <>
      {
        internshipDetails[0] ? <>
          <div className="container">
            <div className="mt-3 p-3 lg:p-10">
              <div>
                <div className="w-full flex flex-col justify-center items-start h-auto gap-3 p-6 border-gray-500 rounded-xl bg-gray-50 hover:cursor-pointer hover:bg-gray-100 hover:border-gray-600 hover:shadow-lg transition-all duration-500 capitalize">
                  <div className="flex lg:py-2 md:py-1 py-0 gap-3 self-stretch items-start">
                    <span className="relative flex shrink-0 overflow-hidden w-12 h-12 lg:w-20 lg:h-20 md:w-17 md:h-17 rounded-full">
                      <img className="aspect-square h-full w-full object-contain" alt="company_logo" width="48" height="48" src={internshipDetails[0].company_logo} />
                    </span>
                    <div className="w-full flex flex-col items-start gap-1 flex-wrap">
                      <div className="flex mb-5 items-center gap-2">
                        <p className="text-xl font-extrabold md:text-3xl lg:text-4xl">
                          {internshipDetails[0].internship_title}
                        </p>
                      </div>
                      <div className="w-full flex gap-3 justify-between items-stretch flex-wrap">
                        <div className="lg:flex md:flex grid  gap-x-2 items-center">
                          <p className="flex items-center lg:mb-0 md:mb-0 mb-4 text-sm text-gray-600">
                            <BriefcaseIcon className="h-4 w-4 mr-2" aria-hidden="true" /><Badge variant="destructive">{internshipDetails[0].company_name}</Badge>
                          </p>
                          <div className="hidden lg:block md:block w-[1px] h-3 bg-gray-400">
                          </div>
                          <p className="items-center  overflow-scroll lg:mb-0 md:mb-0 mb-4 flex gap-x-1 text-sm text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-2" aria-hidden="true" /> Batch Eligible: {internshipDetails[0].batch_eligible.map((data) => {
                              return <>
                                <Badge variant="basic">{data}</Badge>
                              </>
                            })}
                          </p>
                          <div className="hidden lg:block md:block w-[1px] h-3 bg-gray-400">
                          </div>
                          <p className="flex items-center text-sm text-gray-600 line-clamp-1">
                            <MapPinIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                            <Badge variant="secondary" className="border border-gray-1000">{internshipDetails[0].internship_location}</Badge>
                          </p>
                          {internshipDetails[0].stipend && <>

                            <div className="hidden lg:block md:block w-[1px] h-3 bg-gray-400">
                            </div>
                            <p className="flex items-center text-sm text-gray-600 line-clamp-1">
                              <IndianRupeeIcon className="h-4 w-4 mr-2" aria-hidden="true" /><Badge variant="outline">{internshipDetails[0].stipend}</Badge>
                            </p></>}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
              <div className="mt-5 justify-center items-center flex">
                {isCopied ? <span className="ml-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyurl}>
                    <Check className="h-4 w-4 mr-2" aria-hidden="true" />
                    Copied
                  </Button>
                </span> : <span className="ml-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={copyurl}>
                    <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Share
                  </Button>
                </span>}

                <span className="ml-3">
                  <a
                    href={internshipDetails[0]?.apply_link}
                    target="_blank"
                    className="flex gap-x-2"
                  >
                    <Button
                      type="button"
                      variant="basic"
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                      Apply
                    </Button>
                  </a>
                </span>
              </div>
              {internshipDetails[0]?.internship_description &&
                <div>
                  <div className="mt-10">
                    <div>
                      <h3 className="mb-3 text-lg font-bold ">Job Description:</h3>
                      <p className="text-gray-900">{internshipDetails[0]?.internship_description}</p>
                    </div>
                  </div>
                  <div className="mt-10">
                    <div className="flex justify-center ">
                      <a
                        href={internshipDetails[0]?.apply_link}
                        target="_blank"
                        className="flex gap-x-2 w-full"
                      >
                        <Button
                          type="button"
                          variant="basic"
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                          Apply
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              }
              <div className="mt-10">
                <h2 className="text-lg font-bold text-black-500">Accelerate Your Interview Preparation With Us 🚀</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="mt-5">
                    <ResumeReviewCard />
                  </div>
                  <div className="mt-5">
                    <InternshipGuideCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </> : <>
          <div className="container p-3 lg:p-10">
            <div className="w-full flex flex-col justify-center items-start h-auto gap-3 p-6 capitalize">
              <div className="flex lg:py-2 md:py-1 py-0 gap-3 self-stretch items-start">
                <span className="relative flex shrink-0 overflow-hidden w-12 h-12 lg:w-20 lg:h-20 md:w-17 md:h-17 rounded-full">
                  <Skeleton className="w-12 h-12 lg:w-20 lg:h-20 md:w-17 md:h-172 rounded-full" />
                </span>
                <div className="w-full flex flex-col items-start gap-1 flex-wrap">
                  <div className="flex mb-5 items-center gap-2">
                    <div className="text-xl font-extrabold md:text-3xl lg:text-4xl">
                      <Skeleton className="h-[50px] w-[250px] lg:w-[500px]" />
                    </div>
                  </div>
                  <div className="w-full flex gap-3 justify-between items-stretch flex-wrap">
                    <div className="lg:flex md:flex grid  gap-x-2 items-center">
                      <div className="flex items-center lg:mb-0 md:mb-0 mb-4 text-sm text-gray-600">
                        <Skeleton className="h-4 w-[50px]" />
                      </div>
                      <div className="items-center  overflow-scroll lg:mb-0 md:mb-0 mb-4 flex gap-x-1 text-sm text-gray-600">
                        <Skeleton className="h-4 w-[50px]" />
                      </div>
                      <div className="flex items-center text-sm text-gray-600 line-clamp-1">
                        <Skeleton className="h-4 w-[50px]" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
            {status=="loading"?<>
            <Loading title={"Loading Opportunity"} />
            </>:<>
            <ErrorBanner/>
            </>}
          </div>

        </>

      }</>
  );
}

export default OpportunityPage;