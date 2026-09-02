import { getAllCities, getCitySlug, getStateFromCity, locations, getCallGirlsSlug, EXTENDED_CITIES, isExtendedCity } from "@/lib/data/locations";
import { cityContentData, CitySEOContent } from "@/lib/data/cityContent";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import type { Metadata } from "next";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId, getContactNumber, getHash } from "@/lib/ad-logic";
import { cachedGetValue, getJson, lRange, kvCommand } from "@/lib/kv";
import { notFound } from "next/navigation";

// ISR: revalidate every hour — content is deterministic, no need to re-render on every request
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const cities = getAllCities().map(city => getCallGirlsSlug(city));
  const overrides = Object.keys(CITY_DISPLAY_OVERRIDES);
  const extended = EXTENDED_CITIES.map(city => getCitySlug(city));
  return [...cities, ...overrides, ...extended].map(city => ({ city }));
}

import { getCitySeo, getDefaultSeoData } from "@/lib/seo-templates";

// Jaipur sub-areas — slug → raw area name mapping
const JAIPUR_SUB_SLUGS: Record<string, string> = {
  "jagatpura":             "Jagatpura",
  "gopalpura":             "Gopalpura",
  "sitapura":              "Sitapura",
  "sanganer":              "Sanganer",
  "200-feet-bypass":       "200 Feet Bypass",
  "chandpole":             "Chandpole",
  "jaipur-malviya-nagar":  "Malviya Nagar",
  "jaipur-vaishali-nagar": "Vaishali Nagar",
};

// DMCA alternate slugs — same city content, new URL, display as original city name
const CITY_DISPLAY_OVERRIDES: Record<string, string> = {
  "jaipur-2":    "Jaipur",
  "surat-2":     "Surat",
  "jodhpur-2":   "Jodhpur",
  "ghaziabad-2": "Ghaziabad",
  "varanasi-2":  "Varanasi",
};

const allLocationSlugs = Object.values(locations).flat().map(c => getCitySlug(c));

const validSlugs = new Set([
  ...getAllCities().map(city => getCallGirlsSlug(city)),
  ...getAllCities().map(city => getCitySlug(city)),
  ...Object.keys(CITY_DISPLAY_OVERRIDES),
  ...Object.keys(JAIPUR_SUB_SLUGS),
  ...EXTENDED_CITIES.map(city => getCitySlug(city)),
  ...allLocationSlugs,
]);

/**
 * For Jaipur sub-areas returns "Sitapura Jaipur" (area first, then Jaipur).
 * For DMCA alternate slugs returns the original city name (e.g. jaipur-2 → "Jaipur").
 * For regular cities returns normal title-cased name.
 */
function getDisplayCityName(city: string): string {
  if (CITY_DISPLAY_OVERRIDES[city]) return CITY_DISPLAY_OVERRIDES[city];
  if (JAIPUR_SUB_SLUGS[city]) return `${JAIPUR_SUB_SLUGS[city]} Jaipur`;
  return city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ city: string }>, searchParams: Promise<{ page?: string }> }): Promise<Metadata> {
  const { city } = await params;
  const { page } = (await searchParams) || {};
  const currentPage = parseInt(page || "1");
  const isPage2 = currentPage > 1;

  if (!validSlugs.has(city.toLowerCase())) {
    notFound();
  }
  const cityName = getDisplayCityName(city);           // e.g. "Sitapura Jaipur"
  const areaName = JAIPUR_SUB_SLUGS[city] ?? cityName; // e.g. "Sitapura"
  const isJaipurSub = !!JAIPUR_SUB_SLUGS[city];
  const isExt = isExtendedCity(city);

  const state = getStateFromCity(city) || "India";
  const seoDataKey = CITY_DISPLAY_OVERRIDES[city] ? city.replace(/-\d+$/, "") : city;
  const seoData = getMergedSeoData(cityName, state, seoDataKey);

  // Self-referencing canonical URL (e.g. jaipur-2 -> https://callgirl4u.com/call-girls/jaipur-2)
  const canonicalSlug = city;

  let title = "";
  let description = "";
  let keywords = "";

  // Extended cities — natural meta wording
  if (isExt) {
    keywords = `Call Girls in ${cityName}, Independent Companions ${cityName}, Escort Service ${cityName}, Cash on Delivery`;
    title = `Call Girls in ${cityName} | Direct Number | CallGirl4U`;
    description = `Find verified call girls in ${cityName} with direct number. Genuine female companions available 24/7 in ${cityName}, ${state}. Cash on delivery.`;
  } else {
    // For DMCA alternate slugs (e.g. jaipur-2), use original city slug as SEO seed
    const seoSeed = CITY_DISPLAY_OVERRIDES[city]
      ? city.replace(/-\d+$/, "")  // strip trailing -2, -3 etc → "jaipur"
      : (isJaipurSub ? (city.startsWith("jaipur-") ? city : `jaipur-${city}`) : city);
    const customSeo = getCitySeo(seoSeed);
    // rawName must match what's inside the template so replace works correctly
    const rawName = CITY_DISPLAY_OVERRIDES[city]
      ? CITY_DISPLAY_OVERRIDES[city]  // e.g. "Jaipur"
      : city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    title = customSeo.title.replace(rawName, cityName);
    description = customSeo.description.replace(rawName, cityName);
    const extraKeywords = isJaipurSub
      ? `Call Girls in ${areaName} Jaipur, Escort Service ${areaName} Jaipur, `
      : "";
    keywords = extraKeywords + seoData.metaKeywords;
  }

  if (isPage2) {
    title = `${title} - Page ${currentPage}`;
    description = `${description} (Page ${currentPage})`;
  }

  return {
    title,
    description,
    keywords,
    robots: isPage2 
      ? { index: false, follow: true } 
      : {
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
      canonical: `https://callgirl4u.com/call-girls/${canonicalSlug}`,
    }
  };
}



function getMergedSeoData(cityName: string, state: string, citySlug: string): CitySEOContent {
  const defaultSeo = getDefaultSeoData(cityName, state);
  const customData = cityContentData[citySlug];

  if (!customData) return defaultSeo;

  return {
    ...defaultSeo,
    metaTitle: customData.metaTitle || defaultSeo.metaTitle,
    metaDescription: customData.metaDescription || defaultSeo.metaDescription,
    metaKeywords: customData.metaKeywords || defaultSeo.metaKeywords,
    h1: customData.h1 || defaultSeo.h1,
    heroSubtext: customData.heroSubtext || defaultSeo.heroSubtext,
    introHeading: customData.introHeading || defaultSeo.introHeading,
    introText: customData.introText || defaultSeo.introText,
  };
}

export default async function CityPage({ params, searchParams }: { params: Promise<{ city: string }>, searchParams: Promise<{ page?: string }> }) {
  const { city } = await params;
  if (!validSlugs.has(city.toLowerCase())) {
    notFound();
  }
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const adsPerPage = 12;
  
  const cityName = getDisplayCityName(city);
  const state = getStateFromCity(city) || "India";

  
  const seoDataKey = CITY_DISPLAY_OVERRIDES[city]
    ? city.replace(/-\d+$/, "") // e.g. jaipur-2 -> jaipur
    : city;
  const seoData = getMergedSeoData(cityName, state, seoDataKey);
  const isExt = isExtendedCity(city);

  // Sub-areas for this city (e.g. Jaipur Locations, Mumbai Locations, Delhi Locations)
  const cityLocationsKey = `${cityName} Locations`;
  const citySubAreas: string[] = locations[cityLocationsKey] || [];
  
  const totalAdsToShow = 48; 

  // Fetch global phone from KV
  const globalPhone = await cachedGetValue("contact_phone");

  // Jaipur dedicated phone — covers Jaipur main city + all sub-areas
  const JAIPUR_CITIES = new Set([
    "jaipur", "jagatpura", "gopalpura", "sitapura",
    "sanganer", "200-feet-bypass", "chandpole",
    "jaipur-malviya-nagar", "jaipur-vaishali-nagar",
    "jaipur-2",
  ]);
  const jaipurPhone = await cachedGetValue("jaipur_phone");
  // Use jaipurPhone if set and this city is Jaipur or a Jaipur sub-area
  const effectivePhone = (JAIPUR_CITIES.has(city) && jaipurPhone) ? jaipurPhone : (globalPhone || undefined);

  // Fetch approved ads from KV
  let approvedAds: any[] = [];
  try {
    const approvedAdIds = await lRange(`ads:approved:call-girls:${city}`, 0, -1);
    const expiredIds: string[] = [];
    
    for (const adId of approvedAdIds) {
      const ad = await getJson(`ad:${adId}`);
      if (ad && ad.status === "approved") {
        approvedAds.push(ad);
      } else {
        expiredIds.push(adId);
      }
    }
    
    // Asynchronously clean up expired in background
    if (expiredIds.length > 0) {
      for (const adId of expiredIds) {
        await kvCommand(["LREM", `ads:approved:call-girls:${city}`, 0, adId]);
      }
    }
  } catch (err) {
    console.error("Failed to load approved ads:", err);
  }

  // Use city as seed for the image pool
  const cityImages = getDeterministicImagesPool(city, totalAdsToShow);

  // Map approved ads to Card format
  const approvedCards = approvedAds.map((ad) => {
    const imgPath = getDeterministicImagesPool(ad.id, 12)[0];
    return {
      id: ad.id,
      title: ad.title,
      price: ad.price,
      imagePath: imgPath,
      location: cityName,
      phone: ad.phone,
      isReal: true
    };
  });

  // Map deterministic ads to Card format
  const deterministicCards = cityImages.map((imgPath, index) => {
    const overallIndex = index;
    const adId = `${city}-${overallIndex}`;
    const adName = getNameFromId(adId);
    const adTitle = `${adName} - VIP Companion`;
    const price = getPriceFromId(adId);
    return {
      id: adId,
      title: adTitle,
      price: price,
      imagePath: imgPath,
      location: cityName,
      phone: effectivePhone,
      isReal: false
    };
  });

  // Merge approved ads at the beginning
  const allCards = [...approvedCards, ...deterministicCards];
  const paginatedCards = allCards.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage);
  
  const totalPages = Math.max(1, Math.ceil(allCards.length / adsPerPage));


  // Helper: strip HTML tags for schema plain text
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();

  // Dynamic Schema for SEO (Clean CollectionPage & Service schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoData.h1,
    "description": seoData.metaDescription,
    "url": `https://callgirl4u.com/call-girls/${seoDataKey}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": paginatedCards.length,
      "itemListElement": paginatedCards.map((card, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "name": card.title,
          "image": `https://callgirl4u.com${card.imagePath}`,
          "provider": {
            "@type": "Organization",
            "name": "CallGirl4U"
          },
          "areaServed": {
            "@type": "AdministrativeArea",
            "name": cityName
          }
        }
      }))
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
          {isExt ? (
            <>
              <h1 className="text-3xl text-gray-900 mb-4">Call Girls Available in {cityName}</h1>
              <p className="text-gray-600 text-lg">
                Find <strong>verified call girls in {cityName}</strong>, {state} with direct number.
                Genuine female companions available 24/7. <strong>Cash on delivery</strong> — no advance payment required.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl text-gray-900 mb-4">{seoData.h1}</h1>
              <p className="text-gray-600 text-lg" dangerouslySetInnerHTML={{ __html: seoData.heroSubtext }} />
            </>
          )}
        </div>
      </section>

      {/* Sub-areas sidebar layout — shown only when city has sub-areas (e.g. Jaipur) */}
      {citySubAreas.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                <h3 className="font-bold text-base mb-3 text-gray-900 border-b pb-2">Areas in {cityName}</h3>
                <div className="flex flex-col gap-1">
                  {citySubAreas.map((area) => (
                    <Link prefetch={false} key={area}
                      href={`/call-girls/${getCitySlug(area)}`}
                      className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium">
                      {area} Escorts
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
            {/* Mobile: horizontal scroll for areas */}
            <div className="lg:hidden w-full mb-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-sm mb-2 text-gray-900">Areas in {cityName}</h3>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {citySubAreas.map((area) => (
                    <Link prefetch={false} key={area}
                      href={`/call-girls/${getCitySlug(area)}`}
                      className="whitespace-nowrap text-xs bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-600 hover:text-white transition font-medium">
                      {area}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-gray-900">Featured Profiles in {cityName}</h2>
          <span className="text-gray-500 text-sm">{totalAdsToShow} Ads Available (Page {currentPage}/{totalPages})</span>
        </div>
        
        {paginatedCards.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {paginatedCards.map((card, index) => {
                 return (
                   <AdCard 
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    location={card.location}
                    price={card.price}
                    imagePath={card.imagePath}
                    index={index}
                    phone={card.phone}
                  />
                 );
              })}
            </div>

            {/* Pagination Button */}
            <div className="mt-12 flex justify-center">
              {currentPage < totalPages ? (
                <Link prefetch={false} href={`/call-girls/${city}?page=${currentPage + 1}`}
                  className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg flex items-center gap-2">
                  Show More Profiles (Page {currentPage + 1}) →
                </Link>
              ) : (
                <Link prefetch={false} href={`/call-girls/${city}?page=1`}
                  className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition shadow-lg">
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
        <div className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.introText }} />

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
        <div className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.typesText }} />

        <h2 className="text-2xl mb-4">{seoData.bookingHeading}</h2>
        <div className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.bookingText }} />

        <h2 className="text-2xl mb-4">{seoData.areasHeading}</h2>
        <div className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.areasText }} />

        <h2 className="text-2xl mb-4">{seoData.rateHeading}</h2>
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: seoData.rateIntro }} />
        <div className="overflow-x-auto mb-8 rounded-lg shadow-sm border border-gray-200">
          <table className="w-full text-left bg-white font-sans text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-700">Companion Category</th>
                <th className="p-4 font-semibold text-gray-700">1 Hour Session</th>
                <th className="p-4 font-semibold text-gray-700">2–3 Hours Session</th>
                <th className="p-4 font-semibold text-gray-700">Full Evening / Dinner</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-4 font-medium text-gray-800">College Companions &amp; Local Profiles</td>
                <td className="p-4">₹2,100</td>
                <td className="p-4">₹3,500</td>
                <td className="p-4">₹6,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4 font-medium text-gray-800">Independent Companions in {cityName}</td>
                <td className="p-4">₹3,000</td>
                <td className="p-4">₹5,000</td>
                <td className="p-4">₹10,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4 font-medium text-gray-800">VIP / High-Class Dating Escorts</td>
                <td className="p-4">₹8,000</td>
                <td className="p-4">₹12,000</td>
                <td className="p-4">₹20,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl mb-4">{seoData.privacyHeading}</h2>
        <div className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.privacyText }} />

        <h2 className="text-2xl mb-6">{seoData.faqHeading}</h2>
        <div className="space-y-4 mb-10">
          {seoData.faqs.map((faq, i) => (
            <div key={i} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-2" dangerouslySetInnerHTML={{ __html: faq.q }} />
              <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: faq.a }} />
            </div>
          ))}
        </div>
      </article>

      <section className="max-w-4xl mx-auto px-4 pb-12">
        {/* Nearby Cities / Localities in State */}
        {state && locations[state] && locations[state].length > 1 && (
          <div className="max-w-4xl mx-auto px-4 mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider text-center">
              Other Cities & Locations in {state}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-center">
              {locations[state]
                .filter(c => getCitySlug(c) !== city)
                .slice(0, 16)
                .map(c => (
                  <Link prefetch={false} key={c}
                    href={`/call-girls/${getCallGirlsSlug(c)}`}
                    className="text-xs font-semibold text-blue-600 hover:text-red-600 hover:underline py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors capitalize">
                    {c.toLowerCase()} Escorts
                  </Link>
                ))}
            </div>
          </div>
        )}


        {/* Cross-Service Interlinking Section */}
        <div className="max-w-4xl mx-auto px-4 mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wider text-center">
            Other Adult Services Available in {cityName}
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link prefetch={false} href={`/call-boys/${city}`}
              className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm">
              👨 Call Boys in {cityName}
            </Link>
            <Link prefetch={false} href={`/massage/${city}`}
              className="px-4 py-2 bg-purple-50 text-purple-600 text-sm font-bold rounded-xl border border-purple-100 hover:bg-purple-600 hover:text-white transition-all shadow-sm">
              💆 Massage Service in {cityName}
            </Link>
            <Link prefetch={false} href={`/call-girls`}
              className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-800 hover:text-white transition-all shadow-sm">
              📍 All India Call Girls Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
