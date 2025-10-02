import { NextRequest, NextResponse } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/triage', '/clinics', '/profile']

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Get the token from cookies
    const token = request.cookies.get('access_token')?.value

    // Check if the current path is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    // Check if the current path is public
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(route)
    )

    // If accessing a protected route without a token, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        // Add the attempted URL as a redirect parameter
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If accessing login page with a valid token, redirect to dashboard
    if (pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If accessing root with a valid token, redirect to dashboard
    if (pathname === '/' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If accessing root without token, redirect to login
    if (pathname === '/' && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Allow the request to continue
    return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}