import { Button } from "@/components/ui/button"
import BrandCard from "@/components/BrandCard"

import { brandData } from "@/data/mockBrands"

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <div className="flex justify-center items-top mt-10 w-screen">
        <div className="">
          Welcome! This is a list of healthy D2C food brands I've vetted. I hope this is helpful to you.
        </div>
      </div>
      <div className="container mx-auto px-20 mt-10">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {brandData.map((brand) => (
              <BrandCard key={brand.name} {...brand} />
            ))}
          </div>
        </div>
    </div>
  )
}
