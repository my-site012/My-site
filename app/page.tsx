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
  title: "CallGirl4U – Local Adult Classifieds & Personal Advertisements in India",
  description: "Browse local personal and adult classified advertisements across India on CallGirl4U. Explore advertiser profiles by city, connect with independent companions, or publish a free listing.",
  alternates: {
    canonical: "https://callgirl4u.com",
  },
  openGraph: {
    title: "CallGirl4U – Local Adult Classifieds & Personal Advertisements in India",
    description: "Browse local personal and adult classified advertisements across India on CallGirl4U. Explore advertiser profiles by city, connect with independent companions, or publish a free listing.",
    url: "https://callgirl4u.com",
    siteName: "CallGirl4U",
    type: "website",
    images: [
      {
        url: "https://callgirl4u.com/icon.png",
        width: 512,
        height: 512,
        alt: "CallGirl4U Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CallGirl4U – Local Adult Classifieds & Personal Advertisements in India",
    description: "Browse local personal and adult classified advertisements across India on CallGirl4U. Explore advertiser profiles by city, connect with independent companions, or publish a free listing.",
    images: ["https://callgirl4u.com/icon.png"],
  },
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
    "description": "CallGirl4U is an online classifieds platform in India for local personal advertisements, companion listings, and wellness massage services."
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
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Local Adult Classifieds and Companion Directory across India
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto mb-8">
            Search verified advertiser listings by city and category to discover independent companions and massage therapies in your area.
          </p>
          
          <CitySearch cities={getAllCities()} layout="hero" />
        </div>
      </section>

      {/* Featured Ads Section */}
      {featuredImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Profiles</h2>
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
                  title={`${adName} – Independent Profile`}
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
              About CallGirl4U Classifieds Directory
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              CallGirl4U is an open advertising portal connecting independent companion advertisers with consenting adults across India. Our directory offers an organized platform for users to browse personal listings by location and category while maintaining privacy and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Left Column - Popular Categories */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-100 pb-2">
                Available Directory Categories
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 text-lg">Independent Female Companions</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    Browse profiles of independent female advertisers in major metropolitan areas such as Delhi NCR, Mumbai, Bengaluru, Hyderabad, and Jaipur. View verified contact details to connect directly with advertisers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 text-lg">Wellness & Body Massages</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    Find relaxation and wellness services, including therapeutic body massages and independent spa packages posted by local therapists in your city.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 text-lg">Male Companions</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    Explore listings from professional male companions offering social dating and companion services across major Indian cities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 text-lg">Transgender & Transsexual Companions</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    Discover inclusive personal advertisements from transgender and TS companions offering direct contact channels in a safe environment.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Free Ad Posting & Safety */}
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Publish Your Free Classified Ad
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Are you an independent companion or massage therapist looking to reach clients in your city? CallGirl4U provides a straightforward advertising platform. Create your profile, upload your photos, and publish your classified ad at no cost.
                </p>
                <a href="/ad/post" className="inline-block bg-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow hover:bg-red-700 transition">
                  Post Free Ad
                </a>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
                  ⚠️ User Safety & Anti-Fraud Advisory
                </h3>
                <p className="text-gray-700 text-xs leading-relaxed">
                  CallGirl4U is strictly an advertising directory and does not handle payments, bookings, or client-advertiser transactions. For your safety, <strong>never send advance payments or deposits online</strong> (such as hotel deposits, registration charges, or travel fees). Always verify companion identity in person and handle transactions directly.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="border-t border-gray-100 pt-8 text-center text-xs text-gray-500 max-w-4xl mx-auto">
            <p className="leading-relaxed">
              <strong>Disclaimer:</strong> This website is an open advertising directory strictly intended for individuals aged 18 years and above. All listings are posted by independent third-party advertisers. CallGirl4U does not operate an agency, employ any individuals listed, or mediate interactions between users and advertisers. All users are expected to comply with applicable local, state, and national laws.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
