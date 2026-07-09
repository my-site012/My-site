import { locations, getAllStates, getStateSlug, getCitySlug } from "@/lib/data/locations";
import AdCard from "@/components/AdCard";
import type { Metadata } from "next";
import Link from "next/link";
import { getDeterministicBoyImagesPool, getPriceFromId, getBoyNameFromId } from "@/lib/ad-logic";
import { cachedGetValue } from "@/lib/kv";

// ISR: revalidate every hour — content is deterministic, no need to re-render on every request
export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllStates().map(state => ({
    state: getStateSlug(state)
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const allStates = getAllStates();
  const stateName = allStates.find(s => getStateSlug(s) === state) || state.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return {
    title: `Call Boys in ${stateName} | Verified Male Companions | CallGirl4U`,
    description: `Discover handsome, charming call boys across all major cities in ${stateName}. Browse verified male companion profiles — discreet, professional, and available 24/7. No advance payment required.`,
    keywords: `call boy in ${stateName}, male companion ${stateName}, gigolo service ${stateName}, male escort ${stateName}, playboy ${stateName}`,
    alternates: {
      canonical: `https://callgirl4u.com/call-boys/state/${state}`,
    }
  };
}

export default async function CallBoyStatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;

  const allStates = getAllStates();
  const stateName = allStates.find(s => getStateSlug(s) === state) || state.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const cities = locations[stateName] || [];
  const profileImages = getDeterministicBoyImagesPool(state + "-boy", 12);

  const boyPhone = await cachedGetValue("call_boy_phone");
  const fallbackPhone = await cachedGetValue("contact_phone");
  const globalPhone = boyPhone || fallbackPhone;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Call Boys in ${stateName}`,
    "description": `Browse verified call boys in ${stateName}.`,
    "url": `https://callgirl4u.com/call-boys/state/${state}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": profileImages.length,
      "itemListElement": profileImages.map((imgPath, index) => {
        const adId = `boy-${state}-${index}`;
        const adName = getBoyNameFromId(adId);
        const price = getPriceFromId(adId);
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "LocalBusiness",
            "name": `${adName} - ${stateName} Elite`,
            "image": `https://callgirl4u.com${imgPath}`,
            "priceRange": `INR ${price}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cities[index % cities.length] || stateName,
              "addressRegion": stateName,
              "addressCountry": "IN"
            }
          }
        };
      })
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 uppercase">
            Call Boys in <span className="text-red-600">{stateName}</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Discover charming, handsome, and discreet male companions across every major city in {stateName}. All profiles are individually verified — real photos, real people. <strong>No advance payment</strong> required.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar: Cities */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-xl mb-4 text-gray-900 border-b pb-2">Cities in {stateName}</h3>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2">
              {cities.map((city) => (
                <Link
                  key={city}
                  href={`/call-boys/${getCitySlug(city)}`}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium"
                >
                  {city} Call Boys
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Rated Call Boys in {stateName}</h2>

          {profileImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {profileImages.map((imgPath, index) => {
                const adId = `boy-${state}-${index}`;
                const adName = getBoyNameFromId(adId);
                const adTitle = `${adName} - ${stateName} Elite`;
                const price = getPriceFromId(adId);

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

          {/* SEO Article */}
          <article className="mt-16 prose prose-lg prose-red max-w-none text-gray-800 border-t pt-8">
            <h2 className="text-2xl mb-4">Find Your Perfect Male Companion in {stateName}</h2>
            <p className="mb-6 leading-relaxed">
              Welcome to India's most trusted male companion directory. Whether you are a <strong>woman looking for a charming partner</strong>, or an individual seeking a fun and memorable experience, our verified <strong>call boy profiles across {stateName}</strong> are here for you. Every profile is real, handsome, and thoroughly screened before being listed.
            </p>
            <p className="mb-8 leading-relaxed">
              Our <strong>call boys in {stateName}</strong> are well-groomed, educated, and trained to provide a comfortable, respectful, and enjoyable companionship experience — across Dinner dates, travel, social events, and more.
            </p>

            {/* Services Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 my-8 not-prose">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What Our Call Boys in {stateName} Offer</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
                <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Dinner & social event companionship</li>
                <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Travel & tour partner across {stateName}</li>
                <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Romantic dates & private outings</li>
                <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Overnight companionship</li>
                <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Confidential & discreet meetings</li>
                <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Available 24/7 across {stateName}</li>
              </ul>
            </div>

            {/* Safe Advisory */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8 not-prose">
              <h3 className="text-lg font-bold text-amber-800 mb-2 mt-0 flex items-center gap-2">
                ⚠️ Safety Guidelines for Clients in {stateName}
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                Your safety is our priority. Please follow these guidelines when booking a male companion in {stateName}:
              </p>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1.5">
                <li><strong>Never Pay in Advance:</strong> Legitimate companions never ask for UPI, bank transfers, or any prepayment. Pay cash only after meeting in person.</li>
                <li><strong>Verify the Profile Photo:</strong> Always confirm the companion matches their directory photo before proceeding.</li>
                <li><strong>Meet at Safe Locations:</strong> Prefer reputable hotels, cafes, or your own residence for first meetings.</li>
                <li><strong>Trust Your Instincts:</strong> If something feels off, do not continue. Report any suspicious profile using the Report button.</li>
              </ul>
            </div>

            <h2 className="text-2xl mb-4">Why CallGirl4U is the Best Platform for Call Boys in {stateName}</h2>
            <p className="mb-4 leading-relaxed">
              Unlike other platforms, CallGirl4U <strong>manually verifies every call boy profile in {stateName}</strong>. We do not allow fake photos or misleading information. Our platform is designed with complete privacy and discretion — your personal data is never shared with any third party.
            </p>
            <p className="mb-8 leading-relaxed">
              We serve clients across all age groups and preferences. Whether you are looking for a young, energetic college boy, or a mature, sophisticated gentleman — you will find your ideal companion right here.
            </p>

            {/* Rates Table */}
            <h2 className="text-2xl mb-4">Call Boy Service Charges in {stateName}</h2>
            <p className="mb-4 text-gray-600">Rates are approximate and may vary by city and profile type. Payment is cash only — no advance required.</p>
            <div className="overflow-x-auto mb-8 rounded-lg shadow-sm border border-gray-200">
              <table className="w-full text-left bg-white font-sans text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-700">Profile Type</th>
                    <th className="p-4 font-semibold text-gray-700">1 Hour</th>
                    <th className="p-4 font-semibold text-gray-700">2-3 Hours</th>
                    <th className="p-4 font-semibold text-gray-700">Full Night</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-4">College Boy / Young Fresher</td>
                    <td className="p-4">₹2,000</td>
                    <td className="p-4">₹3,500</td>
                    <td className="p-4">₹6,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4">Independent Companion in {stateName}</td>
                    <td className="p-4">₹3,500</td>
                    <td className="p-4">₹6,000</td>
                    <td className="p-4">₹12,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4">VIP / Premium Male Companion</td>
                    <td className="p-4">₹7,000</td>
                    <td className="p-4">₹12,000</td>
                    <td className="p-4">₹20,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* FAQs */}
            <h2 className="text-2xl mb-6">Frequently Asked Questions — Call Boys in {stateName}</h2>
            <div className="space-y-4 mb-10">
              {[
                { q: `How do I book a call boy in ${stateName}?`, a: `Browse profiles on our directory, choose a city in ${stateName}, select the companion you like, and contact them directly via Call or WhatsApp. No registration or advance payment needed.` },
                { q: `Are call boy profiles in ${stateName} genuine?`, a: `Yes. Every profile is manually reviewed and verified. Photos are confirmed to be real. We regularly audit all listings across ${stateName} for authenticity.` },
                { q: `Is the service available 24/7 across ${stateName}?`, a: `Most companions listed across ${stateName} are available around the clock, including weekends and public holidays. Availability varies by individual.` },
                { q: `What are the call boy rates in ${stateName}?`, a: `Rates differ by city and profile type. College boys start from ₹2,000/hour. VIP companions may charge ₹7,000 or more. Always confirm the rate directly with the companion before meeting.` },
              ].map((faq, i) => (
                <div key={i} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Tags */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {([
                `Call Boys in ${stateName}`,
                `${stateName} Call Boys`,
                `Male Escorts ${stateName}`,
                `Call Boy Service ${stateName}`,
                `Companions in ${stateName}`,
                `VIP Call Boys ${stateName}`,
                `Verified Male Profiles ${stateName}`,
                `Independent Call Boy ${stateName}`,
                `Adult Classifieds ${stateName}`,
                `Call Boy Number ${stateName}`,
              ] as string[]).map((tag, i) => {
                const colors = [
                  'bg-red-600','bg-orange-500','bg-blue-700','bg-green-700',
                  'bg-gray-800','bg-red-700','bg-orange-600','bg-blue-600',
                  'bg-green-600','bg-rose-600',
                ];
                return (
                  <Link
                    key={i}
                    href={`/call-boys/state/${state}`}
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
                  `Call Boy In ${stateName}`,
                  `Call Boy Near Me`,
                  `Call Boy Number In ${stateName}`,
                  `Male Escort Service In ${stateName}`,
                  `Call Boys In ${stateName}`,
                  `${stateName} Call Boys`,
                  `${stateName} Male Escort Service`,
                  `Call Boy Contact Number ${stateName}`,
                  `Call Boy Price ${stateName}`,
                  `Call Boys Near Me`,
                  `${stateName} Male Escort`,
                  `Low Price Call Boy in ${stateName}`,
                  `Call Boys ${stateName}`,
                  `Call Boys Number ${stateName}`,
                  `Male Escort In ${stateName}`,
                  `Call Boy Pics ${stateName}`,
                  `Call Boys Rate ${stateName}`,
                  `Call Boy Service ${stateName}`,
                  `Best Call Boy Service ${stateName}`,
                  `Low Price Call Boys ${stateName}`,
                  `${stateName} Call Boy Service`,
                  `Cheap Call Boy Near Me`,
                  `Call Boys Price ${stateName}`,
                  `${stateName} Call Boy Number`,
                  `Call Boy Photo ${stateName}`,
                  `Night Call Boy ${stateName}`,
                  `Nearest Call Boy ${stateName}`,
                  `Call Boy Ka Number ${stateName}`,
                  `Low Cost Call Boys ${stateName}`,
                  `Call Boy Services ${stateName}`,
                  `Cheapest Call Boy ${stateName}`,
                ] as string[]).map((tag, idx, arr) => (
                  <span key={idx}>
                    <Link
                      href={`/call-boys/state/${state}`}
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
          </section>
        </main>
      </div>
    </div>
  );
}
