import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

// remove caching, often returns stale data
export const revalidate = 0;

export async function GET() {
    try {
        const { rows } = await sql`SELECT * FROM brands LIMIT 100`;
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json({ message: 'Error fetching brands' }, { status: 500 });
    } 
}