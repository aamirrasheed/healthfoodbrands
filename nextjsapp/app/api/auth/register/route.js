import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import { sql } from "@vercel/postgres"

export async function POST(req) {
    try{
        const { email, password } = await req.json()
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email address" },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10)

        await sql`
            INSERT INTO users (email, password)
            VALUES (${email}, ${hashedPassword})
        `

        return NextResponse.json({message: "User registered successfully"})
    }
    catch (error) { 
        console.log({error})
        return NextResponse.json({message: "User registration failed"}, {status: 500})
    }

}