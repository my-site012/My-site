import { getAllCities, getCitySlug, getStateFromCity } from "@/lib/data/locations";
import { cityContentData, CitySEOContent } from "@/lib/data/cityContent";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import type { Metadata } from "next";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId } from "@/lib/ad-logic";
import { getValue } from "@/lib/kv";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return getAllCities().map(city => ({
    city: getCitySlug(city)
  }));
}

function getDefaultSeoData(cityName: string, state: string): CitySEOContent {
  return {
    metaTitle: `Premium Call Girls in ${cityName} | ${cityName} Escorts - Verified 24/7`,
    metaDescription: `Find the most exclusive call girls in ${cityName}. 100% verified profiles, no advance payment, and total discretion. Experience premium escort service in ${cityName} today.`,
    metaKeywords: `${cityName} Escorts, call girls in ${cityName}, ${cityName} call girls, ${cityName} escort service, ${cityName} call girls number, genuine call girls ${cityName}, verified profiles, cash payment, home delivery, hotel delivery, 24/7`,
    h1: `Premium Call Girls in ${cityName} - Genuine Escort Service 24/7`,
    heroSubtext: `Discover the most **exclusive call girls in ${cityName}**. Our platform offers **verified profiles** of stunning companions, from college girls to high-profile escorts. Enjoy a safe, discreet experience with **cash payment** and **home delivery** options. Find your perfect match and get a **genuine ${cityName} call girls number** today.`,
    introHeading: `Experience Unmatched Luxury with Premium Call Girls in ${cityName}`,
    introText: `Finding companionship that is both high-quality and reliable shouldn't be a gamble. When you are looking for the best **Call Girls in ${cityName}**, you deserve an experience that blends sophistication with absolute discretion. We pride ourselves on being the most trusted hub for **${cityName} call girls**, offering a curated selection of stunning women who understand the art of pleasure and conversation. Whether you are a local resident or a traveler staying in a luxury hotel, our **escort service in ${cityName}** is designed to meet your highest expectations. <br/><br/>Every profile you see here represents a real person, ensuring that your evening is spent with someone as beautiful in person as they are in their photos. We understand that your time is valuable, which is why we offer seamless **24/7** availability, ensuring that whenever the mood strikes, a top-tier companion is just a call away. Our platform is built on the pillars of trust and quality, making us the go-to choice for those who don't want to settle for anything less than the extraordinary. Your satisfaction is our only priority.`,
    whyChooseHeading: `Why Choose Us for Call Girl Service in ${cityName}?`,
    whyChooseText: `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Verified Profiles Only:</strong> Say goodbye to catfishing. We ensure all our models are 100% genuine and verified.</li>
      <li><strong>Strict No Advance Policy:</strong> Your safety is paramount. We only accept <strong>cash payment</strong> after you meet the model.</li>
      <li><strong>Total Discretion:</strong> We respect your privacy above all. No digital footprints, just pure, unadulterated enjoyment.</li>
      <li><strong>Flexible Locations:</strong> Whether you prefer <strong>home delivery</strong> or <strong>hotel delivery</strong>, our girls travel to you.</li>
      <li><strong>24/7 Availability:</strong> Day or night, our dedicated team is ready to assist your companionship needs in ${cityName}.</li>
    </ul>`,
    typesHeading: `Exotic Types of Call Girls Available in ${cityName}`,
    typesText: `We believe variety is the spice of life. That’s why we offer a diverse range of companions to suit every preference. Our **College girls in ${cityName}** are perfect for those seeking youthful energy and fun-loving vibes; they bring a refreshing charm to every encounter. For a more mature and refined experience, our **Housewives** category offers warmth, sophistication, and a deeper level of connection. <br/><br/>If you are looking for international flair, our elite **Russian escorts** provide a world-class experience right here in the city, blending exotic beauty with professional poise. For our most discerning clients, we feature **High Profile models** and independent girls who offer the pinnacle of luxury and class. No matter your choice, each companion is dedicated to making your time together unforgettable, ensuring that every moment is filled with passion and genuine connection.`,
    bookingHeading: `How to Book Call Girl Service in ${cityName} — Step-by-Step`,
    bookingText: `<ol class="list-decimal pl-5 space-y-2">
      <li><strong>Browse & Select:</strong> Explore our gallery of **verified profiles** and choose the beauty that catches your eye.</li>
      <li><strong>Contact Directly:</strong> Reach out via the **${cityName} call girls number** provided on the profile via call or WhatsApp.</li>
      <li><strong>Discuss Details:</strong> Confirm the duration, location (Home or Hotel), and any specific preferences you might have.</li>
      <li><strong>Enjoy the Meeting:</strong> Meet your companion, verify everything, and pay via **cash payment** at the start of the session.</li>
    </ol>`,
    areasHeading: `Call Girl Service Available in All Areas of ${cityName}`,
    areasText: `We provide fast and reliable services everywhere in ${cityName}, including top local areas and premium hotel locations. Wherever you are staying, our verified escorts will travel to your location. No matter the time or place, we ensure smooth and safe availability across ${cityName}. We cover every corner to ensure you are never alone.`,
    rateHeading: `Call Girl Rate List in ${cityName} — Affordable Luxury`,
    rateIntro: `We believe in transparent pricing without hidden costs. Below is a general rate list for our **escort service in ${cityName}**. Remember, we strictly follow a **no advance payment** policy.`,
    privacyHeading: `100% Safe, Secure & Private Call Girl Service in ${cityName}`,
    privacyText: `Security isn't just a feature; it's our foundation. We know that in the world of **escort service in ${cityName}**, privacy is the most important factor. We use encrypted communication and never store any of your personal data on our servers. Our models are trained to be professional and discreet, ensuring that your private life remains exactly that—private. <br/><br/>By choosing our platform, you are opting for a service that values your reputation as much as you do. Get a **genuine ${cityName} call girls number** and experience the peace of mind that comes with a truly professional agency. We go the extra mile to ensure that every encounter is handled with the utmost secrecy, allowing you to relax and enjoy the moment without a single worry.`,
    faqHeading: `Frequently Asked Questions – Call Girls in ${cityName} on CallGirl4U`,
    faqs: [
      { q: `How can I be sure the profiles in ${cityName} are real?`, a: `We manually verify every profile. The photos you see are of the actual models. We guarantee <strong>verified profiles</strong> for all our clients.` },
      { q: `Do you provide home delivery in ${cityName}?`, a: `Yes, we offer both <strong>home delivery</strong> and <strong>hotel delivery</strong> options for your convenience and comfort.` },
      { q: `What is the payment process?`, a: `We only accept <strong>cash payment</strong> at the time of the meeting. We never ask for any advance payment online.` },
      { q: `Is the service available late at night?`, a: `Absolutely. Our service is available <strong>24/7</strong> in ${cityName} to cater to your needs at any hour.` },
      { q: `Can I book a Russian escort in ${cityName}?`, a: `Yes, we have a premium selection of high-profile and Russian escorts available for booking.` }
    ],
    hindiText: `${cityName} mein best service dhoond rahe ho? To tension chhodo aur direct call karo. Hamare paas sabhi **verified profiles** hain aur hum koi bhi **advance payment nahi lete**. Sab kuch safe aur secure hai, aap **cash payment** kar sakte hain meeting ke time par. Chahe **home delivery** ho ya **hotel delivery**, hum 24/7 available hain. Kisi bhi fake logo ko advance mat dena, sirf genuine kaam ke liye hamein contact karein aur apni raat rangeen banayein.`,
    profiles: []
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
          <p className="text-gray-800 font-medium leading-relaxed italic" dangerouslySetInnerHTML={{ __html: seoData.hindiText }} />
        </div>
      </article>
    </div>
  );
}
