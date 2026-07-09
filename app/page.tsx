import type { Metadata } from "next";
import StateGrid from "@/components/StateGrid";
import AdCard from "@/components/AdCard";
import { getAllCities } from "@/lib/data/locations";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId } from "@/lib/ad-logic";
import CitySearch from "@/components/CitySearch";
import { cachedGetValue } from "@/lib/kv";

// ISR: revalidate every hour — homepage content is deterministic
export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: {
    canonical: "https://callgirl4u.com",
  },
};

export default async function Home() {
  // Use a stable seed for featured ads
  const featuredImages = getDeterministicImagesPool("featured-home-seed", 8);
  const globalPhone = await cachedGetValue("contact_phone");

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CallGirl4U",
    "alternateName": ["CallGirl4U India", "CallGirl 4U"],
    "url": "https://callgirl4u.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://callgirl4u.com/call-girls/{search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CallGirl4U",
    "url": "https://callgirl4u.com",
    "logo": "https://callgirl4u.com/icon.png",
    "description": "CallGirl4U is the #1 adult classifieds website in India. Browse local listings for independent call girls, massages, male escorts, and shemale dating."
  };

  return (
    <div>
      {/* Dynamic SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      {/* Hero Search Section */}
      <section className="bg-gray-50 py-12 border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-6 uppercase tracking-tighter">
            Find Verified Adult Classifieds on <span className="text-red-600">CallGirl4U</span>
          </h1>
          
          <CitySearch cities={getAllCities()} layout="hero" />
        </div>
      </section>

      {/* Featured Ads Section */}
      {featuredImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 border-b">
          <h2 className="text-2xl text-gray-900 mb-6">Featured Profiles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => {
              const adId = `featured-${index}`;
              const adName = getNameFromId(adId);
              const price = getPriceFromId(adId);
              const imgPath = getDeterministicImagesPool(adId, 12)[0];
              
              return (
                 <AdCard 
                  key={index}
                  id={adId}
                  title={`${adName} - VIP Independent`}
                  location="Delhi NCR"
                  price={price}
                  imagePath={imgPath}
                  index={index}
                  phone={globalPhone || undefined}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* State + City Grid */}
      <StateGrid />

      {/* SEO & Informative Content Section */}
      <section className="bg-white border-t border-gray-200 mt-12 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              India's Premier Adult Classifieds & Escort Directory
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Welcome to CallGirl4U, the most trusted and secure platform for local adult classified advertisements across India. We connect independent companion advertisers with consenting adults, ensuring complete transparency and privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Left Column - Popular Categories */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-100 pb-2">
                Popular Adult Categories in India
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 text-lg">Independent Call Girls</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    Discover handpicked and verified female call girls and premium escorts in Delhi, Mumbai, Jaipur, Bengaluru, and other major cities. Find real, high-quality photos and contact details to connect directly.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 text-lg">Sensual Body Massages</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    Unwind and destress with therapeutic body-to-body massages, executive spa packages, and independent massage therapies. Search local listings to find professional massagers near you.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 text-lg">Male Escorts & Gigolos</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    Browse premium listings of athletic and professional male escorts catering to women, men, and couples looking for companionship and elite dating experiences.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 text-lg">Transsexual & Shemale Escorts</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    Explore diverse profiles of beautiful TS and shemale escorts across major Indian cities. Connect with genuine individuals in a safe, supportive, and judgment-free environment.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Free Ad Posting & Safety */}
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Post Your Adult Ad Absolutely Free!
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Are you an independent call girl, male companion, transsexual escort, or massage therapist looking to reach clients in India? CallGirl4U is the perfect advertising hub. Create a profile, upload photos, specify your location, and publish your ad completely free of charge. Reach thousands of daily visitors in just a few steps.
                </p>
                <a href="/ad/post" className="inline-block bg-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow hover:bg-red-700 transition">
                  Post Free Ad Now
                </a>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
                  ⚠️ Safety Guide: Avoid Prepayment Scams
                </h3>
                <p className="text-gray-700 text-xs leading-relaxed">
                  CallGirl4U is purely an advertising directory and does not offer booking coordination or financial transaction processing. We strongly advise both clients and advertisers to prioritize safety. <strong>Never pay any money online in advance</strong>—whether for hotel bookings, transport costs, medical cards, or reservation fees. Always meet in person, verify your companion, and pay in cash directly.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-500 max-w-4xl mx-auto">
            <p className="leading-relaxed">
              <strong>Disclaimer:</strong> This website is an open-platform hosting service strictly intended for adults aged 18 and above. The advertisements published here are created by independent advertisers. CallGirl4U does not arrange meetings, verify legal age of physical interactions, or run an escort agency. Users are responsible for complying with all local, state, and national laws in India when utilizing services advertised on this portal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
