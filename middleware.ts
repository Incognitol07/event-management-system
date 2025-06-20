import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes require authentication and their required roles
const protectedRoutes: Record<string, string[]> = {
  '/dashboard': [],
  '/events': [],
  '/events/new': ['ADMIN', 'STAFF'],
  '/locations': [],
  '/calendar': [],
}

// Public routes that don't require authentication
const publicRoutes = ['/login', '/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if it's an API route (skip middleware for API routes)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check if it's a static file (skip middleware for static files)
  if (
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Get user from cookie or session (in a real app, you'd verify JWT token)
  const userCookie = request.cookies.get('currentUser')?.value
  
  let user = null
  if (userCookie) {
    try {
      user = JSON.parse(userCookie)
    } catch (error) {
      // Invalid cookie, treat as not authenticated
    }
  }

  // Check if route requires authentication
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // No user found, redirect to login
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Check role-based access
    const matchedRoute = Object.keys(protectedRoutes).find(route =>
      pathname.startsWith(route)
    )
      if (matchedRoute) {
      const requiredRoles = protectedRoutes[matchedRoute]
      
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        // User doesn't have required role, redirect to dashboard
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
