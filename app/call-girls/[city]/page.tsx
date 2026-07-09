import { getAllCities, getCitySlug, getStateFromCity } from "@/lib/data/locations";
import { cityContentData, CitySEOContent } from "@/lib/data/cityContent";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import type { Metadata } from "next";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId, getContactNumber, getHash } from "@/lib/ad-logic";
import { cachedGetValue } from "@/lib/kv";

// ISR: revalidate every hour — content is deterministic, no need to re-render on every request
export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllCities().map(city => ({
    city: getCitySlug(city)
  }));
}

import { getCitySeo, getDefaultSeoData } from "@/lib/seo-templates";

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const state = getStateFromCity(city) || "India";
  const seoData = cityContentData[city] || getDefaultSeoData(cityName, state);
  
  // Get custom SEO templates
  const customSeo = getCitySeo(city);
  
  return {
    title: customSeo.title,
    description: customSeo.description,
    keywords: seoData.metaKeywords,
    alternates: {
      canonical: `https://callgirl4u.com/call-girls/${city}`,
    }
  };
}


export default async function CityPage({ params, searchParams }: { params: Promise<{ city: string }>, searchParams: Promise<{ page?: string }> }) {
  const { city } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const adsPerPage = 12;
  
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const state = getStateFromCity(city) || "India";
  
  const seoData = cityContentData[city] || getDefaultSeoData(cityName, state);
  
  const totalAdsToShow = 48; 
  
  // Use city as seed for the image pool
  const cityImages = getDeterministicImagesPool(city, totalAdsToShow);
  const paginatedImages = cityImages.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage);
  
  const totalPages = Math.ceil(totalAdsToShow / adsPerPage);

  // Fetch global phone from KV
  const globalPhone = await cachedGetValue("contact_phone");

  // Helper: strip HTML tags for schema plain text
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();

  // Dynamic Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoData.h1,
    "description": seoData.metaDescription,
    "url": `https://callgirl4u.com/call-girls/${city}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": paginatedImages.length,
      "itemListElement": paginatedImages.map((imgPath, index) => {
        const overallIndex = ((currentPage - 1) * adsPerPage) + index;
        const adId = `${city}-${overallIndex}`;
        const adName = getNameFromId(adId);
        const price = getPriceFromId(adId);
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "LocalBusiness",
            "name": `${adName} - VIP Companion`,
            "image": `https://callgirl4u.com${imgPath}`,
            "telephone": getContactNumber(adId, globalPhone),
            "priceRange": `INR ${price}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cityName,
              "addressRegion": state,
              "postalCode": (110001 + (getHash(cityName) % 889999)).toString(),
              "streetAddress": `${cityName} City Center`,
              "addressCountry": "IN"
            }
          }
        };
      })
    }
  };

  // FAQ Schema for Google Rich Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": seoData.faqs.map((faq) => ({
      "@type": "Question",
      "name": stripHtml(faq.q),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": stripHtml(faq.a)
      }
    }))
  };

  return (
    <div className="bg-gray-50 pb-12">
      {/* Dynamic SEO JSON-LD — CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* FAQ Schema — Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-white py-10 border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl text-gray-900 mb-4">{seoData.h1}</h1>
          <p className="text-gray-600 text-lg" dangerouslySetInnerHTML={{ __html: seoData.heroSubtext }} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-gray-900">Featured Profiles in {cityName}</h2>
          <span className="text-gray-500 text-sm">{totalAdsToShow} Ads Available (Page {currentPage}/{totalPages})</span>
        </div>
        
        {paginatedImages.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {paginatedImages.map((imgPath, index) => {
                 const overallIndex = ((currentPage - 1) * adsPerPage) + index;
                 const adId = `${city}-${overallIndex}`;
                 const adName = getNameFromId(adId);
                 const adTitle = `${adName} - VIP Companion`;
                 const price = getPriceFromId(adId);

                 return (
                   <AdCard 
                    key={overallIndex}
                    id={adId}
                    title={adTitle}
                    location={cityName}
                    price={price}
                    imagePath={imgPath}
                    index={index}
                    phone={globalPhone || undefined}
                  />
                 );
              })}
            </div>

            {/* Pagination Button */}
            <div className="mt-12 flex justify-center">
              {currentPage < totalPages ? (
                <Link 
                  href={`/call-girls/${city}?page=${currentPage + 1}`}
                  className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg flex items-center gap-2"
                >
                  Show More Profiles (Page {currentPage + 1}) →
                </Link>
              ) : (
                <Link 
                  href={`/call-girls/${city}?page=1`}
                  className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition shadow-lg"
                >
                  ← Back to First Page
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500">No ads found for {cityName} yet.</p>
          </div>
        )}
      </section>

      <article className="max-w-4xl mx-auto px-4 py-12 prose prose-lg prose-red text-gray-800 border-t">
        <h2 className="text-2xl mb-4">{seoData.introHeading}</h2>
        <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.introText }} />

        {/* Safe Dating & Anti-Scam Advisory */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8 not-prose">
          <h3 className="text-lg font-bold text-amber-800 mb-2 mt-0 flex items-center gap-2">
            ⚠️ Safe Dating & Anti-Scam Advisory for {cityName}
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            To ensure a safe and positive experience when using our independent directory in <strong>{cityName}</strong>, please observe these safety practices:
          </p>
          <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1.5">
            <li><strong>Never Pay Upfront:</strong> Under no circumstances should you transfer booking fees, medical card fees, or transport charges via UPI, Paytm, or bank transfer prior to meeting.</li>
            <li><strong>Verify Companions:</strong> Confirm that the companion matches their verified directory pictures in person before making any payments.</li>
            <li><strong>Choose Safe Venues:</strong> Arrange meetings at verified, reputable hotels or safe personal residences.</li>
            <li><strong>Report Scams:</strong> Use the <strong>"Report Profile"</strong> button on the listing card to flag suspicious profiles or prepayment requests immediately.</li>
          </ul>
        </div>

        <h2 className="text-2xl mb-4">{seoData.whyChooseHeading}</h2>
        <div className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.whyChooseText }} />

        <h2 className="text-2xl mb-4">{seoData.typesHeading}</h2>
        <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.typesText }} />

        <h2 className="text-2xl mb-4">{seoData.bookingHeading}</h2>
        <div className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.bookingText }} />

        <h2 className="text-2xl mb-4">{seoData.areasHeading}</h2>
        <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.areasText }} />

        <h2 className="text-2xl mb-4">{seoData.rateHeading}</h2>
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: seoData.rateIntro }} />
        <div className="overflow-x-auto mb-8 rounded-lg shadow-sm border border-gray-200">
          <table className="w-full text-left bg-white font-sans text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-700">Category</th>
                <th className="p-4 font-semibold text-gray-700">1 Shot</th>
                <th className="p-4 font-semibold text-gray-700">2 Shots</th>
                <th className="p-4 font-semibold text-gray-700">Full Night</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-4">College Girls & Housewife Call Girls</td>
                <td className="p-4">₹2,100</td>
                <td className="p-4">₹3,500</td>
                <td className="p-4">₹6,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">Independent Call Girls in {cityName}</td>
                <td className="p-4">₹3,000</td>
                <td className="p-4">₹5,000</td>
                <td className="p-4">₹10,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">Russian Escorts / VIP Companions</td>
                <td className="p-4">₹8,000</td>
                <td className="p-4">₹12,000</td>
                <td className="p-4">₹20,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl mb-4">{seoData.privacyHeading}</h2>
        <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.privacyText }} />

        <h2 className="text-2xl mb-6">{seoData.faqHeading}</h2>
        <div className="space-y-4 mb-10">
          {seoData.faqs.map((faq, i) => (
            <div key={i} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-2" dangerouslySetInnerHTML={{ __html: faq.q }} />
              <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: faq.a }} />
            </div>
          ))}
        </div>

        <div className="bg-red-50 p-6 rounded-xl border border-red-200 my-8 shadow-sm">
          <div className="text-gray-800 font-medium leading-relaxed italic space-y-4" dangerouslySetInnerHTML={{ __html: seoData.hindiText }} />
        </div>
      </article>

      {/* Tags Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            `Escorts in ${cityName}`,
            `${cityName} Escorts`,
            `Independent Escorts ${cityName}`,
            `Escort Directory ${cityName}`,
            `Companions in ${cityName}`,
            `VIP Escorts ${cityName}`,
            `Verified Profiles ${cityName}`,
            `Independent Companions ${cityName}`,
            `Adult Classifieds ${cityName}`,
            `Verified Directory ${cityName}`,
          ] as string[]).map((tag, i) => {
            const colors = [
              'bg-red-600','bg-orange-500','bg-blue-700','bg-green-700',
              'bg-gray-800','bg-red-700','bg-orange-600','bg-blue-600',
              'bg-green-600','bg-rose-600','bg-indigo-700','bg-amber-600',
            ];
            return (
              <Link
                key={i}
                href={`/call-girls/${city}`}
                title={tag}
                className={`${colors[i % colors.length]} text-white text-xs font-medium px-3 py-1 rounded flex items-center gap-1 hover:opacity-80 transition-opacity`}
              >
                {tag} <span aria-hidden>&#10148;</span>
              </Link>
            );
          })}
        </div>

        {/* Yellow SEO Tag Cloud */}
        <div className="bg-[#f7d046] text-gray-950 p-6 rounded-xl border border-yellow-400/30 shadow-sm">
          <div className="text-xs md:text-sm font-medium leading-relaxed text-justify tracking-wide">
            {([
              `Call Girl In ${cityName}`,
              `Call Girl Near Me`,
              `Call Girl Number In ${cityName}`,
              `Escort Service In ${cityName}`,
              `Call Girls In ${cityName}`,
              `Escort Service ${cityName}`,
              `${cityName} Escorts`,
              `${cityName} Escort Service`,
              `Call Girl Contact Number ${cityName}`,
              `Call Girl Price ${cityName}`,
              `Call Girls Near Me`,
              `${cityName} Escort`,
              `Escorts Service In ${cityName}`,
              `Low Price Call Girl in ${cityName}`,
              `Call Girls ${cityName}`,
              `Call Girls Number ${cityName}`,
              `Escort In ${cityName}`,
              `Escorts In ${cityName}`,
              `Call Girl Pics ${cityName}`,
              `Escort Girl In ${cityName}`,
              `Call Girls Contact Number ${cityName}`,
              `Call Girls Rate ${cityName}`,
              `Call Girl Service ${cityName}`,
              `Call Girls Pics ${cityName}`,
              `Best Escort Service ${cityName}`,
              `Low Price Call Girls ${cityName}`,
              `${cityName} Call Girl Service`,
              `Cheap Call Girl Near Me`,
              `Call Girls Price ${cityName}`,
              `Call Girl In ${cityName}`,
              `Escort Near Me`,
              `${cityName} Call Girl Number`,
              `Escort ${cityName}`,
              `Photo Call Girls ${cityName}`,
              `Call Girls Low Price ${cityName}`,
              `Call Girls Service In ${cityName}`,
              `Near me Call Girl`,
              `Call Girls Photo ${cityName}`,
              `Call Girl Phone Number ${cityName}`,
              `Escort Services In ${cityName}`,
              `Low Rate Call Girls ${cityName}`,
              `Call Girl Low Rate ${cityName}`,
              `Call Girl Escort Service ${cityName}`,
              `Cheap Rate Call Girls ${cityName}`,
              `Night Call Girl ${cityName}`,
              `Nearest Call Girl ${cityName}`,
              `Escorts Near Me`,
              `Call Girl Ka Number ${cityName}`,
              `Low Cost Call Girls ${cityName}`,
              `Escort Call Girl ${cityName}`,
              `Near By Call Girl ${cityName}`,
              `Call Girl Services ${cityName}`,
              `Call Girls Numbers ${cityName}`,
              `Call Girl Agent Number ${cityName}`,
              `Cheapest Call Girl ${cityName}`,
            ] as string[]).map((tag, idx, arr) => (
              <span key={idx}>
                <Link
                  href={`/call-girls/${city}`}
                  title={tag}
                  className="hover:underline hover:text-black/80 transition-colors"
                >
                  {tag}
                </Link>
                {idx < arr.length - 1 && (
                  <span className="mx-2 text-gray-950 font-normal select-none" aria-hidden>
                    ☛
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Cross-Service Interlinking Section */}
        <div className="max-w-4xl mx-auto px-4 mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-center">
            Other Adult Services Available in {cityName}
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/call-boys/${city}`}
              className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              👨 Call Boys in {cityName}
            </Link>
            <Link
              href={`/massage/${city}`}
              className="px-4 py-2 bg-purple-50 text-purple-600 text-sm font-bold rounded-xl border border-purple-100 hover:bg-purple-600 hover:text-white transition-all shadow-sm"
            >
              💆 Massage Service in {cityName}
            </Link>
            <Link
              href={`/call-girls`}
              className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-800 hover:text-white transition-all shadow-sm"
            >
              📍 All India Call Girls Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
