import { Button } from "@/components/ui/button"
import Link from "next/link"
import LogoutButton from "./LogoutButton"
export default function NavBar({loggedInSession}) {
    return (
     <nav className="flex justify-between items-center p-4 shadow-md shadow-gray-500/50">
        <Link href="/">
            <div className="text-2xl font-bold">Healthy D2C Brands</div>
        </Link>
        {loggedInSession ? (
                <LogoutButton/>
        ) : (
        
            <Link href="/login">
                <Button className="ml-auto">Login</Button>
            </Link>
        )}
      </nav>
    )
}