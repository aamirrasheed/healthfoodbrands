import Link from "next/link"
import { Button } from "@/components/ui/button"
import LogoutButton from "@/components/LogoutButton"

export default function NavBar({loggedInSession}) {
    return (
     <nav className="flex justify-between items-center p-4 shadow-md shadow-gray-500/50">
        <Link href="/">
            <div className="text-2xl font-bold">Healthy D2C Brands</div>
        </Link>
        {loggedInSession ? (
            <div className="flex justify-between space-x-2">
                <Link href="/post">
                    <Button className="ml-auto">Post Brand</Button>
                </Link>
                <LogoutButton/>
            </div>
        ) : (
        
            <Link href="/login">
                <Button className="ml-auto">Login</Button>
            </Link>
        )}
      </nav>
    )
}