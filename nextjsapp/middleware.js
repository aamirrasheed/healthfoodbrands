import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server";

export default function middleware(request){

    const token = getToken({req: request, secret: process.env.NEXTAUTH_SECRET})

    const pathname = request.nextUrl

    // Paths that logged-in users shouldn't access
    const publicPaths = ["/login", "/register"];
    
    // Paths that require authentication
    const protectedPaths = ["/post", "/api/brandImageUpload"];

    // Redirect logged-in users away from public paths
    if (token && publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect logged-out users away from protected paths
    if (!token && protectedPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Allow the request to continue for all other cases
    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/post/:path*", "/api/brandImageUpload"]
}