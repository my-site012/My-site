import { getAllStates, locations, getCitySlug, getStateSlug } from "@/lib/data/locations";
import Link from "next/link";
import type { Metadata } from "next";
import CitySearch from "@/components/CitySearch";
import { getAllCities } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "Explore Call Boy Listings Across India",
  description: "Search verified call boy ads by city or state. Connect with independent call boys, premium services, and more.",
  keywords: "call boy india, indian call boys, adult classifieds india, premium call boys",
  alternates: {
    canonical: "https://callgirl4u.com/call-boys",
  },
};

import ServiceStateGrid from "@/components/ServiceStateGrid";

export default function CallBoysDirectory() {
  const states = getAllStates();
  const allCities = getAllCities();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Call Boys Directory India",
    "description": "Browse local adult classifieds and verified independent call boys across India.",
    "url": "https://callgirl4u.com/call-boys",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": states.length,
      "itemListElement": states.map((state, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://callgirl4u.com/call-boys/state/${getStateSlug(state)}`,
        "name": `Call Boys in ${state}`,
      }))
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Dynamic SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="bg-white py-12 border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl text-gray-900 mb-6 uppercase tracking-tighter">
            Browse <span className="text-red-600">Call Boys</span> in India
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Select your city or state to find verified independent call boys and premium services near you.
          </p>
          <div className="max-w-md mx-auto">
            <CitySearch cities={allCities} layout="hero" />
          </div>
        </div>
      </section>

      {/* Full States & Cities Grid */}
      <ServiceStateGrid category="call-boys" />
    </div>
  );
}
