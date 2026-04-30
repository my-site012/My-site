import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Using the domain pattern for Next.js SEO
  // Replace with final production .com domain eventually
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://callgirl4u.com";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/dashboard',
        '/login',
        '/register',
        '/post-ad',
        '/create-profile',
        '/api',
        '/search?',
        '/profile',
        '/ad/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
