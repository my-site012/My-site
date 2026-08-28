import { getAllStates, locations, getCitySlug, getStateSlug } from "@/lib/data/locations";
import Link from "next/link";
import type { Metadata } from "next";
import CitySearch from "@/components/CitySearch";
import { getAllCities } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "Massage Service in India | Body Massage, Spa & Female to Male Massage Near You",
  description: "Find verified full body massage service near you across India. Book female to male massage, B2B spa, happy ending massage, and home delivery massage with direct contact. Cash on delivery.",
  keywords: "massage service india, body massage india, female to male massage, B2B massage, full body massage, spa near me, massage parlour india, home massage delivery, happy ending massage",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://callgirl4u.com/massage",
  }
};

import ServiceStateGrid from "@/components/ServiceStateGrid";

export default function MassageDirectory() {
  const states = getAllStates();
  const allCities = getAllCities();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Massage Service Directory India",
    "description": "Browse local full body massage service, female to male spa, B2B massage, and home delivery massage in all states across India.",
    "url": "https://callgirl4u.com/massage",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": states.length,
      "itemListElement": states.map((state, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://callgirl4u.com/massage`,
        "name": `Massage Service in ${state}`
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
            Browse <span className="text-purple-600">Massage Service</span> in India
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Select your city to find verified massage therapists, body spa, B2B massage, and home delivery massage service near you.
          </p>

          <div className="max-w-md mx-auto">
            <CitySearch cities={allCities} layout="hero" />
          </div>
        </div>
      </section>

      {/* Full States & Cities Grid */}
      <ServiceStateGrid category="massage" />

      {/* Service Types */}
      <section className="max-w-4xl mx-auto px-4 py-12 border-t text-gray-800">
        <h2 className="text-3xl mb-6 uppercase tracking-tight">Types of <strong>Massage Service</strong> Available in India</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: "💆", title: "Full Body Massage", desc: "Deep relaxation head-to-toe" },
            { icon: "🛁", title: "B2B Massage", desc: "Body to body sensual spa" },
            { icon: "🌸", title: "Aromatherapy", desc: "Essential oils & herbal spa" },
            { icon: "✨", title: "Happy Ending", desc: "Complete satisfaction session" },
          ].map((type) => (
            <div key={type.title} className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="font-bold text-gray-900 text-sm">{type.title}</div>
              <div className="text-gray-500 text-xs mt-1">{type.desc}</div>
            </div>
          ))}
        </div>

        <p className="mb-6 leading-relaxed">
          CallGirl4U is India's trusted platform for finding genuine and verified <strong>massage service</strong> providers. Browse verified profiles of professional massage therapists offering full body massage, B2B spa, aromatherapy, and home delivery massage across all major Indian cities. <strong>No advance payment required</strong> — pay only in cash after your session.
        </p>
        <p className="mb-6 leading-relaxed">
          Our massage directory covers hundreds of cities across India including <strong>Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad</strong> and many more. Every massage therapist listed here is verified for photo authenticity and contact details.
        </p>
        <div className="bg-purple-50 p-8 rounded-2xl border border-purple-200">
          <h3 className="text-xl font-bold text-purple-800 mb-4 uppercase tracking-wide">Why Book on CallGirl4U?</h3>
          <ul className="space-y-3 text-gray-800 font-medium">
            <li className="flex items-center gap-3"><span className="text-purple-600 text-xl">✓</span> 100% Verified Massage Therapist Profiles</li>
            <li className="flex items-center gap-3"><span className="text-purple-600 text-xl">✓</span> <strong>No advance payment</strong> — Pay Cash After Service</li>
            <li className="flex items-center gap-3"><span className="text-purple-600 text-xl">✓</span> Home & Hotel Delivery Massage Available</li>
            <li className="flex items-center gap-3"><span className="text-purple-600 text-xl">✓</span> <strong>Massage Service</strong> Available 24/7 Across India</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
