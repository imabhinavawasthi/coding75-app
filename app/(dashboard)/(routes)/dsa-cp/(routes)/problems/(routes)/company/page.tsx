"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";


const Company = () => {
    const router=useRouter()

    useEffect(() => {
        router.push('/dsa-cp/company-wise-problems')
    
    }, [])
    
}

export default Company;