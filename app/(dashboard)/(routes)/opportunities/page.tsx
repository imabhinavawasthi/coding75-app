"use client";

import React, { useEffect, useState } from 'react';
import ImageCard from "@/components/image-card";
import OpportunityCard from "@/components/opportunity-card";
import { fetchInternships } from './api/fetchInternships';

const OpportunitiesPage = () => {
    const [internshipsList, setInternshipsList] = useState()
    async function fetchData() {
        const { internships, error } = await fetchInternships();

        if (!error) {
            // Use the internships data here
            console.log(internships);
            
        }
    }

    fetchData();
    

    return (
        <div className="mt-3 container grid grid-cols-6 gap-3">
            <div className="lg:hidden col-span-6">
                <ImageCard />
            </div>
            <div className="flex flex-col col-span-6 lg:col-span-4">
                <OpportunityCard />
                <OpportunityCard />
                <OpportunityCard />
                <OpportunityCard />
                <OpportunityCard />
                <OpportunityCard />
                <OpportunityCard />
                <OpportunityCard />
                <OpportunityCard />
                <OpportunityCard />
                <OpportunityCard />
                <OpportunityCard />
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