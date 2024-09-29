import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server";

export default async function middleware(request){

    // user is logged in if this is valid
    const token = await getToken({req: request, secret: process.env.NEXTAUTH_SECRET})
    
    const pathname = request.nextUrl.pathname

    // routes that require authentication
    const protectedRoutes = {
        "/api/brands/data": "POST",
        "/api/brands/image": "POST"
    }

    // Paths that logged-in users shouldn't access
    const publicPaths = ["/login", "/register", "/api/register", "/api/login"];
    
    // Paths that require authentication
    const protectedPaths = ["/post"];

    // protect API routes that require login with 401s
    if(!token && Object.keys(protectedRoutes).some(path => pathname.startsWith(path)) && protectedRoutes[pathname] === request.method){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); 
    }
    
    // protect pages from logged-out users
    if (!token && protectedPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // protect pages from logged in users
    if (token && publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // let the request to continue for all other cases
    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/post/:path*", "/api/brands/:path*", "/api/auth/:path"]
}