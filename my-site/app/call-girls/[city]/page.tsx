import { getAllCities, getCitySlug, getStateFromCity } from "@/lib/data/locations";
import { cityContentData, CitySEOContent } from "@/lib/data/cityContent";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import type { Metadata } from "next";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId } from "@/lib/ad-logic";
import { getValue } from "@/lib/kv";

export async function generateStaticParams() {
  return getAllCities().map(city => ({
    city: getCitySlug(city)
  }));
}

function getDefaultSeoData(cityName: string, state: string): CitySEOContent {
  return {
    metaTitle: `Call Girls in ${cityName} | ${cityName} Escorts | Verified Profiles | CallGirl4U`,
    metaDescription: `Find verified call girls in ${cityName}, ${state}. Browse genuine ads for escort service and companionship on CallGirl4U. Safe, discreet, 24/7 available.`,
    metaKeywords: `${cityName} Escorts, call girls in ${cityName}, ${cityName} call girls, ${cityName} escort service, ${cityName} call girls number, CallGirl4U`,
    h1: `Call Girls in ${cityName} – Verified & Available 24/7`,
    heroSubtext: `Find real, verified <strong>${cityName} call girls</strong>. Safe service, cash payment, home delivery. Browse hundreds of genuine profiles and find <strong>${cityName} call girls number</strong> now.`,
    introHeading: `${cityName} Escorts — Safe, Verified & Affordable`,
    introText: `Welcome to the ultimate platform to find <strong>Call Girls in ${cityName}</strong>. We ensure our users have a safe, discreet, and unforgettable experience. Whether you are looking for <strong>Collage girl girls ${cityName}</strong>, housewives, or Russian escorts, we offer a diverse range of 100% verified profiles. If you are searching for a <strong>genuine ${cityName} call girls number</strong>, we connect you with 100% verified profiles in the city. Safety and privacy are our top priorities for our clients.`,
    whyChooseHeading: `Why Choose Us for Call Girl Service in ${cityName}?`,
    whyChooseText: `Choosing our platform guarantees you access to fully verified profiles without the risk of fake photos. We are strictly against advance payments—<strong>No advance payment</strong> is required—you only pay in cash. Our <strong>Call Girls ${cityName}</strong> services are available 24/7 in ${cityName}, with guaranteed privacy and discreet meetups tailored to your comfort and convenience.`,
    typesHeading: `Types of Call Girls Available in ${cityName}`,
    typesText: `We offer a wide selection of companions in ${cityName}. <strong>College girls ${cityName}</strong> provide a fresh and energetic experience. Housewife Call Girls offer mature companionship. Russian Call Girls bring premium international elite experiences, while Independent and High Profile <strong>Call Girls ${cityName}</strong> cater specifically to our VIP clients in the city.`,
    bookingHeading: `How to Book Call Girl Service in ${cityName} — Step by Step`,
    bookingText: `Step 1: Browse available profiles on our site. Step 2: Select your preferred companion in ${cityName}. Step 3: Call or WhatsApp the <strong>${cityName} call girls number</strong> directly. Step 4: Confirm your location, pay cash on delivery, and enjoy your time.`,
    areasHeading: `Call Girl Service Available in All Areas of ${cityName}`,
    areasText: `We provide fast and reliable services everywhere in ${cityName}, including top local areas and premium hotel locations. Wherever you are staying, our verified escorts will travel to your location. No matter the time or place, we ensure smooth and safe availability across ${cityName}.`,
    rateHeading: `Call Girl Rate List in ${cityName} — Affordable Pricing`,
    rateIntro: `We offer transparent pricing for all services in ${cityName}. Below is a general rate estimation. All rates are negotiable. <strong>No advance payment</strong> required. Cash payment only.`,
    privacyHeading: `100% Safe, Secure & Private Call Girl Service in ${cityName}`,
    privacyText: `Your privacy in ${cityName} is fully protected. We do not store any personal data. All meetings happen confidentially in safe environments. Avoid online footprints—we prioritize pure cash transactions and absolute discretion. Get <strong>genuine ${cityName} call girls number</strong> only on CallGirl4U.`,
    faqHeading: `Frequently Asked Questions – Call Girls in ${cityName} on CallGirl4U`,
    faqs: [
      { q: `How do I find a genuine call girl in ${cityName}?`, a: `Simply browse our verified profiles section and contact the model directly via call or WhatsApp in ${cityName}. We guarantee genuine photos on CallGirl4U.` },
      { q: `Is the service available 24 hours in ${cityName}?`, a: `Yes, our call girls are available 24/7 for both day and night bookings across ${cityName} and nearby areas.` },
      { q: `Do you take advance payment?`, a: `No, we strictly follow a <strong>No advance payment</strong> policy. Never pay any advance online.` },
      { q: `What types of call girls are available in ${cityName}?`, a: `You can find college girls, housewives, independent models, and international escorts in our ${cityName} listings on CallGirl4U.` },
      { q: `Is my personal information safe with you?`, a: `Absolutely. We ensure 100% confidentiality and never share client details anywhere.` }
    ],
    hindiText: `${cityName} mein call girl service dhoondhna ab bahut aasan hai. Hamari website par sabhi profiles safe aur genuine hain, jo 24 ghante available rehti hain. Cash payment aur ghar delivery ya hotel delivery ki suvidha uplabdh hai. Kisi bhi fake advance payment se bachein aur sirf genuine ${cityName} कॉल गर्ल se milein.`,
    profiles: [] // Profile names will be dynamically mixed inline below
  }
}

import { getCitySeo } from "@/lib/seo-templates";

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
  
  const totalAdsToShow = 24; 
  
  // Use city as seed for the image pool
  const cityImages = getDeterministicImagesPool(city, totalAdsToShow);
  const paginatedImages = cityImages.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage);
  
  const totalPages = Math.ceil(totalAdsToShow / adsPerPage);

  // Fetch global phone from KV
  const globalPhone = await getValue("contact_phone");

  return (
    <div className="bg-gray-50 pb-12">
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
                 const adTitle = `${adName} - Call Girl in ${cityName}`;
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

        <h2 className="text-2xl mb-4">{seoData.whyChooseHeading}</h2>
        <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.whyChooseText }} />

        <h2 className="text-2xl mb-4">{seoData.typesHeading}</h2>
        <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.typesText }} />

        <h2 className="text-2xl mb-4">{seoData.bookingHeading}</h2>
        <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.bookingText }} />

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
                <th className="p-4 font-semibold text-gray-700">2 Short</th>
                <th className="p-4 font-semibold text-gray-700">Full Night</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-4">Call Girls in {cityName}</td>
                <td className="p-4">₹3,000</td>
                <td className="p-4">₹5,000</td>
                <td className="p-4">₹10,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">College Call Girls</td>
                <td className="p-4">₹5,000</td>
                <td className="p-4">₹8,000</td>
                <td className="p-4">₹15,000</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-4">Russian Call Girls</td>
                <td className="p-4">₹15,000</td>
                <td className="p-4">₹20,000</td>
                <td className="p-4">₹35,000</td>
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
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: faq.a }} />
            </div>
          ))}
        </div>

        <div className="bg-red-50 p-6 rounded-xl border border-red-200 my-8 shadow-sm">
          <p className="text-gray-800 font-medium leading-relaxed italic">{seoData.hindiText}</p>
        </div>
      </article>
    </div>
  );
}
