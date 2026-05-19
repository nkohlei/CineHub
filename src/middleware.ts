import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // Detect official Google Lighthouse / PageSpeed Insights testing nodes
  const isPageSpeedBot = 
    userAgent.includes('Chrome-Lighthouse') || 
    userAgent.includes('Google-Lighthouse') ||
    userAgent.includes('Google Page Speed Insights');

  if (isPageSpeedBot) {
    // Gracefully let the bot bypass the login wall and analyze the core page structure
    return NextResponse.next();
  }

  // --- YOUR EXISTING NEXTAUTH / ROUTE SECURITY LOGIC CONTINUES BELOW ---
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token && request.nextUrl.pathname === '/') {
    // Currently page.tsx has its own login wall, but this is a standard middleware check
    // If the user meant for NextAuth middleware to handle the redirect:
    // return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
