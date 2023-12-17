"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";


const Topic = () => {
    const router=useRouter()

    useEffect(() => {
        router.push('/dsa-cp/topic-wise-problems')
    
    }, [])
    
}

export default Topic;