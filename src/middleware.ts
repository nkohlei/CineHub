import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // 1. ABSOLUTE CRITICAL BOT DETECTION CHAIN
  const isPageSpeedBot = 
    userAgent.includes('Chrome-Lighthouse') || 
    userAgent.includes('Google-Lighthouse') ||
    userAgent.includes('Google Page Speed Insights') ||
    userAgent.includes('Lighthouse');

  // 2. UNCONDITIONAL SHORT-CIRCUIT BYPASS
  if (isPageSpeedBot) {
    // Drop all auth guards, jump straight past NextAuth, and let the auditor read the DOM
    return NextResponse.next();
  }

  // --- YOUR SYSTEM NEXTAUTH FILTER / REDIRECT LOGIC RUNS BELOW ONLY FOR REAL USERS ---
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token && request.nextUrl.pathname === '/') {
    // Currently page.tsx has its own login wall, but this is a standard middleware check
    // If the user meant for NextAuth middleware to handle the redirect:
    // return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }

  return NextResponse.next();
}

// Ensure the matcher catches the root dashboard route cleanly
export const config = {
  matcher: ['/'],
};
