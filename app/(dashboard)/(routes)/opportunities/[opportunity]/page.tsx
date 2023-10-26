"use client";

import React, { useEffect, useState } from "react";
import { fetchInternships } from "../(api)/fetchInternships";

const OpportunityPage = ({params}) => {
    const [internshipDetails, setInternshipDetails] = useState([])
    useEffect(() => {
        async function fetchData() {
            try {
                const { internships } = await fetchInternships({"url_slug":params.opportunity});
                setInternshipDetails(internships);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
    
        }
    
        fetchData();
    }, [])
    
    return ( 
        <div>
            Title: {internshipDetails[0]?.internship_title}
            Company: {internshipDetails[0]?.company_name}
            Location: {internshipDetails[0]?.internship_location}
        </div>
     );
}
 
export default OpportunityPage;