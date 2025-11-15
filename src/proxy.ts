import { NextRequest, NextResponse } from 'next/server'

import { COOKIE_NAMES } from './utils/constants/cookie-names'

const publicRoutes = ['/login']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAMES.AUTH.TOKEN)?.value
  const isAuthenticated = !!token

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
