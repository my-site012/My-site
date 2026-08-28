import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://callgirl4u.com";
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    { loc: `${baseUrl}`, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/call-girls`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/call-boys`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/massage`, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/forums`, changefreq: 'daily', priority: '0.7' },
    { loc: `${baseUrl}/ad/post`, changefreq: 'weekly', priority: '0.7' },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.5' },
    { loc: `${baseUrl}/privacy`, changefreq: 'monthly', priority: '0.3' },
    { loc: `${baseUrl}/terms`, changefreq: 'monthly', priority: '0.3' },
    { loc: `${baseUrl}/dmca`, changefreq: 'monthly', priority: '0.3' },
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
