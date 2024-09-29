'use client'

import Link from 'next/link'
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterForm() { 
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const email = formData.get("email")
        const password = formData.get("password")
        const registerResponse = await fetch("/api/auth/register", {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        })

        if (!registerResponse.ok) {
            console.error('Registration failed');
            return
            // TODO You might want to add some state to show an error message to the user
        }
        const signInResponse = await signIn("credentials", {
            email,
            password,
            redirect: false
        })
        
        if(signInResponse.error){
            console.error('Sign in failed');
            return
            // TODO You might want to add some state to show an error message to the user
        }
        
        // redirect to home page
        router.push("/")
        router.refresh()
    }

    return (<div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold">Register</h1>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto mt-5">
        <Input type="email" name="email" placeholder="Email" />
        <Input type="password" name="password" placeholder="Password" />
        <Button type="submit">Register</Button>
    </form>
    <p className="mt-2">Already have an account? <Link className="text-blue-400" href="/login">Login</Link> instead</p>
    </div>)
}