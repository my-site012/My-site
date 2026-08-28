import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Using the domain pattern for Next.js SEO
  // Replace with final production .com domain eventually
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://callgirl4u.com";

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/*',
          '/images/*',
          '/favicon.ico',
          '/apple-icon.png',
          '/icon.png',
          '/icon.svg'
        ],
        disallow: [
          '/admin',
          '/dashboard',
          '/login',
          '/register',
          '/create-profile',
          '/api',
          '/search',
          '/search/',
          '/search/*',
          '/search?*',
          '/*?*q=*',
          '/*?*search=*',
          '/*?*s=*',
          '/profile'
        ],
      },
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'DotBot',
          'MJ12bot',
          'PetalBot',
          'Bytespider',
          'Amazonbot',
          'ClaudeBot',
          'GPTBot',
          'CCBot',
          'MegaIndex.ru',
          'BLEXBot'
        ],
        disallow: ['/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
