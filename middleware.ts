import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAllCities, getCitySlug } from './lib/data/locations';

// A regex containing common search engine and crawling bots to exclude them from redirection.
// This allows bots (like Googlebot) to crawl and index the homepage '/' normally.
const BOTS_REGEX = /bot|googlebot|bingbot|crawler|spider|robot|crawling/i;

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Only apply geolocation-based redirect when visiting the homepage '/'
  if (pathname === '/') {
    // 1. Skip redirect for search engine crawlers to ensure homepage indexes perfectly on Google
    const userAgent = request.headers.get('user-agent') || '';
    if (BOTS_REGEX.test(userAgent)) {
      return NextResponse.next();
    }

    // 2. Skip redirect if request is internal (e.g. user clicked logo/home link from within the site)
    const referer = request.headers.get('referer');
    const isInternal = referer && (
      referer.includes('callgirl4u.com') || 
      referer.includes('localhost') || 
      referer.includes('vercel.app')
    );
    
    // Also support an explicit query parameter bypass
    const hasBypassParam = searchParams.get('noredirect') === 'true';

    if (isInternal || hasBypassParam) {
      return NextResponse.next();
    }

    // 3. Check for cookie-based user choice (e.g. if logo is clicked)
    const cookieCity = request.cookies.get('user-city')?.value;
    const cookieCategory = request.cookies.get('user-category')?.value || 'call-girls';

    if (cookieCity) {
      const allCities = getAllCities();
      const matchingCity = allCities.find(
        (c) => getCitySlug(c) === cookieCity
      );
      if (matchingCity) {
        const redirectUrl = new URL(`/${cookieCategory}/${cookieCity}`, request.url);
        return NextResponse.redirect(redirectUrl, 307);
      }
    }

    // 3. Fallback to Vercel edge IP geolocation headers
    const vercelCity = request.headers.get('x-vercel-ip-city');

    if (vercelCity) {
      try {
        const decodedCity = decodeURIComponent(vercelCity);
        const allCities = getAllCities();

        // Perform a case-insensitive check to see if the city is in our supported locations
        const matchingCity = allCities.find(
          (c) => c.toLowerCase() === decodedCity.toLowerCase()
        );

        if (matchingCity) {
          const citySlug = getCitySlug(matchingCity);
          
          // Redirect to the detected local city page (defaulting to call-girls category)
          const redirectUrl = new URL(`/call-girls/${citySlug}`, request.url);
          return NextResponse.redirect(redirectUrl, 307);
        }
      } catch (e) {
        console.error("Error in geo redirect parsing:", e);
      }
    }
  }

  return NextResponse.next();
}

// Only match the home route '/' for redirection
export const config = {
  matcher: ['/'],
};
