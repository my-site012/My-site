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

function getCityHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getDefaultSeoData(cityName: string, state: string): CitySEOContent {
  const hash = getCityHash(cityName);
  
  // Variation 1: Seductive & Professional
  // Variation 2: Luxury & Elite
  // Variation 3: Trust & Safety Focused
  
  const intros = [
    `Finding companionship that is both high-quality and reliable shouldn't be a gamble. When you are looking for the best <strong>Call Girls in ${cityName}</strong>, you deserve an experience that blends sophistication with absolute discretion. We pride ourselves on being the most trusted hub for <strong>${cityName} call girls</strong>, offering a curated selection of stunning women who understand the art of pleasure and conversation. Whether you are a local resident or a traveler staying in a luxury hotel, our <strong>escort service in ${cityName}</strong> is designed to meet your highest expectations. <br/><br/>Every profile you see here represents a real person, ensuring that your evening is spent with someone as beautiful in person as they are in their photos. We understand that your time is valuable, which is why we offer seamless <strong>24/7</strong> availability, ensuring that whenever the mood strikes, a top-tier companion is just a call away. Our platform is built on the pillars of trust and quality, making us the go-to choice for those who don't want to settle for anything less than the extraordinary.`,
    
    `Welcome to the most exclusive destination for premium companionship in the heart of ${cityName}. If you are seeking the company of elegant <strong>Call Girls in ${cityName}</strong>, our agency provides a gateway to a world of luxury and desire. We understand that <strong>${cityName} call girls</strong> are known for their beauty and charm, and we have handpicked the most stunning models to ensure your satisfaction. Our <strong>escort service in ${cityName}</strong> is tailored for those who appreciate the finer things in life and seek a companion who can match their lifestyle. <br/><br/>From the moment you connect with us, you'll notice the difference in our approach. We prioritize your privacy and ensure a seamless booking process with <strong>verified profiles</strong> and <strong>no advance payment</strong>. Whether it is a quiet evening at home or a vibrant night in a high-end hotel, our companions are ready to make your ${cityName} stay truly memorable. Experience the peak of professional escort services with us today.`,
    
    `Are you ready to discover the true meaning of pleasure with the most sought-after <strong>Call Girls in ${cityName}</strong>? Our platform is dedicated to connecting discerning gentlemen with genuine, high-profile <strong>${cityName} call girls</strong> who are as intelligent as they are beautiful. We know that searching for a reliable <strong>escort service in ${cityName}</strong> can be difficult, which is why we have simplified the process by offering <strong>verified profiles</strong> and 100% transparency. Your safety and comfort are our top priorities, and we guarantee a service that is both discreet and fulfilling. <br/><br/>Our companions in ${cityName} come from various backgrounds—from college students to sophisticated housewives—each bringing a unique spark to your encounter. We offer <strong>24/7</strong> availability and flexible <strong>home delivery</strong> or <strong>hotel delivery</strong> options to suit your schedule. Stop settling for mediocre experiences and choose the agency that defines excellence in ${cityName}. Your perfect companion is just one <strong>cash payment</strong> away from making your fantasies a reality.`
  ];

  const types = [
    `We believe variety is the spice of life. That’s why we offer a diverse range of companions to suit every preference. Our <strong>College girls in ${cityName}</strong> are perfect for those seeking youthful energy and fun-loving vibes; they bring a refreshing charm to every encounter. For a more mature and refined experience, our <strong>Housewives</strong> category offers warmth, sophistication, and a deeper level of connection. <br/><br/>If you are looking for international flair, our elite <strong>Russian escorts</strong> provide a world-class experience right here in the city, blending exotic beauty with professional poise. For our most discerning clients, we feature <strong>High Profile models</strong> and independent girls who offer the pinnacle of luxury and class.`,
    
    `Our agency boasts a diverse portfolio of stunning ladies to cater to your specific tastes. If you prefer the innocence and playfulness of <strong>College girls in ${cityName}</strong>, you will be delighted by our selection. For those who enjoy the elegance and experience of a mature woman, our <strong>Housewives in ${cityName}</strong> are the ideal choice. We also offer <strong>Independent call girls</strong> who provide a more personalized and intimate experience. <br/><br/>For a touch of international luxury, our <strong>Russian call girls in ${cityName}</strong> are second to none, offering breathtaking beauty and elite companionship. Whether you desire a petite beauty or a curvaceous model, our <strong>escort service in ${cityName}</strong> ensures that your specific desires are met with the utmost professionalism and passion.`,
    
    `Selection is the key to a perfect evening. In ${cityName}, we provide access to an array of companions including stunning <strong>College students</strong>, sophisticated <strong>Housewives</strong>, and elite <strong>High-profile models</strong>. Our <strong>Russian escorts in ${cityName}</strong> are particularly popular for their striking looks and graceful presence, making them perfect for high-end events or private hotel dates. <br/><br/>Each companion in our ${cityName} database is vetted for quality and reliability. Whether you are looking for a bubbly personality for a dinner date or a seductive partner for a private night, our <strong>${cityName} call girls</strong> are here to exceed your expectations. We offer a mix of local and international beauties to ensure that every client finds exactly what they are looking for in the city.`
  ];

  const whyChoose = [
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Verified Profiles Only:</strong> Say goodbye to catfishing. We ensure all our models are 100% genuine and verified.</li>
      <li><strong>Strict No Advance Policy:</strong> Your safety is paramount. We only accept <strong>cash payment</strong> after you meet the model.</li>
      <li><strong>Total Discretion:</strong> We respect your privacy above all. No digital footprints, just pure, unadulterated enjoyment.</li>
      <li><strong>Flexible Locations:</strong> Whether you prefer <strong>home delivery</strong> or <strong>hotel delivery</strong>, our girls travel to you.</li>
      <li><strong>24/7 Availability:</strong> Day or night, our dedicated team is ready to assist your companionship needs in ${cityName}.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Genuine Photos:</strong> The girls you see are the girls you get. We prioritize 100% authenticity in ${cityName}.</li>
      <li><strong>No Online Payment:</strong> Avoid scams. We never ask for money before the meeting. <strong>Cash payment</strong> only.</li>
      <li><strong>Discreet & Secure:</strong> We handle every booking with the highest level of secrecy to protect your reputation.</li>
      <li><strong>Premium Models:</strong> From <strong>Russian call girls</strong> to elite local models, we offer only the best in ${cityName}.</li>
      <li><strong>Fastest Response:</strong> Our 24/7 support ensures you get a <strong>genuine ${cityName} call girls number</strong> instantly.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Elite Vetting Process:</strong> Every <strong>escort in ${cityName}</strong> is handpicked for their beauty and professionalism.</li>
      <li><strong>Safe Transactions:</strong> We value your trust. No advance, no hidden fees. Pay only in <strong>cash</strong> upon arrival.</li>
      <li><strong>Privacy Guaranteed:</strong> Your data and identity are never shared. We offer a completely anonymous service.</li>
      <li><strong>City-Wide Reach:</strong> We cover all major areas of ${cityName} with prompt <strong>home and hotel delivery</strong>.</li>
      <li><strong>Always Available:</strong> Our <strong>24/7</strong> service means you never have to spend a lonely night in ${cityName}.</li>
    </ul>`
  ];

  const bookingSteps = [
    `<ol class="list-decimal pl-5 space-y-2">
      <li><strong>Browse & Select:</strong> Explore our gallery of <strong>verified profiles</strong> and choose the beauty that catches your eye.</li>
      <li><strong>Contact Directly:</strong> Reach out via the <strong>${cityName} call girls number</strong> provided on the profile via call or WhatsApp.</li>
      <li><strong>Discuss Details:</strong> Confirm the duration, location (Home or Hotel), and any specific preferences you might have.</li>
      <li><strong>Enjoy the Meeting:</strong> Meet your companion, verify everything, and pay via <strong>cash payment</strong> at the start of the session.</li>
    </ol>`,
    `<ol class="list-decimal pl-5 space-y-2">
      <li><strong>Pick Your Favorite:</strong> Look through our list of <strong>${cityName} call girls</strong> and find your match.</li>
      <li><strong>Send a Message:</strong> Use the WhatsApp button or call the <strong>genuine number</strong> on the profile.</li>
      <li><strong>Set the Scene:</strong> Tell us where you want to meet (Home or Hotel) and when. No advance needed!</li>
      <li><strong>Payment on Arrival:</strong> Welcome your model and make the <strong>cash payment</strong> at the beginning of the service.</li>
    </ol>`
  ];

  const privacyTexts = [
    `Security isn't just a feature; it's our foundation. We know that in the world of <strong>escort service in ${cityName}</strong>, privacy is the most important factor. We use encrypted communication and never store any of your personal data on our servers. Our models are trained to be professional and discreet, ensuring that your private life remains exactly that—private. <br/><br/>By choosing our platform, you are opting for a service that values your reputation as much as you do. Get a <strong>genuine ${cityName} call girls number</strong> and experience the peace of mind that comes with a truly professional agency.`,
    `We understand the sensitivity of seeking an <strong>escort in ${cityName}</strong>. That is why we have built a system that guarantees 100% anonymity. From the first call to the final meeting, your details are kept strictly confidential. We never share numbers or records, ensuring your experience remains between you and your companion. <br/><br/>Our agency is known in ${cityName} for its high standards of ethics and privacy. When you book a <strong>verified profile</strong> through us, you are choosing safety and discretion. No digital trails, just a <strong>cash payment</strong> for a premium experience you can trust.`,
    `Your reputation is safe with us. We have served thousands of clients in ${cityName} who value their privacy above all else. Our <strong>${cityName} call girls</strong> are not just beautiful but also highly professional and discreet. We do not require any registration or advance payment, keeping the entire process anonymous. <br/><br/>Whether you are a high-profile individual or simply someone who values secrecy, our <strong>escort service in ${cityName}</strong> is the perfect choice. We ensure that every encounter is handled with the utmost care, allowing you to relax and enjoy your time in the city without any stress.`
  ];

  return {
    metaTitle: hash % 2 === 0 ? `Premium Call Girls in ${cityName} | ${cityName} Escorts - Verified 24/7` : `${cityName} Call Girls | Genuine Escort Service in ${cityName} - No Advance`,
    metaDescription: hash % 3 === 0 ? `Find the most exclusive call girls in ${cityName}. 100% verified profiles, no advance payment, and total discretion. Experience premium escort service in ${cityName} today.` : `Looking for genuine ${cityName} call girls? Browse verified profiles of stunning companions in ${cityName}. Cash payment, hotel delivery, and 24/7 service guaranteed.`,
    metaKeywords: `${cityName} Escorts, call girls in ${cityName}, ${cityName} call girls, ${cityName} escort service, ${cityName} call girls number, genuine call girls ${cityName}, verified profiles, cash payment, home delivery, hotel delivery, 24/7`,
    h1: hash % 2 === 0 ? `Premium Call Girls in ${cityName} - Genuine Escort Service 24/7` : `Verified Call Girls in ${cityName} | Elite Escort Service No Advance`,
    heroSubtext: `Discover the most <strong>exclusive call girls in ${cityName}</strong>. Our platform offers <strong>verified profiles</strong> of stunning companions, from college girls to high-profile escorts. Enjoy a safe, discreet experience with <strong>cash payment</strong> and <strong>home delivery</strong> options. Find your perfect match and get a <strong>genuine ${cityName} call girls number</strong> today.`,
    introHeading: hash % 2 === 0 ? `Experience Unmatched Luxury with Premium Call Girls in ${cityName}` : `The Ultimate Destination for Elite ${cityName} Call Girls`,
    introText: intros[hash % intros.length],
    whyChooseHeading: `Why Choose Us for Call Girl Service in ${cityName}?`,
    whyChooseText: whyChoose[hash % whyChoose.length],
    typesHeading: `Exotic Types of Call Girls Available in ${cityName}`,
    typesText: types[hash % types.length],
    bookingHeading: `How to Book Call Girl Service in ${cityName} — Step-by-Step`,
    bookingText: bookingSteps[hash % bookingSteps.length],
    areasHeading: `Call Girl Service Available in All Areas of ${cityName}`,
    areasText: `We provide fast and reliable services everywhere in ${cityName}, including top local areas and premium hotel locations. Whether you are in the heart of the city or in the outskirts of ${state}, our verified escorts will travel to your location. No matter the time or place, we ensure smooth and safe availability across <strong>${cityName}</strong>.`,
    rateHeading: `Call Girl Rate List in ${cityName} — Affordable Luxury`,
    rateIntro: `We believe in transparent pricing without hidden costs. Below is a general rate list for our <strong>escort service in ${cityName}</strong>. Remember, we strictly follow a <strong>no advance payment</strong> policy.`,
    privacyHeading: `100% Safe, Secure & Private Call Girl Service in ${cityName}`,
    privacyText: privacyTexts[hash % privacyTexts.length],
    faqHeading: `Frequently Asked Questions – Call Girls in ${cityName} on CallGirl4U`,
    faqs: [
      { q: `How can I be sure the profiles in ${cityName} are real?`, a: `We manually verify every profile. The photos you see are of the actual models. We guarantee <strong>verified profiles</strong> for all our clients.` },
      { q: `Do you provide home delivery in ${cityName}?`, a: `Yes, we offer both <strong>home delivery</strong> and <strong>hotel delivery</strong> options for your convenience and comfort.` },
      { q: `What is the payment process?`, a: `We only accept <strong>cash payment</strong> at the time of the meeting. We never ask for any advance payment online.` },
      { q: `Is the service available late at night?`, a: `Absolutely. Our service is available <strong>24/7</strong> in ${cityName} to cater to your needs at any hour.` },
      { q: `Can I book a Russian escort in ${cityName}?`, a: `Yes, we have a premium selection of high-profile and Russian escorts available for booking.` }
    ],
    hindiText: hash % 2 === 0 ? `${cityName} mein best service dhoond rahe ho? To tension chhodo aur direct call karo. Hamare paas sabhi <strong>verified profiles</strong> hain aur hum koi bhi <strong>advance payment nahi lete</strong>. Sab kuch safe aur secure hai, aap <strong>cash payment</strong> kar sakte hain meeting ke time par. Chahe <strong>home delivery</strong> ho ya <strong>hotel delivery</strong>, hum 24/7 available hain.` : `Dosto, agar aap ${cityName} mein genuine <strong>call girl service</strong> search kar rahe hain to aap sahi jagah aaye hain. Hum dete hain 100% <strong>verified profiles</strong> bina kisi advance ke. Aapko sirf <strong>cash payment</strong> karni hai jab aap model se milein. Hum <strong>24/7 available</strong> hain pure ${cityName} mein.`,
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
