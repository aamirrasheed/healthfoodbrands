'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginForm() {
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const response = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false
        })
        
        console.log({response})

        if(!response.error){
            router.push("/")
            router.refresh()
        }

    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto mt-5">
            <Input type="email" name="email" placeholder="Email" />
            <Input type="password" name="password" placeholder="Password" />
            <Button type="submit">Login</Button>
        </form>
        <p className="mt-2">No account? <Link className="text-blue-400" href="/register">Register</Link> instead</p>
        </div>
    )
}