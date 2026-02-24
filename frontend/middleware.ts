import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: 'always',
});

const protectedPatterns = ['/agent/', '/my/', '/admin/'];

function isProtectedPath(pathname: string): boolean {
  // Strip the locale prefix to check the actual path
  const pathWithoutLocale = pathname.replace(/^\/(en|es)/, '');
  return protectedPatterns.some((pattern) => pathWithoutLocale.startsWith(pattern));
}

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

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/(en|es)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
