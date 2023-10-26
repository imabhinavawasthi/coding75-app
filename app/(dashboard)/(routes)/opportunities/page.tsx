"use client";

import React, { useEffect, useState } from 'react';
import ImageCard from "@/components/image-card";
import OpportunityCard from "@/components/opportunity-card";
import { fetchInternships } from './(api)/fetchInternships';

const OpportunitiesPage = () => {
    const [internshipsList, setInternshipsList] = useState([])
    useEffect(() => {
        async function fetchData() {
            try {
                const { internships } = await fetchInternships({"slug_url":null});
                setInternshipsList(internships);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    
        fetchData();
    }, [])
    


    return (
        <div className="mt-3 container grid grid-cols-6 gap-3">
            <div className="lg:hidden col-span-6">
                <ImageCard />
            </div>
            <div className="flex flex-col col-span-6 lg:col-span-4">
                {internshipsList.map((internship, index) => (
                    <OpportunityCard
                        key={index}
                        title={internship?.internship_title}
                        company_name={internship?.company_name}
                        location={internship?.internship_location}
                        company_logo={internship?.company_logo}
                        apply_link={internship?.apply_link}
                        url_slug={internship?.url_slug}
                    />
                ))}
            </div>
            <div className="hidden md:flex relative mt-3 col-span-6 md:col-span-2">
                <div className="fixed mr-5" style={{ overflowY: 'scroll' }}>
                    <ImageCard />
                    <ImageCard />
                    <ImageCard />
                </div>
            </div>
        </div>
    );
}

export default OpportunitiesPage;