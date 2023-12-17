"use client";

import React, { useEffect, useState } from 'react';
import OpportunityCard from "@/components/cards/opportunity-card";
import { fetchInternships } from './(api)/fetchInternships';
import ResumeReviewCard from '@/components/cards/resume-review-card';
import PageHeaders from '@/components/page-headers';
import InternshipGuideCard from '@/components/cards/internship-guide-card';
import Loading from '@/components/loading';

const OpportunitiesPage = () => {
    const [internshipsList, setInternshipsList] = useState([])
    useEffect(() => {
        async function fetchData() {
            try {
                const { internships } = await fetchInternships({ "slug_url": null });
                setInternshipsList(internships);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [])
    const noOfCards = [];
    for (let i = 0; i < (internshipsList.length) / 3 - 1; i++) {
        noOfCards.push(<div
            key={i}>
            <div className='mt-4'>
                <ResumeReviewCard />
            </div>
            <div className='mt-4'>
                <InternshipGuideCard />
            </div>
        </div>);
    }


    return (
        <div className='container'>
            <div className="mt-3">
                <PageHeaders
                    heading="Opportunities Hub 💼: Launch Your Career Journey 🚀"
                    description="Explore tech job and internship opportunities for all levels. From web development to machine learning, find your next career adventure in our curated collection." />
            </div>
            <div className="mt-3 grid grid-cols-6 gap-3">
                {internshipsList.length>0 ? <div className="flex flex-col col-span-6 lg:col-span-4">
                    {internshipsList?.map((internship, index) => (
                        <OpportunityCard
                            key={index}
                            title={internship?.internship_title}
                            company_name={internship?.company_name}
                            location={internship?.internship_location}
                            company_logo={internship?.company_logo||"https://cdn-icons-png.flaticon.com/512/5345/5345937.png"}
                            apply_link={internship?.apply_link}
                            url_slug={internship?.url_slug}
                        />
                    ))}
                </div> :
                   <Loading title="Fetching Opportunities" />}
                <div className="flex flex-col col-span-6 lg:col-span-2">
                    <div className='mt-2'>
                        <ResumeReviewCard />
                    </div>
                    <div className='mt-4'>
                        <InternshipGuideCard />
                    </div>
                    <div className='hidden sm:block'>
                    {noOfCards}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OpportunitiesPage;