'use client'
import { useState, useEffect } from "react"

import { Spinner } from "@/components/ui/spinner"
import BrandCard from "./BrandCard"


export default function BrandGrid(){
    const [loading, setLoading] = useState(true)
    const [brandData, setBrandData] = useState([])
    useEffect(() => {
        const getData = async () => {
            const response = await fetch('/api/brandsData');
            if (!response.ok) {
                throw new Error('Failed to fetch brand data');
            }
            const fields = await response.json();
            console.log(fields)
            setBrandData(fields);
            setLoading(false)
        }
        try{
            getData()
        }
        catch (error) {
            console.error('Error fetching brand data:', error);
            setBrandData([]);
        }

    }, [])

    return (
        <div className="container mx-auto px-20 mt-10">
          {loading ? 
            <div className="block w-full h-60 rounded-lg relative p-2 items-center justify-center">
              <Spinner size="large" />
            </div>
            :
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {brandData.map((brand) => (
                <BrandCard key={brand.id} {...brand} />
              ))}
            </div>
          }
            
        </div>
    )
}