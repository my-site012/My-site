import { getAllCities, getCitySlug, getStateFromCity, locations } from "@/lib/data/locations";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import type { Metadata } from "next";
import { getDeterministicBoyImagesPool, getBoyNameFromId, getPriceFromId, getContactNumber, getHash } from "@/lib/ad-logic";
import { cachedGetValue, getJson, lRange, kvCommand } from "@/lib/kv";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data/blogPosts";

const validSlugs = new Set(getAllCities().map(city => getCitySlug(city)));

// ISR: revalidate every hour — content is deterministic, no need to re-render on every request
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllCities().map(city => ({
    city: getCitySlug(city)
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const state = getStateFromCity(city) || "India";

  return {
    title: `Call Boy in ${cityName} | Handsome Male Companions | CallGirl4U`,
    description: `Discover handsome, charming call boys in ${cityName}, ${state}. Browse verified male companion profiles — discreet, trustworthy, and available 24/7. No advance payment.`,
    keywords: `call boy in ${cityName}, male companion ${cityName}, gigolo service ${cityName}, male escort ${cityName}, playboy ${cityName}`,
    alternates: {
      canonical: `https://callgirl4u.com/call-boys/${city}`,
    }
  };
}

export default async function CallBoyCityPage({ params, searchParams }: { params: Promise<{ city: string }>, searchParams: Promise<{ page?: string }> }) {
  const { city } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const adsPerPage = 12;

  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const state = getStateFromCity(city) || "India";

  // Find related blog posts for this city or category
  const relatedBlogs = blogPosts
    .filter(post => post.category === "call-boys" && (post.citySlug === city || getCitySlug(post.cityName) === city))
    .slice(0, 3);
  
  const fallbackBlogs = relatedBlogs.length > 0 
    ? relatedBlogs 
    : blogPosts.filter(post => post.category === "call-boys").slice(0, 3);

  const totalAdsToShow = 48;

  const boyPhone = await cachedGetValue("call_boy_phone");
  const fallbackPhone = await cachedGetValue("contact_phone");
  const globalPhone = boyPhone || fallbackPhone;
  const effectivePhone = globalPhone || undefined;

  // Fetch approved ads from KV
  let approvedAds: any[] = [];
  try {
    const approvedAdIds = await lRange(`ads:approved:call-boys:${city}`, 0, -1);
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
        await kvCommand(["LREM", `ads:approved:call-boys:${city}`, 0, adId]);
      }
    }
  } catch (err) {
    console.error("Failed to load approved ads:", err);
  }

  const cityImages = getDeterministicBoyImagesPool(city + "-boy", totalAdsToShow);

  // Map approved ads to Card format
  const approvedCards = approvedAds.map((ad) => {
    const imgPath = getDeterministicBoyImagesPool(ad.id + "-boy", 12)[0];
    return {
      id: ad.id,
      title: ad.title,
      price: ad.price,
      imagePath: imgPath,
      location: cityName,
      phone: ad.phone,
      isBoy: true
    };
  });

  // Map deterministic ads to Card format
  const deterministicCards = cityImages.map((imgPath, index) => {
    const overallIndex = index;
    const adId = `boy-${city}-${overallIndex}`;
    const adName = getBoyNameFromId(adId);
    const adTitle = `${adName} - VIP Male Companion`;
    const price = getPriceFromId(adId);
    return {
      id: adId,
      title: adTitle,
      price: price,
      imagePath: imgPath,
      location: cityName,
      phone: effectivePhone,
      isBoy: true
    };
  });

  // Merge approved ads at the beginning
  const allCards = [...approvedCards, ...deterministicCards];
  const paginatedCards = allCards.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage);
  
  const totalPages = Math.max(1, Math.ceil(allCards.length / adsPerPage));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Call Boys in ${cityName}`,
    "description": `Browse verified call boys and male companions in ${cityName}.`,
    "url": `https://callgirl4u.com/call-boys/${city}`,
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

  // FAQ Schema for Google Rich Results (Call Boys)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Are the call boy profiles in ${cityName} verified?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes. All call boy profiles listed in ${cityName} on our directory are manually reviewed. We verify photos and contact numbers to ensure genuine listings. Always report suspicious profiles using the Report button.`
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to pay advance booking fee to hire a call boy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No advance payment is required. We follow a strict Cash on Delivery policy. Pay only in cash directly after meeting the companion in person. Never transfer money online."
        }
      },
      {
        "@type": "Question",
        "name": `What types of male companions are available in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Our ${cityName} directory features diverse male companions including young college boys, professional models, fit gym trainers, and high-profile escorts. All profiles list their interests and availability.`
        }
      },
      {
        "@type": "Question",
        "name": `Do call boys in ${cityName} offer outcall services?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, most male companions in ${cityName} offer outcall services to hotels and private residences. Confirm location and meeting details directly with the companion via WhatsApp before the meeting.`
        }
      }
    ]
  };

  return (
    <div className="bg-gray-50 pb-12">
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
      <section className="bg-white py-10 border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl text-gray-900 mb-4">
            Call Boys in <span className="text-red-600">{cityName}</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Discover charming, handsome, and discreet male companions in {cityName}, {state}. All profiles are individually verified — real photos, real people. <strong>No advance payment</strong> required.
          </p>
        </div>
      </section>

      {/* Profiles Grid */}
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
                    isBoy={true}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              {currentPage < totalPages ? (
                <Link prefetch={false} href={`/call-boys/${city}?page=${currentPage + 1}`}
                  className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg flex items-center gap-2">
                  Show More Profiles (Page {currentPage + 1}) →
                </Link>
              ) : (
                <Link prefetch={false} href={`/call-boys/${city}?page=1`}
                  className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition shadow-lg">
                  ← Back to First Page
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500">No profiles found for {cityName} yet.</p>
          </div>
        )}
      </section>

      {/* SEO Content */}
      <article className="max-w-4xl mx-auto px-4 py-12 prose prose-lg prose-red text-gray-800 border-t">
        <h2 className="text-2xl mb-4">Find a Genuine Call Boy in {cityName}</h2>
        <p className="mb-6 leading-relaxed">
          Welcome to India's most trusted male companion directory. Whether you are a <strong>woman seeking a charming partner</strong>, or an individual looking for a fun and memorable experience, our verified <strong>call boy profiles in {cityName}</strong> are here for you. Every profile is real, handsome, and thoroughly screened.
        </p>
        <p className="mb-8 leading-relaxed">
          Our <strong>call boys in {cityName}</strong> are well-groomed, educated, and trained in providing a comfortable, respectful, and enjoyable companionship experience. Whether you need a date for a social event, a travel partner, or simply someone to spend quality time with — we have the perfect companion for you.
        </p>

        {/* What We Offer */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 my-8 not-prose">
          <h3 className="text-lg font-bold text-gray-900 mb-4">What Our Call Boys in {cityName} Offer</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
            <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Dinner & social event companionship</li>
            <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Travel & tour partner</li>
            <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Romantic dates & outings</li>
            <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Overnight companionship</li>
            <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Confidential & discreet meetings</li>
            <li className="flex items-center gap-2"><span className="text-red-500 text-lg">✔</span> Available 24/7 in {cityName}</li>
          </ul>
        </div>

        {/* Safe Advisory */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8 not-prose">
          <h3 className="text-lg font-bold text-amber-800 mb-2 mt-0 flex items-center gap-2">
            ⚠️ Safety Guidelines for Clients in {cityName}
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            Your safety is our priority. Please follow these guidelines when booking a male companion in {cityName}:
          </p>
          <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1.5">
            <li><strong>Never Pay in Advance:</strong> Legitimate companions never ask for UPI, bank transfers, or any prepayment. Pay cash only after meeting in person.</li>
            <li><strong>Verify the Profile Photo:</strong> Always confirm the companion matches their directory photo before proceeding.</li>
            <li><strong>Meet at Safe Locations:</strong> Prefer reputable hotels, cafes, or your own residence for first meetings.</li>
            <li><strong>Trust Your Instincts:</strong> If something feels off, do not continue. Report any suspicious profile using the Report button.</li>
          </ul>
        </div>

        <h2 className="text-2xl mb-4">Why CallGirl4U is the Best Platform for Call Boys in {cityName}</h2>
        <p className="mb-4 leading-relaxed">
          Unlike other platforms, CallGirl4U manually verifies every <strong>call boy profile in {cityName}</strong>. We do not allow fake photos or misleading information. Our platform is designed with privacy and discretion in mind — your personal data is never shared with any third party.
        </p>
        <p className="mb-8 leading-relaxed">
          We serve clients across all age groups and preferences. Whether you are looking for a young, energetic college boy, or a mature, sophisticated gentleman, you will find your ideal companion right here on our platform.
        </p>

        {/* Rates Table */}
        <h2 className="text-2xl mb-4">Call Boy Service Charges in {cityName}</h2>
        <p className="mb-4 text-gray-600">All rates are approximate and may vary based on duration, services, and profile type. Payment is cash only — no advance required.</p>
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
                <td className="p-4">Independent Companion in {cityName}</td>
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
        <h2 className="text-2xl mb-6">Frequently Asked Questions — Call Boys in {cityName}</h2>
        <div className="space-y-4 mb-10">
          {[
            { q: `How do I book a call boy in ${cityName}?`, a: `Browse profiles on our directory, select the companion you like, and contact them directly via the Call or WhatsApp button. No registration or advance payment is needed.` },
            { q: `Are the call boy profiles in ${cityName} verified?`, a: `Yes. Every profile on our platform is manually reviewed. Photos are confirmed to be genuine and profiles are regularly audited for authenticity.` },
            { q: `Is the service available 24/7 in ${cityName}?`, a: `Most companions listed in ${cityName} are available around the clock, including weekends and holidays. Availability may vary by individual profile.` },
            { q: `What is the call boy service charge in ${cityName}?`, a: `Rates vary by companion type. College boys start from ₹2,000/hour, while VIP companions may charge ₹7,000 or more per hour. Always confirm the rate directly with the companion before meeting.` },
          ].map((faq, i) => (
            <div key={i} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </article>

      {/* Tags */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            `Call Boys in ${cityName}`,
            `${cityName} Call Boys`,
            `Male Escorts ${cityName}`,
            `Call Boy Service ${cityName}`,
            `Companions in ${cityName}`,
            `VIP Call Boys ${cityName}`,
            `Verified Male Profiles ${cityName}`,
            `Independent Call Boy ${cityName}`,
            `Adult Classifieds ${cityName}`,
            `Call Boy Number ${cityName}`,
          ] as string[]).map((tag, i) => {
            const colors = [
              'bg-red-600','bg-orange-500','bg-blue-700','bg-green-700',
              'bg-gray-800','bg-red-700','bg-orange-600','bg-blue-600',
              'bg-green-600','bg-rose-600',
            ];
            return (
              <Link prefetch={false} key={i}
                href={`/call-boys/${city}`}
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
              `Call Boy In ${cityName}`,
              `Call Boy Near Me`,
              `Call Boy Number In ${cityName}`,
              `Male Escort Service In ${cityName}`,
              `Call Boys In ${cityName}`,
              `Escort Service ${cityName}`,
              `${cityName} Call Boys`,
              `${cityName} Male Escort Service`,
              `Call Boy Contact Number ${cityName}`,
              `Call Boy Price ${cityName}`,
              `Call Boys Near Me`,
              `${cityName} Male Escort`,
              `Male Escort Service In ${cityName}`,
              `Low Price Call Boy in ${cityName}`,
              `Call Boys ${cityName}`,
              `Call Boys Number ${cityName}`,
              `Male Escort In ${cityName}`,
              `Call Boy Pics ${cityName}`,
              `Call Boy Contact Number ${cityName}`,
              `Call Boys Rate ${cityName}`,
              `Call Boy Service ${cityName}`,
              `Best Call Boy Service ${cityName}`,
              `Low Price Call Boys ${cityName}`,
              `${cityName} Call Boy Service`,
              `Cheap Call Boy Near Me`,
              `Call Boys Price ${cityName}`,
              `${cityName} Call Boy Number`,
              `Call Boy Photo ${cityName}`,
              `Night Call Boy ${cityName}`,
              `Nearest Call Boy ${cityName}`,
              `Call Boy Ka Number ${cityName}`,
              `Low Cost Call Boys ${cityName}`,
              `Call Boy Services ${cityName}`,
              `Cheapest Call Boy ${cityName}`,
            ] as string[]).map((tag, idx, arr) => (
              <span key={idx}>
                <Link prefetch={false} href={`/call-boys/${city}`}
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
                    href={`/call-boys/${getCitySlug(c)}`}
                    className="text-xs font-semibold text-blue-600 hover:text-red-600 hover:underline py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors capitalize">
                    {c.toLowerCase()} Call Boys
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Recent Blogs & Guides */}
        {fallbackBlogs.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider text-center">
              Latest Call Boy Guides & Articles
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
            <Link prefetch={false} href={`/call-girls/${city}`}
              className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm">
              💃 Call Girls in {cityName}
            </Link>
            <Link prefetch={false} href={`/massage/${city}`}
              className="px-4 py-2 bg-purple-50 text-purple-600 text-sm font-bold rounded-xl border border-purple-100 hover:bg-purple-600 hover:text-white transition-all shadow-sm">
              💆 Massage Service in {cityName}
            </Link>
            <Link prefetch={false} href={`/call-boys`}
              className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-800 hover:text-white transition-all shadow-sm">
              📍 All India Call Boys Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
