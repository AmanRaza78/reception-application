// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const authCookie = request.cookies.get('appwrite_session');
    const isLoggedIn = !!authCookie;
    
    // Define paths
    const publicPaths = ['/login'];
    const protectedPaths = ['/', '/visitors'];
    
    // Skip middleware for next.js specific paths and public assets
    const isNextPath = path.includes('/_next') || 
                      path.includes('/api') || 
                      path.includes('/static') ||
                      path.includes('/favicon.ico');
                      
    if (isNextPath) {
        return NextResponse.next();
    }
   
    const isPublicPath = publicPaths.includes(path);
    const isProtectedPath = protectedPaths.includes(path);

    // Redirect to login if trying to access protected routes while not logged in
    if (!isLoggedIn && isProtectedPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to home if trying to access login while logged in
    if (isLoggedIn && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow all other requests to proceed
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match specific protected routes
        '/',
        '/visitors',
        // Match login page
        '/login',
        // Skip all static files and API routes
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
};