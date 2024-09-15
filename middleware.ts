import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoutes = createRouteMatcher([
    "/signin",
    "/signup",
    "/",
    "/home"
])

const isPublicApiRoutes = createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware((auth, req) => {
    const { userId } = auth()
    const currentUrl = new URL(req.url)
    const isAccessingHomePage = currentUrl.pathname === "/home";
    const isApiRequest = currentUrl.pathname.startsWith("/api");

    // If user is logged in and accessing a public routes but not the dashboard
    if (userId && isPublicRoutes(req) && !isAccessingHomePage) {
        return NextResponse.redirect(new URL("/home",req.url))
    }

    // not logged In
    if (!userId) {
        
        // if user is not logged in and trying to access a protected route
        if (!isPublicRoutes(req) && !isPublicApiRoutes(req)) {
            return NextResponse.redirect(new URL("/signin",req.url))
        }

        // if the request is for a protected API and the user is not logged in

        if (isApiRequest && !isPublicApiRoutes(req)) {
            return NextResponse.redirect(new URL("/signin",req.url))
        }
    }
    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}