import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Using the domain pattern for Next.js SEO
  // Replace with final production .com domain eventually
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://callgirl4u.com";

  return {
    rules: [
      {
        userAgent: [
          'Googlebot',
          'Googlebot-Image',
          'Googlebot-News',
          'Googlebot-Video',
          'Mediapartners-Google',
          'AdsBot-Google'
        ],
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
          '/admin/*',
          '/dashboard',
          '/login',
          '/register',
          '/create-profile',
          '/maintenance',
          '/booking',
          '/api/*',
          '/search',
          '/search/*',
          '/*?*q=*',
          '/*?*search=*',
          '/*?*s=*',
          '/*?*filter=*',
          '/*?*sort=*',
          '/profile'
        ],
      },
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/admin',
          '/admin/*',
          '/dashboard',
          '/login',
          '/register',
          '/create-profile',
          '/maintenance',
          '/booking',
          '/api/*',
          '/search',
          '/search/*',
          '/*?*q=*',
          '/*?*search=*',
          '/*?*s=*',
          '/*?*filter=*',
          '/*?*sort=*',
          '/profile',
        ],
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap_main.xml`,
      `${baseUrl}/sitemap_call_girls.xml`,
      `${baseUrl}/sitemap_call_boys.xml`,
      `${baseUrl}/sitemap_massage.xml`,
    ],
  };
}
