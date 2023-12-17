"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SearchPage = () => {
  const router=useRouter()

    useEffect(() => {
        router.push('/resources')
    
    }, [])
  return ( 
    <div>
      
    </div>
   );
}
 
export default SearchPage;