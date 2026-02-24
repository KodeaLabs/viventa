import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const protectedPatterns = ['/agent/', '/my/', '/admin/'];

function isProtectedPath(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/(en|es)/, '');
  return protectedPatterns.some((pattern) => pathWithoutLocale.startsWith(pattern));
}

const handleI18nRouting = createMiddleware({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  localeDetection: true,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route and user has no session cookie
  if (isProtectedPath(pathname)) {
    const sessionCookie = request.cookies.get('appSession');
    if (!sessionCookie) {
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/', '/(en|es)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
