import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// eslint-disable-next-line consistent-return
export default async function middleware(req: NextRequest) {
  const { pathname, origin } = new URL(req.nextUrl)
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  })
  // console.log('session in middleware', session)
  if (pathname === '/') {
    if (!session) {
      return NextResponse.redirect(`${origin}/auth`)
    }
  }
  if (pathname === '/auth') {
    if (session) {
      return NextResponse.redirect(`${origin}`)
    }
  }

  if (pathname.startsWith('/lists')) {
    if (session) {
      return NextResponse.next()
    }
    return NextResponse.redirect(`${origin}/auth`)
  }
  if (pathname.startsWith('/admin')) {
    if (session) {
      if (session.role === 'ADMIN') {
        return NextResponse.next()
      }
      return NextResponse.redirect(`${origin}`)
    }
  }
}
