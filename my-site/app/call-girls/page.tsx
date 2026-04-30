import { getAllStates, locations, getCitySlug, getStateSlug } from "@/lib/data/locations";
import Link from "next/link";
import type { Metadata } from "next";
import CitySearch from "@/components/CitySearch";
import { getAllCities } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "Call Girls in India | Browse by City & State | Verified Profiles",
  description: "Browse verified call girls and escort services across all major cities and states in India. Find real profiles, genuine photos, and 24/7 available services on CallGirl4U.",
  keywords: "call girls in india, escorts in india, verified call girls, browse call girls by city, call girl service india",
  alternates: {
    canonical: "https://callgirl4u.com/call-girls",
  }
};

export default function CallGirlsDirectory() {
  const states = getAllStates();
  const allCities = getAllCities();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-white py-12 border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl text-gray-900 mb-6 uppercase tracking-tighter">
            Browse <span className="text-red-600">Call Girls</span> in India
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Select your city or state to find verified independent call girls, college girls, and premium escorts near you.
          </p>
          
          <div className="max-w-md mx-auto">
            <CitySearch cities={allCities} layout="hero" />
          </div>
        </div>
      </section>

      {/* States Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl text-gray-900 mb-10 border-l-4 border-red-600 pl-4 uppercase tracking-tight">
          Find by State & Region
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {states.map((state) => (
            <div key={state} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
                <h3 className="text-white text-lg">{state}</h3>
                <Link 
                  href={`/call-girls/state/${getStateSlug(state)}`}
                  className="text-red-400 text-xs font-bold uppercase hover:text-red-300 transition"
                >
                  View All →
                </Link>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {locations[state].slice(0, 10).map((city) => (
                    <Link
                      key={city}
                      href={`/call-girls/${getCitySlug(city)}`}
                      className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded-lg border border-gray-200 hover:border-red-400 hover:text-red-600 transition-colors"
                    >
                      {city}
                    </Link>
                  ))}
                  {locations[state].length > 10 && (
                    <Link
                      href={`/call-girls/state/${getStateSlug(state)}`}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      +{locations[state].length - 10} More Cities
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t text-gray-800">
        <h2 className="text-3xl mb-6 uppercase tracking-tight">Genuine <strong>Call Girl Service Across India</strong></h2>
        <p className="mb-6 leading-relaxed">
          CallGirl4U is India's most trusted platform for finding genuine and verified <strong>call girl services</strong>. We understand the importance of safety, privacy, and authenticity in adult classifieds. That's why we offer a comprehensive directory spanning every state and major city. <strong>No advance payment</strong> is required—you only pay in cash. 
        </p>
        <p className="mb-6 leading-relaxed">
          Our listings include <strong>Call Girls in All Cities</strong>, including independent <strong>College girls</strong>, sophisticated housewives, and high-profile international models. If you are looking for a <strong>genuine call girls number</strong>, every profile is vetted to ensure that the photos you see are the people you meet. Get the <strong>best call girls number</strong> only on CallGirl4U.
        </p>
        <div className="bg-red-50 p-8 rounded-2xl border border-red-200">
          <h3 className="text-xl font-bold text-red-800 mb-4 uppercase tracking-wide">Why Browse on CallGirl4U?</h3>
          <ul className="space-y-3 text-gray-800 font-medium">
            <li className="flex items-center gap-3"><span className="text-red-600 text-xl">✓</span> 100% Verified Profiles with Real Photos</li>
            <li className="flex items-center gap-3"><span className="text-red-600 text-xl">✓</span> <strong>No advance payment</strong> - Pay Cash on Delivery</li>
            <li className="flex items-center gap-3"><span className="text-red-600 text-xl">✓</span> Discreet and Private Meeting Locations</li>
            <li className="flex items-center gap-3"><span className="text-red-600 text-xl">✓</span> <strong>Call Girls</strong> Available 24/7 in All Major Indian Cities</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
