import { MetadataRoute } from 'next';
import { getAllCities, getCitySlug, getAllStates, getStateSlug } from '@/lib/data/locations';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://callgirl4u.com";
  
  // Base App Routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }
  ];

  // Dynamic City Routes
  const cities = getAllCities();
  const cityRoutes = cities.map((city) => ({
    url: `${baseUrl}/call-girls/${getCitySlug(city)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Dynamic State Routes
  const states = getAllStates();
  const stateRoutes = states.map((state) => ({
    url: `${baseUrl}/call-girls/state/${getStateSlug(state)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...cityRoutes, ...stateRoutes];
}
