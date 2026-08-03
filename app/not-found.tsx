import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | CallGirl4U',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const topCities = [
    { name: 'Mumbai', slug: 'mumbai' },
    { name: 'Delhi', slug: 'delhi' },
    { name: 'Bengaluru', slug: 'bengaluru' },
    { name: 'Hyderabad', slug: 'hyderabad' },
    { name: 'Pune', slug: 'pune' },
    { name: 'Chennai', slug: 'chennai' },
    { name: 'Kolkata', slug: 'kolkata' },
    { name: 'Jaipur', slug: 'jaipur-2' },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-xl w-full text-center bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-600 text-3xl font-black mb-6">
          404
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved to a new URL. Explore popular categories or cities below.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <Link href="/call-girls" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-2 rounded-xl text-sm transition shadow-sm">
            Call Girls
          </Link>
          <Link href="/call-boys" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-2 rounded-xl text-sm transition shadow-sm">
            Call Boys
          </Link>
          <Link href="/massage" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-2 rounded-xl text-sm transition shadow-sm">
            Massage
          </Link>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Popular Locations</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {topCities.map((city) => (
              <Link
                key={city.slug}
                href={`/call-girls/${city.slug}`}
                className="text-xs font-medium text-gray-700 bg-gray-100 hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-lg transition"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link href="/" className="text-sm font-bold text-red-600 hover:text-red-800 transition">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
