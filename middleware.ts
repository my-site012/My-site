import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAllCities, getCitySlug, getAllStates, getStateSlug } from './lib/data/locations';

const GOOD_BOTS_REGEX = /googlebot|bingbot|duckduckbot|slurp|baiduspider|yandex/i;
const BAD_BOTS_REGEX = /ahrefs|semrush|dotbot|mj12bot|petalbot|bytespider|scrapy|python-requests|aiohttp|curl\/|wget|httpclient|postman|censys|masscan|zgrab|nmap|nikto|zoominfobot|dataforseo|barkrowler/i;

let cachedMaintenance = false;
let lastChecked = 0;
const CACHE_TTL = 30000; // 30 seconds

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // 1. INSTANTLY BLOCK KNOWN BAD BOTS / SCRAPERS (Saves Vercel Functions & Bandwidth)
  if (BAD_BOTS_REGEX.test(userAgent)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  const { pathname, searchParams } = request.nextUrl;

  // 0. SUBDOMAIN REDIRECTS (e.g. jaipur.callgirl4u.com -> https://callgirl4u.com/call-girls/jaipur)
  const host = (request.headers.get('host') || '').toLowerCase().replace(/:\d+$/, '');
  if (host && host !== 'callgirl4u.com' && host !== 'www.callgirl4u.com' && host.endsWith('.callgirl4u.com')) {
    const subdomain = host.replace('.callgirl4u.com', '');
    if (subdomain === 'jaipur') {
      return NextResponse.redirect(new URL('https://callgirl4u.com/call-girls/jaipur'), 301);
    }
    const citySlug = getCitySlug(subdomain);
    if (citySlug) {
      return NextResponse.redirect(new URL(`https://callgirl4u.com/call-girls/${citySlug}`), 301);
    }
    return NextResponse.redirect(new URL('https://callgirl4u.com/'), 301);
  }

  // 0.1 INDEX / PHP / HTML URL REDIRECTS
  const lowerPath = pathname.toLowerCase();
  if (lowerPath === '/index.php' || lowerPath === '/index.html' || lowerPath === '/index.htm' || lowerPath === '/home.php' || lowerPath === '/home.html') {
    const targetUrl = new URL('/', request.url);
    return NextResponse.redirect(targetUrl, 301);
  }

  // Author pages redirect to /blog
  if (lowerPath.startsWith('/author/')) {
    const targetUrl = new URL('/blog', request.url);
    return NextResponse.redirect(targetUrl, 301);
  }

  // Generic & State legacy aliases
  const GENERIC_ALIASES: Record<string, string> = {
    '/tamil-call-girls': '/call-girls/state/tamil-nadu',
    '/kerala-call-girls': '/call-girls/state/kerala',
    '/kannada-call-girls': '/call-girls/state/karnataka',
    '/bihar-call-girl': '/call-girls/state/bihar',
    '/indian-call-girl': '/call-girls',
    '/call-girls-in-assam': '/call-girls/state/assam',
    '/call-girls-in-goa': '/call-girls/state/goa',
  };
  const normalizedPath = lowerPath.replace(/\/+$/, '');
  if (GENERIC_ALIASES[normalizedPath]) {
    const targetUrl = new URL(GENERIC_ALIASES[normalizedPath], request.url);
    return NextResponse.redirect(targetUrl, 301);
  }

  // Universal Single-Segment Legacy URL Pattern Matcher
  // Handles: /pune-call-girls/, /call-girl-noida.html, /call-girl-pune.html, /call-girls-in-mysore/, /andheri-escorts/, /escort-service-in-dehradun/, etc.
  const TOP_LEVEL_EXEMPTIONS = new Set([
    'call-girls', 'call-boys', 'massage', 'blog', 'admin', 'login', 'signup',
    'privacy-policy', 'terms-and-conditions', 'disclaimer', 'contact',
    'dmca', 'terms', 'privacy', 'forums', 'maintenance', 'ad', 'sitemap.xml'
  ]);
  const singleSegmentMatch = normalizedPath.match(/^\/([a-z0-9.-]+)$/);
  if (singleSegmentMatch) {
    const rawSlug = singleSegmentMatch[1];
    if (!TOP_LEVEL_EXEMPTIONS.has(rawSlug) && !rawSlug.startsWith('sitemap')) {
      let cleanSlug = rawSlug
        .replace(/\.html?$/, '')
        .replace(/^call-girls?-in-/, '')
        .replace(/^call-girls?-/, '')
        .replace(/^call-girl-in-/, '')
        .replace(/^call-girl-/, '')
        .replace(/^escort-service-in-/, '')
        .replace(/-call-girls?-number$/, '')
        .replace(/-call-girls?$/, '')
        .replace(/-call-girl$/, '')
        .replace(/-escorts?$/, '')
        .replace(/-romantic-sexy-girls$/, '')
        .replace(/-\d+$/, '');

      if (cleanSlug) {
        const citySlug = getCitySlug(cleanSlug) || cleanSlug;
        const targetUrl = new URL(`/call-girls/${citySlug}`, request.url);
        return NextResponse.redirect(targetUrl, 301);
      }
    }
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

    const STATE_ALIASES: Record<string, string> = {
      'andaman-nicobar-islands': 'andaman-and-nicobar-islands',
      'dadra-nagar-haveli': 'dadra-and-nagar-haveli',
      'jammu-kashmir': 'jammu-and-kashmir',
    };
    if (parts.length === 2 && STATE_ALIASES[parts[1]]) {
      const targetUrl = new URL(`/${parts[0]}/state/${STATE_ALIASES[parts[1]]}`, request.url);
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

    // Redirect -2 overrides back to clean slug for non-call-girls categories (e.g. /call-boys/jodhpur-2 -> /call-boys/jodhpur)
    if (parts.length === 2 && parts[0] !== 'call-girls' && /-\d+$/.test(parts[1])) {
      const cleanCity = parts[1].replace(/-\d+$/, '');
      const targetUrl = new URL(`/${parts[0]}/${cleanCity}`, request.url);
      searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
      });
      return NextResponse.redirect(targetUrl, 301);
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

  // BOT EARLY-EXIT — Search engine bots (Googlebot, Bingbot, etc.) bypass maintenance check
  const isGoodBot = GOOD_BOTS_REGEX.test(userAgent);
  if (isGoodBot) {
    return NextResponse.next();
  }

  // 1. MAINTENANCE MODE CHECK
  const isExempt = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api/report') ||
    pathname.startsWith('/api/whatsapp-click') ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?|map)$/i.test(pathname);

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

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static assets, APIs, sitemaps, and robots.txt
    '/((?!_next/static|_next/image|favicon.ico|images|apple-icon.png|icon.png|icon.svg|api/|sitemap|robots.txt).*)',
  ],
};
