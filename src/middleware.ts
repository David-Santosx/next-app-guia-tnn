import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (token && request.nextUrl.pathname === '/login') {
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}

export const config = { matcher: ['/dashboard/:path*', '/login'] };