import { NextResponse } from 'next/server';
import { getAllCities, getCitySlug, getAllStates, getStateSlug, EXTENDED_CITIES } from '@/lib/data/locations';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://callgirl4u.com";
  const today = new Date().toISOString().split('T')[0];

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

  const getCanonicalSlug = (city: string) => {
    const raw = getCitySlug(city);
    return CITY_ALIASES[raw] || raw;
  };

  const cities = getAllCities();
  const states = getAllStates();
  const stateSlugs = new Set(states.map(getStateSlug));

  const stateUrls = states.map(state => ({
    loc: `${baseUrl}/massage/state/${getStateSlug(state)}`,
    changefreq: 'weekly',
    priority: '0.7'
  }));

  const cityUrls = cities
    .filter(city => !stateSlugs.has(getCanonicalSlug(city)))
    .map(city => ({
      loc: `${baseUrl}/massage/${getCanonicalSlug(city)}`,
      changefreq: 'daily',
      priority: '0.8'
    }));

  const extendedCityUrls = EXTENDED_CITIES
    .filter(city => !stateSlugs.has(getCanonicalSlug(city)))
    .map(city => ({
      loc: `${baseUrl}/massage/${getCanonicalSlug(city)}`,
      changefreq: 'weekly',
      priority: '0.6'
    }));

  const rawUrls = [
    { loc: `${baseUrl}/massage`, changefreq: 'daily', priority: '0.9' },
    ...stateUrls,
    ...cityUrls,
    ...extendedCityUrls
  ];

  const seen = new Set<string>();
  const urls = rawUrls.filter(u => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  const urlElements = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
