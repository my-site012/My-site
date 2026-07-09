import { NextResponse } from 'next/server';
import { getAllCities, getCitySlug, getAllStates, getStateSlug } from '@/lib/data/locations';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://callgirl4u.com";
  const today = new Date().toISOString().split('T')[0];

  const cities = getAllCities();
  const states = getAllStates();

  const stateUrls = states.map(state => ({
    loc: `${baseUrl}/massage/state/${getStateSlug(state)}`,
    changefreq: 'weekly',
    priority: '0.7'
  }));

  const cityUrls = cities.map(city => ({
    loc: `${baseUrl}/massage/${getCitySlug(city)}`,
    changefreq: 'daily',
    priority: '0.8'
  }));

  const urls = [
    { loc: `${baseUrl}/massage`, changefreq: 'daily', priority: '0.9' },
    ...stateUrls,
    ...cityUrls
  ];

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
