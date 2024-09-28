import BrandGrid from "@/components/BrandGrid"

export default function Home() {
    
  return (
    <div className="bg-background text-foreground">
      <div className="flex justify-center items-top mt-10 w-screen">
        <div className="">
          Welcome! This is a list of healthy D2C food brands I've vetted. I hope this is helpful to you.
        </div>
      </div>
      <BrandGrid/>
    </div>
  )
}
