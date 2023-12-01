"use client";

import React, { useEffect, useState } from "react";
import { fetchInternships } from "../(api)/fetchInternships";
import { BriefcaseIcon, CalendarIcon, Check, CheckIcon, CurrencyIcon, ExternalLink, IndianRupeeIcon, LinkIcon, MapPinIcon, PencilIcon, Share2 } from "lucide-react";
import ResumeReviewCard from "@/components/cards/resume-review-card";
import InternshipGuideCard from "@/components/cards/internship-guide-card";

const OpportunityPage = (params: any) => {
  const [internshipDetails, setInternshipDetails] = useState([])
  const [isCopied, setIsCopied] = useState(false)
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
  useEffect(() => {
    async function fetchData() {
      try {

        const { internships } = await fetchInternships({ "url_slug": params.params.opportunity });
        setInternshipDetails(internships);
        console.log(internships[0]?.batch_eligible.batch);


      } catch (error) {
        console.error("Error fetching data:", error);
      }

    }

    fetchData();
  }, [])

  return (
    <div className="container">
      <div className="mt-3 p-3 lg:p-10">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex">
              <div className="mr-3 md:mr-5 lg:mr-5">
                <img
                  alt="company_logo"
                  src={internshipDetails[0]?.company_logo||"https://cdn-icons-png.flaticon.com/512/5345/5345937.png"}
                  className="object-cover mx-auto object-cover rounded-full max-h-16 max-w-16 lg:h-16 lg:w-16 "
                />
              </div>
              <h2 className="text-center text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {internshipDetails[0]?.internship_title}
              </h2>
            </div>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <BriefcaseIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                {internshipDetails[0]?.company_name}
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                {internshipDetails[0]?.internship_location}
              </div>
              {internshipDetails[0]?.stipend && <div className="mt-4 flex items-center text-sm text-gray-500">
                <IndianRupeeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                {internshipDetails[0]?.stipend}
              </div>}
              {internshipDetails[0]?.batch_eligible && <div className="mt-4 flex items-center text-sm text-gray-500">
                <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                Batch Eligible: {internshipDetails[0]?.batch_eligible.batch.map((value, index) => (
                  <span
                    key={index}
                    className="ml-2 mr-2whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700"
                  >
                    {value}
                  </span>
                ))}
              </div>}
            </div>
          </div>
          <div className="mt-10 flex lg:ml-4 lg:mt-0">
            {/* <span className="">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Edit
          </button>
        </span> */}
            {isCopied ? <span className="ml-3">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-5 py-2 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <Check className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                Copied
              </button>
            </span> : <span className="ml-3">
              <button
                type="button"
                onClick={copyurl}
                className="inline-flex items-center rounded-md bg-white px-5 py-2 text-lg font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <Share2 className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                Share
              </button>
            </span>}

            <span className="ml-3">
              <a
                href={internshipDetails[0]?.apply_link}
                target="_blank"
                className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <ExternalLink className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                Apply
              </a>
            </span>
          </div>
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
                  className="inline-flex items-center rounded-md bg-indigo-600 px-20 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <ExternalLink className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                  Apply
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
  );
}

export default OpportunityPage;