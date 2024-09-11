'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Form() {
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const response = await fetch("/api/auth/register", {
            method: 'POST',
            body: JSON.stringify({
                email: formData.get("email"),
                password: formData.get("password")
            })
        })
        console.log({response})
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