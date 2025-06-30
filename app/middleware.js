import { NextResponse } from 'next/server';
import { parseCookies } from 'nookies';

export function middleware(req) {
  const cookies = req.cookies.getAll();
  const token = cookies.find(cookie => cookie.name === 'token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/app/:path*', // Apply middleware only to `/app` routes
};
