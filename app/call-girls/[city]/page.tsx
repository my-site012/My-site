import { getAllCities, getCitySlug, getStateFromCity, locations, getCallGirlsSlug, EXTENDED_CITIES, isExtendedCity } from "@/lib/data/locations";
import { cityContentData, CitySEOContent } from "@/lib/data/cityContent";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import type { Metadata } from "next";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId, getContactNumber, getHash } from "@/lib/ad-logic";
import { cachedGetValue, getJson, lRange, kvCommand } from "@/lib/kv";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data/blogPosts";

// ISR: revalidate every hour — content is deterministic, no need to re-render on every request
export const revalidate = 3600;
export const dynamicParams = false;

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

const validSlugs = new Set([
  ...getAllCities().map(city => getCallGirlsSlug(city)),
  ...Object.keys(CITY_DISPLAY_OVERRIDES),
  ...EXTENDED_CITIES.map(city => getCitySlug(city)),
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

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  if (!validSlugs.has(city)) return {};
  const cityName = getDisplayCityName(city);           // e.g. "Sitapura Jaipur"
  const areaName = JAIPUR_SUB_SLUGS[city] ?? cityName; // e.g. "Sitapura"
  const isJaipurSub = !!JAIPUR_SUB_SLUGS[city];
  const isExt = isExtendedCity(city);

  const state = getStateFromCity(city) || "India";
  const seoData = cityContentData[city] || getDefaultSeoData(cityName, state);

  // Extended cities — different meta wording to avoid duplicate content
  if (isExt) {
    const extKeywords = `Call Girls in ${cityName}, ${cityName} Call Girl Number, Escort Service ${cityName}, ${cityName} Escort, Call Girl ${cityName} WhatsApp, Female Escort ${cityName}`;
    return {
      title: `Call Girls in ${cityName} | Contact Directly | CallGirl4U`,
      description: `Find verified call girls in ${cityName} with direct WhatsApp contact. Genuine female companions available 24/7 in ${cityName}, ${state}. Cash on delivery. No advance payment.`,
      keywords: extKeywords,
      alternates: { canonical: `https://callgirl4u.com/call-girls/${city}` },
    };
  }

  // For DMCA alternate slugs (e.g. jaipur-2), use original city slug as SEO seed
  const seoSeed = CITY_DISPLAY_OVERRIDES[city]
    ? city.replace(/-\d+$/, "")  // strip trailing -2, -3 etc → "jaipur"
    : (isJaipurSub ? (city.startsWith("jaipur-") ? city : `jaipur-${city}`) : city);
  const customSeo = getCitySeo(seoSeed);
  // rawName must match what's inside the template so replace works correctly
  const rawName = CITY_DISPLAY_OVERRIDES[city]
    ? CITY_DISPLAY_OVERRIDES[city]  // e.g. "Jaipur"
    : city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const title       = customSeo.title.replace(rawName, cityName);
  const description = customSeo.description.replace(rawName, cityName);

  // Extra Jaipur-specific keywords for sub-areas
  const extraKeywords = isJaipurSub
    ? `Call girl ${areaName} Jaipur, Jaipur Call girl ${areaName}, Jaipur ${areaName} Escort service, ` +
      `Escort service ${areaName} Jaipur, ${areaName} Jaipur Call Girl Number, ` +
      `Call Girls in ${areaName} Jaipur, Jaipur ${areaName} Call Girls, ` +
      `${areaName} Jaipur Escorts, Jaipur ${areaName} Call Girl, `
    : "";

  return {
    title,
    description,
    keywords: extraKeywords + seoData.metaKeywords,
    alternates: {
      canonical: `https://callgirl4u.com/call-girls/${city}`,
    }
  };
}



export default async function CityPage({ params, searchParams }: { params: Promise<{ city: string }>, searchParams: Promise<{ page?: string }> }) {
  const { city } = await params;
  if (!validSlugs.has(city)) {
    notFound();
  }
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const adsPerPage = 12;
  
  const cityName = getDisplayCityName(city);
  const state = getStateFromCity(city) || "India";

  // Find related blog posts for this city or category
  const relatedBlogs = blogPosts
    .filter(post => post.category === "call-girls" && (post.citySlug === city || getCitySlug(post.cityName) === city))
    .slice(0, 3);
  
  const fallbackBlogs = relatedBlogs.length > 0 
    ? relatedBlogs 
    : blogPosts.filter(post => post.category === "call-girls").slice(0, 3);
  
  const seoDataKey = CITY_DISPLAY_OVERRIDES[city]
    ? city.replace(/-\d+$/, "") // e.g. jaipur-2 -> jaipur
    : city;
  const seoData = cityContentData[seoDataKey] || getDefaultSeoData(cityName, state);
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

  // Dynamic Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoData.h1,
    "description": seoData.metaDescription,
    "url": `https://callgirl4u.com/call-girls/${city}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": paginatedCards.length,
      "itemListElement": paginatedCards.map((card, index) => {
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "LocalBusiness",
            "name": card.title,
            "image": `https://callgirl4u.com${card.imagePath}`,
            "telephone": card.phone || "N/A",
            "priceRange": `INR ${card.price}`,
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
          {isExt ? (
            <>
              <h1 className="text-3xl text-gray-900 mb-4">Call Girls Available in {cityName}</h1>
              <p className="text-gray-600 text-lg">
                Find <strong>verified call girls in {cityName}</strong>, {state} with direct WhatsApp contact.
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
                      {area} Call Girls
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
              <Link prefetch={false} key={i}
                href={`/call-girls/${city}`}
                title={tag}
                className={`${colors[i % colors.length]} text-white text-xs font-medium px-3 py-1 rounded flex items-center gap-1 hover:opacity-80 transition-opacity`}>
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
                <Link prefetch={false} href={`/call-girls/${city}`}
                  title={tag}
                  className="hover:underline hover:text-black/80 transition-colors">
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

        {/* Recent Blogs & Guides */}
        {fallbackBlogs.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider text-center">
              Latest Call Girl Guides & Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fallbackBlogs.map(post => (
                <div key={post.slug} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  <div className="p-5 flex flex-col h-full">
                    <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider mb-2 block">{post.readTime || "5 min read"}</span>
                    <h4 className="font-bold text-gray-900 text-sm mb-2 hover:text-red-600 line-clamp-2">
                      <Link prefetch={false} href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="text-gray-500 text-xs line-clamp-3 mb-4 leading-relaxed">{post.excerpt}</p>
                    <Link prefetch={false} href={`/blog/${post.slug}`} className="text-red-600 text-xs font-bold uppercase mt-auto hover:text-red-700">
                      Read Article →
                    </Link>
                  </div>
                </div>
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
