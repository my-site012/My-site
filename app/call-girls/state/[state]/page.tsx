import { locations, getAllStates, getStateSlug, getCitySlug, getCallGirlsSlug } from "@/lib/data/locations";
import AdCard from "@/components/AdCard";
import type { Metadata } from "next";
import Link from "next/link";
import { getCitySeo, getDefaultSeoData } from "@/lib/seo-templates";
import { getDeterministicImagesPool, getContactNumber, getHash } from "@/lib/ad-logic";
import { cachedGetValue } from "@/lib/kv";
import { notFound } from "next/navigation";

// ISR: revalidate every hour — content is deterministic, no need to re-render on every request
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllStates().map(state => ({
    state: getStateSlug(state)
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const allStates = getAllStates();
  const matchedState = allStates.find(s => getStateSlug(s) === state);
  if (!matchedState) notFound();
  const stateName = matchedState;
  
  const seoData = getDefaultSeoData(stateName, "India");
  const customSeo = getCitySeo(state);

  return {
    title: customSeo.title || `Call Girls in ${stateName} State | Verified Companion Services`,
    description: customSeo.description || `Find verified independent call girls across ${stateName}. Browse local female escort profiles with direct WhatsApp booking and cash on delivery.`,
    keywords: seoData.metaKeywords,
    alternates: {
      canonical: `https://callgirl4u.com/call-girls/state/${state}`,
    }
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  
  // Find original state name from slug
  const allStates = getAllStates();
  const matchedState = allStates.find(s => getStateSlug(s) === state);
  if (!matchedState) notFound();
  const stateName = matchedState;
  
  const cities = locations[stateName] || [];
  const profileImages = getDeterministicImagesPool(state, 12);
  const defaultNames = ["Priya", "Neha", "Kajal", "Simran", "Riya", "Pooja", "Deepika", "Nisha", "Aarti", "Meera"];

  // Fetch global phone from KV
  const globalPhone = await cachedGetValue("contact_phone");

  // Get rich SEO content
  const seoData = getDefaultSeoData(stateName, "India");

  // Dynamic Schema for SEO (Clean CollectionPage & Service schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoData.h1,
    "description": seoData.metaDescription,
    "url": `https://callgirl4u.com/call-girls/state/${state}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": profileImages.length,
      "itemListElement": profileImages.map((imgPath, index) => {
        const adName = defaultNames[index % defaultNames.length];
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Service",
            "name": `${adName} - ${stateName} Elite Companion`,
            "image": `https://callgirl4u.com${imgPath}`,
            "provider": {
              "@type": "Organization",
              "name": "CallGirl4U"
            },
            "areaServed": {
              "@type": "AdministrativeArea",
              "name": stateName
            }
          }
        };
      })
    }
  };

  // Helper: strip HTML tags for schema plain text
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim();

  // FAQ Schema for Google Rich Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": seoData.faqs.map((faq: { q: string; a: string }) => ({
      "@type": "Question",
      "name": stripHtml(faq.q),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": stripHtml(faq.a)
      }
    }))
  };

  return (
    <div className="bg-gray-50 min-h-screen">
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

      {/* Hero */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase">
            {seoData.h1}
          </h1>
          <p className="text-gray-600 text-lg" dangerouslySetInnerHTML={{ __html: seoData.heroSubtext }} />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Cities in this State */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-xl mb-4 text-gray-900 border-b pb-2">Cities in {stateName}</h3>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {cities.map((city) => (
                <Link prefetch={false} key={city} 
                  href={`/call-girls/${getCallGirlsSlug(city)}`}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium">
                  {city} Escorts
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content: Featured Profiles in State & SEO Article */}
        <main className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Rated Profiles in {stateName}</h2>
          
          {profileImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {profileImages.map((imgPath, index) => {
                const adId = `${state}-${index}`;
                const adName = defaultNames[index % defaultNames.length];
                const adTitle = `${adName} - ${stateName} Elite`;
                const price = (Math.floor(Math.random() * 10) + 5) * 1000;

                return (
                  <AdCard 
                    key={index}
                    id={adId}
                    title={adTitle}
                    location={cities[index % cities.length] || stateName}
                    price={price}
                    imagePath={imgPath}
                    index={index}
                    phone={globalPhone || undefined}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
              <p className="text-gray-500 text-lg italic">Coming soon... No profiles found in {stateName} yet.</p>
            </div>
          )}

          {/* State SEO Text Block matching City Page Layout */}
          <article className="mt-16 prose prose-lg prose-red max-w-none text-gray-800 border-t pt-8">
            <h2 className="text-2xl mb-4">{seoData.introHeading}</h2>
            <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.introText }} />

            {/* Safe Dating & Anti-Scam Advisory */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8 not-prose">
              <h3 className="text-lg font-bold text-amber-800 mb-2 mt-0 flex items-center gap-2">
                ⚠️ Safe Dating & Anti-Scam Advisory for {stateName}
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                To ensure a safe and positive experience when using our independent directory in <strong>{stateName}</strong>, please observe these safety practices:
              </p>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1.5">
                <li><strong>Never Pay Upfront:</strong> Under no circumstances should you transfer booking fees, medical card fees, or transport charges prior to meeting.</li>
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
                    <td className="p-4">Independent Call Girls in {stateName}</td>
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
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {([
                `Escorts in ${stateName}`,
                `${stateName} Escorts`,
                `Independent Escorts ${stateName}`,
                `Escort Directory ${stateName}`,
                `Companions in ${stateName}`,
                `VIP Escorts ${stateName}`,
                `Verified Profiles ${stateName}`,
                `Independent Companions ${stateName}`,
                `Adult Classifieds ${stateName}`,
                `Verified Directory ${stateName}`,
              ] as string[]).map((tag, i) => {
                const colors = [
                  'bg-red-600','bg-orange-500','bg-blue-700','bg-green-700',
                  'bg-gray-800','bg-red-700','bg-orange-600','bg-blue-600',
                  'bg-green-600','bg-rose-600','bg-indigo-700','bg-amber-600',
                ];
                return (
                  <Link prefetch={false} key={i}
                    href={`/call-girls/state/${state}`}
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
                  `Call Girl In ${stateName}`,
                  `Call Girl Near Me`,
                  `Call Girl Number In ${stateName}`,
                  `Escort Service In ${stateName}`,
                  `Call Girls In ${stateName}`,
                  `Escort Service ${stateName}`,
                  `${stateName} Escorts`,
                  `${stateName} Escort Service`,
                  `Call Girl Contact Number ${stateName}`,
                  `Call Girl Price ${stateName}`,
                  `Call Girls Near Me`,
                  `${stateName} Escort`,
                  `Escorts Service In ${stateName}`,
                  `Low Price Call Girl in ${stateName}`,
                  `Call Girls ${stateName}`,
                  `Call Girls Number ${stateName}`,
                  `Escort In ${stateName}`,
                  `Escorts In ${stateName}`,
                  `Call Girl Pics ${stateName}`,
                  `Escort Girl In ${stateName}`,
                  `Call Girls Contact Number ${stateName}`,
                  `Call Girls Rate ${stateName}`,
                  `Call Girl Service ${stateName}`,
                  `Call Girls Pics ${stateName}`,
                  `Best Escort Service ${stateName}`,
                  `Low Price Call Girls ${stateName}`,
                  `${stateName} Call Girl Service`,
                  `Cheap Call Girl Near Me`,
                  `Call Girls Price ${stateName}`,
                  `Call Girl In ${stateName}`,
                  `Escort Near Me`,
                  `${stateName} Call Girl Number`,
                  `Escort ${stateName}`,
                  `Photo Call Girls ${stateName}`,
                  `Call Girls Low Price ${stateName}`,
                  `Call Girls Service In ${stateName}`,
                  `Near me Call Girl`,
                  `Call Girls Photo ${stateName}`,
                  `Call Girl Phone Number ${stateName}`,
                  `Escort Services In ${stateName}`,
                  `Low Rate Call Girls ${stateName}`,
                  `Call Girl Low Rate ${stateName}`,
                  `Call Girl Escort Service ${stateName}`,
                  `Cheap Rate Call Girls ${stateName}`,
                  `Night Call Girl ${stateName}`,
                  `Nearest Call Girl ${stateName}`,
                  `Escorts Near Me`,
                  `Call Girl Ka Number ${stateName}`,
                  `Low Cost Call Girls ${stateName}`,
                  `Escort Call Girl ${stateName}`,
                  `Near By Call Girl ${stateName}`,
                  `Call Girl Services ${stateName}`,
                  `Call Girls Numbers ${stateName}`,
                  `Call Girl Agent Number ${stateName}`,
                  `Cheapest Call Girl ${stateName}`,
                ] as string[]).map((tag, idx, arr) => (
                  <span key={idx}>
                    <Link prefetch={false} href={`/call-girls/state/${state}`}
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
          </section>
        </main>
      </div>
    </div>
  );
}
