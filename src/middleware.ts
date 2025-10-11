import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Public routes
  const publicRoutes = ['/', '/explore', '/pricing', '/legal', '/auth', '/api/auth']
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Protected routes
  const protectedRoutes = ['/dashboard', '/wallet', '/teams', '/post-job', '/verify', '/profiles/me']
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Redirect to sign in if accessing protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (pathname.startsWith('/auth') && isLoggedIn && !pathname.includes('/signout')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

