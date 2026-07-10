import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAllCities, getCitySlug } from './lib/data/locations';

const BOTS_REGEX = /bot|googlebot|bingbot|crawler|spider|robot|crawling|ahrefs|siteaudit|semrush|screaming|gtmetrix/i;

let cachedMaintenance = false;
let lastChecked = 0;
const CACHE_TTL = 30000; // 30 seconds

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. MAINTENANCE MODE CHECK
  const isExempt = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || 
    pathname.startsWith('/images') ||
    pathname.startsWith('/api/report') ||
    pathname.startsWith('/api/whatsapp-click');

  if (!isExempt) {
    const now = Date.now();
    if (now - lastChecked > CACHE_TTL) {
      try {
        const KV_URL = process.env.KV_REST_API_URL || "https://balanced-ibex-111880.upstash.io";
        const KV_TOKEN = process.env.KV_REST_API_TOKEN || "gQAAAAAAAbUIAAIgcDJmMmE1N2NiMzM1NTM0NDAyYWUzYmRlMjE5OGQwOTljNQ";

        const res = await fetch(`${KV_URL}/get/maintenance_mode`, {
          headers: { Authorization: `Bearer ${KV_TOKEN}` },
          cache: 'no-store',
          signal: AbortSignal.timeout(500),
        });
        if (res.ok) {
          const data = await res.json();
          cachedMaintenance = data?.result === "true";
          lastChecked = now;
        }
      } catch (e) {
        // Quietly ignore timeout/network errors to prevent breaking user/bot traffic
      }
    }

    if (cachedMaintenance) {
      const maintenanceUrl = new URL('/maintenance', request.url);
      return NextResponse.redirect(maintenanceUrl, 307);
    }
  }

  // 2. GEOLOCATION REDIRECT FOR HOME PAGE
  if (pathname === '/') {
    // Skip redirect for search engine crawlers
    const userAgent = request.headers.get('user-agent') || '';
    if (BOTS_REGEX.test(userAgent)) {
      return NextResponse.next();
    }

    // Skip redirect if request is internal
    const referer = request.headers.get('referer');
    const isInternal = referer && (
      referer.includes('callgirl4u.com') || 
      referer.includes('localhost') || 
      referer.includes('vercel.app')
    );
    
    const hasBypassParam = searchParams.get('noredirect') === 'true';

    if (isInternal || hasBypassParam) {
      return NextResponse.next();
    }

    // Check for cookie-based user choice
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

    // Geolocation headers
    const vercelCity = request.headers.get('x-vercel-ip-city');

    if (vercelCity) {
      try {
        const decodedCity = decodeURIComponent(vercelCity);
        const allCities = getAllCities();

        const matchingCity = allCities.find(
          (c) => c.toLowerCase() === decodedCity.toLowerCase()
        );

        if (matchingCity) {
          const citySlug = getCitySlug(matchingCity);
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

export const config = {
  matcher: [
    // Match all routes except static assets
    '/((?!_next/static|_next/image|favicon.ico|images|apple-icon.png|icon.png|icon.svg).*)',
  ],
};
