import { NextResponse } from 'next/server';
import { blogPosts } from '@/lib/data/blogPosts';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://callgirl4u.com";
  const today = new Date().toISOString().split('T')[0];

  const blogUrls = blogPosts.map(post => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.7'
  }));

  const urls = [
    { loc: `${baseUrl}/blog`, lastmod: today, changefreq: 'daily', priority: '0.8' },
    ...blogUrls
  ];

  const urlElements = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
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
