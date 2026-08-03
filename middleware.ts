import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAllCities, getCitySlug, getAllStates, getStateSlug } from './lib/data/locations';

const BOTS_REGEX = /bot|googlebot|bingbot|crawler|spider|robot|crawling|ahrefs|siteaudit|semrush|screaming|gtmetrix/i;

let cachedMaintenance = false;
let lastChecked = 0;
const CACHE_TTL = 30000; // 30 seconds

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 0.1 INDEX / PHP URL REDIRECTS
  const lowerPath = pathname.toLowerCase();
  if (lowerPath === '/index.php' || lowerPath === '/index.html' || lowerPath === '/index.htm' || lowerPath === '/home.php' || lowerPath === '/home.html') {
    const targetUrl = new URL('/', request.url);
    return NextResponse.redirect(targetUrl, 301);
  }

  // 0.2 AD DETAIL REDIRECT TO SIMILAR CITY PAGE
  const pathParts = pathname.split('/').filter(Boolean);
  if (pathParts.length >= 2 && pathParts[0] === 'ad' && pathParts[1] !== 'post') {
    const id = pathParts[1];
    let category = 'call-girls';
    let rawLocation = '';

    if (id.startsWith('msg-')) {
      category = 'massage';
      const parts = id.split('-');
      rawLocation = parts.slice(1, -1).join('-');
    } else if (id.startsWith('boy-')) {
      category = 'call-boys';
      const parts = id.split('-');
      rawLocation = parts.slice(1, -1).join('-');
    } else if (id.startsWith('featured')) {
      category = 'call-girls';
      rawLocation = '';
    } else {
      category = 'call-girls';
      const parts = id.split('-');
      rawLocation = parts.slice(0, -1).join('-');
    }

    const cleanLocation = rawLocation.toLowerCase().trim();
    const targetPath = cleanLocation ? `/${category}/${cleanLocation}` : `/${category}`;
    const targetUrl = new URL(targetPath, request.url);
    return NextResponse.redirect(targetUrl, 301);
  }

  // 0. LEGACY URL REDIRECTS
  const CATEGORIES = ['call-girls', 'call-boys', 'massage'];
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length > 0 && CATEGORIES.includes(parts[0])) {
    // City name variant/alias 301 redirects to official slugs
    const CITY_ALIASES: Record<string, string> = {
      'bangalore': 'bengaluru',
      'belgaum': 'belagavi',
      'mysore': 'mysuru',
      'gulbarga': 'kalaburagi',
      'pondicherry': 'puducherry',
      'trivandrum': 'thiruvananthapuram',
      'calicut': 'kozhikode',
      'cochin': 'kochi',
      'mangalore': 'mangaluru',
      'shimoga': 'shivamogga',
      'hubli': 'hubballi',
      'trichy': 'tiruchirappalli',
      'baroda': 'vadodara',
      'bombay': 'mumbai',
      'calcutta': 'kolkata',
      'madras': 'chennai',
      'benaras': 'varanasi',
      'benares': 'varanasi',
      'gurgaon': 'gurugram'
    };
    if (parts.length === 2 && CITY_ALIASES[parts[1]]) {
      const targetUrl = new URL(`/${parts[0]}/${CITY_ALIASES[parts[1]]}`, request.url);
      searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
      });
      return NextResponse.redirect(targetUrl, 301);
    }

    // Redirect /[category]/state/[state]-locations -> /[category]/state/[state]
    if (parts.length === 3 && parts[1] === 'state' && parts[2].endsWith('-locations')) {
      const cleanState = parts[2].replace(/-locations$/, '');
      const targetUrl = new URL(`/${parts[0]}/state/${cleanState}`, request.url);
      searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
      });
      return NextResponse.redirect(targetUrl, 301);
    }

    // Redirect DMCA original city slugs to their -2 overrides for call-girls
    if (parts.length === 2 && parts[0] === 'call-girls') {
      const DMCA_REDIRECTS: Record<string, string> = {
        'jaipur': 'jaipur-2',
        'surat': 'surat-2',
        'jodhpur': 'jodhpur-2',
        'ghaziabad': 'ghaziabad-2',
        'varanasi': 'varanasi-2'
      };
      if (DMCA_REDIRECTS[parts[1]]) {
        const targetUrl = new URL(`/call-girls/${DMCA_REDIRECTS[parts[1]]}`, request.url);
        searchParams.forEach((value, key) => {
          targetUrl.searchParams.set(key, value);
        });
        return NextResponse.redirect(targetUrl, 301);
      }
    }

    // 3-part URL: /[category]/[state]/[city] -> /[category]/[city]
    if (parts.length === 3 && parts[1] !== 'state') {
      const targetUrl = new URL(`/${parts[0]}/${parts[2]}`, request.url);
      searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
      });
      return NextResponse.redirect(targetUrl, 301);
    }

    // 2-part URL: /[category]/[state] -> /[category]/state/[state]
    if (parts.length === 2) {
      const stateSlugs = getAllStates().map(getStateSlug);
      if (stateSlugs.includes(parts[1])) {
        const targetUrl = new URL(`/${parts[0]}/state/${parts[1]}`, request.url);
        searchParams.forEach((value, key) => {
          targetUrl.searchParams.set(key, value);
        });
        return NextResponse.redirect(targetUrl, 301);
      }
    }
  }

  // 0.5. BOT EARLY-EXIT (Bypasses maintenance check & geo redirects for search engine crawlers)
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = BOTS_REGEX.test(userAgent);
  if (isBot) {
    return NextResponse.next();
  }

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
        const KV_URL = process.env.KV_REST_API_URL || "https://logical-gnu-171787.upstash.io";
        const KV_TOKEN = process.env.KV_REST_API_TOKEN || "gQAAAAAAAp8LAAIgcDJiZDg5ZDlmNDA0MTY0MjhkYTJmY2Y1ZmY5ZDMyYTk5MA";

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
    // Match all routes except static assets, APIs, sitemaps, and robots.txt
    '/((?!_next/static|_next/image|favicon.ico|images|apple-icon.png|icon.png|icon.svg|api/|sitemap|robots.txt).*)',
  ],
};
