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

function parseSpintax(text: string, seed: number): string {
  let currentSeed = seed;
  function nextRandom(): number {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  }
  
  const regex = /\{([^{}]+)\}/g;
  let spun = text;
  while (regex.test(spun)) {
    spun = spun.replace(regex, (match, choicesStr) => {
      const choices = choicesStr.split('|');
      const index = Math.floor(nextRandom() * choices.length);
      return choices[index];
    });
  }
  return spun;
}

function getDefaultSeoData(cityName: string, state: string): CitySEOContent {
  const hash = getCityHash(cityName);
  
  const metaTitleTemplate = hash % 2 === 0 
    ? `Call Girls in ${cityName} ❤️ Verified ${cityName} Escorts (Cash on Delivery)` 
    : `Top ${cityName} Escorts | Hottest Russian Call Girls in ${cityName} - CallGirl4U`;
    
  const metaDescriptionTemplate = hash % 3 === 0 
    ? `Explore verified independent Call Girls in ${cityName}. Starting at low cost ₹2100 with Free Hotel Delivery. Get direct Call Girl WhatsApp Numbers of local models & Russian Escorts.` 
    : `Book premium independent Call Girls in ${cityName}. Browse verified listings, real images, and secure companionship services across ${cityName} with cash on delivery 24/7.`;

  const metaKeywordsTemplate = `${cityName} Call Girls, Call Girls in ${cityName}, ${cityName} Escorts, Russian Escorts, Independent Escorts in ${cityName}, Call Girl WhatsApp Number, Cash on Delivery, Verified Call Girls`;

  const h1Template = hash % 2 === 0 
    ? `Call Girls in ${cityName} ❤️ Low Cost Verified Escorts` 
    : `Independent Call Girls in ${cityName} | Hottest Escort Service`;

  const heroSubtextTemplate = `{Discover|Explore|Find|Get access to} {verified|genuine|premium|elite} {adult classifieds and|independent} <strong class="font-bold">Call Girls in ${cityName}</strong>. {Connect safely and securely|Experience top-class companionship|Meet premium companions} with direct <strong class="font-bold">Call Girl WhatsApp Numbers</strong>. {Our independent directory covers|We list} {local college girls, professional models, and gorgeous Russian escorts|hottest VIP models, housewife companions, and local independent escorts} available {24/7|round-the-clock} for both {incall and outcall|home and hotel delivery} services. All {meetings|bookings} are {based on|conducted via} <strong class="font-bold">Cash on Delivery</strong> with absolutely {no advance payments|zero upfront fees|no deposit required}. {Your satisfaction and privacy are guaranteed|Enjoy discreet meetings with complete confidentiality}. {Browse through active lists, check photos, and choose the perfect lady for your needs.}`;

  const introHeadingTemplate = hash % 2 === 0 
    ? `Verified Call Girls in ${cityName} — Cash Payment Service` 
    : `Top ${cityName} Escort Service | Verified Companions`;

  const introTemplate = `{Welcome to the ultimate|Welcome to the leading|Introducing the finest} directory for booking high-class <strong class="font-bold">Call Girls in ${cityName}</strong>. If you are {staying in the city|in town for a business trip|a local resident} and looking to {spend a passionate night|relax with a beautiful companion|enjoy romantic moments}, our platform is your {trusted guide|#1 choice}. We feature {100% verified|genuine and active} profiles of <strong class="font-bold">Independent Escorts in ${cityName}</strong> who manage their own listings. {Unlike other agencies|Unlike standard portals}, we do not ask for any {upfront booking fees|advance payments|online deposits}. You can browse through {real photos|verified images} of beautiful models, {select your preferred companion|choose your favorite girl}, and reach her directly on her <strong class="font-bold">Call Girl WhatsApp Number</strong>. Whether you prefer the {youthful charm of local College Girls|mature companionship of Housewife Call Girls|elite experience of premium Russian Escorts}, our directory has a wide selection of profiles tailored to your desires. Every companion listed here is {well-behaved, professional, and dedicated|charming, bold, and fully trained} to provide the ultimate {GFE (Girlfriend Experience)|pleasurable meeting}. Our directory covers all popular localities and hotels across the ${state} region, ensuring {fast delivery within 30 minutes|rapid doorstep service}. Experience an unforgettable night filled with {satisfaction, warmth, and absolute discretion|pleasure, romance, and comfort} with the finest companions. {Our focus is to provide you with verified companions, saving you from online prepayment traps. Relax and enjoy a premium time with gorgeous local ladies.}`;

  const whyChooseHeadingTemplate = `Why Choose CallGirl4U for Call Girls in ${cityName}`;

  const whyChooseTemplate = `<p class="mb-4">{Choosing our directory for hiring a <strong class="font-bold">Call Girl in ${cityName}</strong> ensures a safe, premium, and scam-free experience. Here are the key highlights of our platform:}</p>
<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>{Verified Call Girls|Real Companions}:</strong> {We perform manual verification checks on all ads to ensure the images match the provider.|Every profile card features verified photos to save you from fake listings.}</li>
  <li><strong>{Cash on Delivery (COD)|No Advance Payments}:</strong> {We strictly advise against paying any advance booking fees, medical card charges, or transport fees. You only pay cash face-to-face after meeting your companion.|Safeguard your money by paying only in cash after complete satisfaction.}</li>
  <li><strong>{Direct WhatsApp Access|Fast Contact}:</strong> {Connect instantly using direct <strong class="font-bold">Call Girl WhatsApp Numbers</strong> without any middlemen or agency commissions.|Get direct phone and chat access to independent models immediately.}</li>
  <li><strong>{Absolute Discretion & Privacy|100% Confidentiality}:</strong> {Your privacy is our command. We do not store browsing history, cookies, or user logs. Enjoy your private meetings with zero paper trails.|We guarantee 100% security for both clients and independent providers.}</li>
</ul>
<p class="leading-relaxed">{With these safety features, we stand out as the most trusted platform for <strong class="font-bold">Escort Service in ${cityName}</strong>. Whether you choose an incall meeting or request a hotel delivery, you can enjoy peace of mind knowing you are dealing with genuine providers who prioritize your satisfaction. Our verified profiles undergo rigorous checks to ensure complete alignment with customer demands, giving you a smooth, stress-free time.}</p>`;

  const typesHeadingTemplate = `Categories of Call Girls Available in ${cityName}`;

  const typesTemplate = `{Advertisers in ${cityName} offer diverse companionship styles to suit your personal desires. Our listings feature several categories of companions:}
<ul class="list-disc pl-5 space-y-2 mt-2">
  <li><strong>{College Girls|Young Companions}:</strong> {Perfect for fun, bold, and energetic dates. These college call girls offer refreshing companionship and are open to fun conversations.|Charming and youthful girls who are ready to accompany you for night stays or club dates.}</li>
  <li><strong>{Housewife Call Girls|Mature Ladies}:</strong> {For those who appreciate mature, voluptuous, and experienced women. Housewife escorts in ${cityName} provide a warm, relaxing, and satisfying GFE experience.|Mature companions who know exactly how to please and satisfy a gentleman with complete ease.}</li>
  <li><strong>{Russian Escorts & Foreign Models|Elite VIP Companions}:</strong> {For a luxury, high-profile experience. Hire premium international VIP escorts who travel to luxury 5-star hotels in ${cityName}.|Gorgeous Russian call girls offering premium services for executive clients seeking elite company.}</li>
  <li><strong>{Independent Call Girls|High-Profile Models}:</strong> {Sophisticated, educated, and elegant companions who can accompany you to corporate events, dinner dates, or private hotel sessions.|Independent providers who publish their own ads and offer customized services.}</li>
</ul>
<p class="mt-4">{Explore the listings to find the ideal match that fits your aesthetic preference, budget, and location. Our directory is continuously updated with new profiles so you can enjoy fresh choices every single day. Make the most of your private time in ${cityName} with elite ladies who are dedicated to your pleasure.}</p>`;

  const bookingHeadingTemplate = `How to Safely Book Call Girls in ${cityName} — Step by Step`;

  const bookingStepsTemplate = `<p class="mb-4">{Booking a verified <strong class="font-bold">Call Girl in ${cityName}</strong> is a straightforward and secure process. Just follow these steps:}</p>
<ol class="list-decimal pl-5 space-y-2">
  <li><strong>{Browse & Select|Select a Profile}:</strong> {Look through our list of active, verified call girls in ${cityName} and pick the one that matches your tastes.|Explore local profiles, check photos, rates, and specifications on our site.}</li>
  <li><strong>{Contact Directly|Start a Chat}:</strong> {Use the direct link to call or send a message on the companion's <strong class="font-bold">Call Girl WhatsApp Number</strong>.|Instantly initiate a conversation with the independent companion.}</li>
  <li><strong>{Verify & Confirm|Confirm Booking Details}:</strong> {Discuss the meeting time, location (hotel or home), and services. Ask for voice or video verification if needed. Remember: never pay any booking fee online.|Agree on the location and package details without transferring any advance deposit.}</li>
  <li><strong>{Meet & Pay Cash|Cash Payment}:</strong> {Meet in a secure environment. Once you verify the companion in person, pay the agreed rate directly in cash.|Enjoy your GFE session and make the payment face-to-face after meeting.}</li>
</ol>
<p class="mt-4">{These simple guidelines ensure that you can safely hire premium companions without falling prey to typical online prepaid card scams. Your safety is our primary focus, and we take pride in maintaining a highly trusted, direct-to-provider adult classifieds service.}</p>`;

  const areasHeadingTemplate = `Service Coverage Across ${cityName}`;

  const areasTemplate = `{Our verified directory covers all major neighbourhoods, commercial sectors, and residential zones across <strong class="font-bold">${cityName}</strong>. Whether you are staying at a luxury 5-star hotel, an executive guest house, or a private residence in the ${state} region, our companions are available for outcall doorstep delivery. Popular areas for hotel and home delivery include central business hubs, premium shopping streets, and major transit points near you. You can enjoy a fast 30-minute delivery time as most independent escorts live close to these prominent locations. Always confirm your exact address and room details directly with the companion via her <strong class="font-bold">Call Girl WhatsApp Number</strong> to avoid any delay. Our directory ensures that no matter where you are in the city, you can find a local companion within a short distance, saving you time and ensuring prompt service.}`;

  const rateHeadingTemplate = `Estimated Call Girl Rates List in ${cityName}`;

  const rateIntroTemplate = `{Estimated rates for hiring a <strong class="font-bold">Call Girl in ${cityName}</strong> are determined independently by each provider based on the session duration and services requested. Below is an approximate rate guide representing the average market prices. We strongly advise a strict Cash on Delivery policy—never transfer advance booking fees or medical card charges online. Always verify the rates face-to-face before starting the session. Rates vary from local student models to high-class international VIP escorts, so discuss your expectations openly beforehand.}`;

  const privacyHeadingTemplate = `Privacy Protocols & Discretion`;

  const privacyTemplate = `{Discretion is the cornerstone of adult companionship. Our directory for <strong class="font-bold">Call Girls in ${cityName}</strong> operates on a strict zero-logs policy, meaning we do not track search histories, store cookies, or ask for user sign-ups. All communications are direct and private between you and the independent companion. By avoiding online payment gateways and implementing a cash-only transaction policy, we eliminate any credit card paper trails or bank statements, giving you complete peace of mind. Both clients and companions can enjoy secure meetings with total anonymity and peace of mind. Your secret is safe with us, making your booking private and safe.}`;

  const faqHeadingTemplate = `Frequently Asked Questions – Call Girls in ${cityName}`;

  const faq1_q = `{Are the profiles of <strong class="font-bold">Call Girls in ${cityName}</strong> verified?|How can I know if the photos of <strong class="font-bold">${cityName} Call Girls</strong> are genuine?}`;
  const faq1_a = `{Yes. We manually review and screen listings to verify the authenticity of photos and contact numbers in ${cityName}. We strongly encourage customers to report any profile that doesn't match the photos.|Every profile card displays verified badges which are verified manually. However, always exercise caution and report suspicious profiles.}`;

  const faq2_q = `{Is there any requirement for advance payment or deposit?|Do I need to pay a booking fee before meeting?}`;
  const faq2_a = `{No, absolutely not. We follow a strict Cash on Delivery policy. Never pay any booking fee, security deposit, medical card fee, or travel charges online in advance. Always pay directly in cash after meeting.|Under no circumstances should you transfer money beforehand. Pay the companion only in cash after you meet and verify her in person.}`;

  const faq3_q = `{What kinds of companions can I book in ${cityName}?|What categories of Call Girls are available?}`;
  const faq3_a = `{You can choose from a wide range of categories, including young college students, mature housewives, high-profile independent models, and premium Russian escorts.|Our directory lists various options, including local housewife companions, independent models, college girls, and VIP international escorts.}`;

  const faq4_q = `{What locations do the companions cover for outcall?|Can the call girls deliver service to my hotel room?}`;
  const faq4_a = `{Yes, our companions offer hotel and home outcall services to all major areas and premium hotels across ${cityName}. Ensure you meet in a safe and secure environment.|Outcall services are available at all major hotels, guest houses, and private residences in ${cityName} and surrounding localities.}`;

  const hinglishTemplate = `{<p class="mb-4"><strong>${cityName} Call Girls</strong> service dhoondhna ab behad aasan aur surakshit ho gaya hai. Hamari website par aapko milenge 100% genuine aur active profiles jisme direct <strong>Call Girl WhatsApp Number</strong> diya gaya hai. Agar aap ${cityName} me hain aur ek bold, beautiful aur friendly companion ke sath apna time spend karna chahte hain, toh aap bilkul sahi jagah par hain.</p>

<p class="mb-4">Hamari directory par aapko alag-alag categories jaise <strong>College Girls</strong>, <strong>Housewife Call Girls</strong>, aur high-profile <strong>Russian Escorts</strong> milengi jo aapki har sensual fantasy ko satisfy karne ke liye hamesha ready rehti hain. Yahan par sabhi independent escorts apni profile khud manage karti hain, isliye aapko kisi bhi middleman ya agency ko extra commission dene ki bilkul zarurat nahi hai.</p> 

<p class="mb-4">Sabse important baat jo aapko dhyan me rakhni hai woh hai <strong>Cash on Delivery</strong> policy. Internet par bahut se scammers logon se booking fee, security card fee, ya transport charges ke naam par advance online payment mangte hain. Hum aapko sakht salah dete hain ki kisi ko bhi ek rupaya bhi advance me pay na karein. Hamesha companion se face-to-face milne ke baad aur unki verification karne ke baad hi cash payment karein. Hamari site par aapko bilkul genuine call girl number milenge jahan online fraud ka zero risk hai.</p>

<p class="mb-4">Aap hotel booking ya home delivery, dono ke liye contact kar sakte hain. ${cityName} ke premium aur standard hotels me outcall service 24 ghante available hai. Bas profile select kijiye, WhatsApp link par click kijiye aur apni meeting confirm kijiye. Aapki privacy aur discretion hamare liye sabse badh kar hai, isliye hum aapse koi personal data ya credit card details nahi mangte.</p> 

<p class="mb-4">Aap bina kisi darr ke direct call karke ya message karke safe aur private dating ka maza le sakte hain. Kisi bhi fake profile ya fraud booking request ko flag karne ke liye aap har listing par diye gaye report button ka use kar sakte hain taaki hum use jaldi se remove kar sakein. Surakshit rahein aur ${cityName} me top-class call girl service ka safe experience enjoy karein!</p>

<p class="mb-4">Hum regularly hamare database ko update karte hain taaki aapko har baar naye aur fresh profiles dekhne ko milein. Agar aap ${cityName} ke kisi local area jaise main market ya railway station ke paas stay kar rahe hain, tab bhi hum aapko fast doorstep service provide karte hain. Yahan sabhi escorts bohot hi well-mannered aur educated hain jo aapke comfort aur privacy ka pura dhyan rakhti hain. Hamara aim aapko ek safe aur premium experience dena hai bina kisi online payment jhanjhat ke.</p>|<p class="mb-4">Agar aap <strong>${cityName} Call Girls</strong> ki talash me hain, toh hamara portal aapki sabse jyada madad karega. Hamari website par aapko milenge direct <strong>Call Girl WhatsApp Numbers</strong> jo bina kisi registration ya login ke accessible hain. ${cityName} me time spend karne ke liye aapko yahan milengi beautiful local models, college girls, housewife companions aur VIP models.</p>

<p class="mb-4">Sabhi profiles fully active hain aur manually verify kiye jaate hain. Aap directly independent companions se chat kar sakte hain. Hume pata hai ki aap safety ko sabse upar rakhte hain, isliye hamari website par koi bhi prepaid scheme nahi hai. Aapko booking ya transport fee ke naam par kisi ko bhi online money send nahi karna hai. Hum hamesha <strong>Cash on Delivery</strong> ko support karte hain, jisse aapka paisa aur privacy dono 100% secure rehte hain.</p>

<p class="mb-4">Meetings ke liye aap apne comfort ke hisab se in-call ya out-call choose kar sakte hain. ${cityName} ke major locations aur top hotels me delivery options available hain. Profiles check karke directly call kijiye aur apna sweet and romantic date book kijiye. Kisi bhi query ya report ke liye dynamic report flag ka use karein. Hum fake profiles ko turant website se ban karte hain taaki aapko bad experience na mile.</p>

<p class="mb-4">Aapka experience behad smooth aur private rahe, yahi hamara motive hai. Pure cash payment hone ki wajah se aapke bank statements me koi credit card trail nahi hoga jo aapki anonymity ko ensure karta hai. Hum ${cityName} me dating aur escort directory ke sabse trusted names me se ek hain. Bina kisi doubt ke verified profile choose kijiye aur sweet companions ke sath full fun aur relaxation enjoy kijiye. Hum data privacy regulations ko follow karte hain aur aapke browsing records ko store nahi karte hain, jo is service ko aur bhi trustworthy banata hai.</p>}`;

  return {
    metaTitle: parseSpintax(metaTitleTemplate, hash),
    metaDescription: parseSpintax(metaDescriptionTemplate, hash),
    metaKeywords: parseSpintax(metaKeywordsTemplate, hash),
    h1: parseSpintax(h1Template, hash),
    heroSubtext: parseSpintax(heroSubtextTemplate, hash),
    introHeading: parseSpintax(introHeadingTemplate, hash),
    introText: parseSpintax(introTemplate, hash),
    whyChooseHeading: parseSpintax(whyChooseHeadingTemplate, hash),
    whyChooseText: parseSpintax(whyChooseTemplate, hash),
    typesHeading: parseSpintax(typesHeadingTemplate, hash),
    typesText: parseSpintax(typesTemplate, hash),
    bookingHeading: parseSpintax(bookingHeadingTemplate, hash),
    bookingText: parseSpintax(bookingStepsTemplate, hash),
    areasHeading: parseSpintax(areasHeadingTemplate, hash),
    areasText: parseSpintax(areasTemplate, hash),
    rateHeading: parseSpintax(rateHeadingTemplate, hash),
    rateIntro: parseSpintax(rateIntroTemplate, hash),
    privacyHeading: parseSpintax(privacyHeadingTemplate, hash),
    privacyText: parseSpintax(privacyTemplate, hash),
    faqHeading: parseSpintax(faqHeadingTemplate, hash),
    faqs: [
      { q: parseSpintax(faq1_q, hash), a: parseSpintax(faq1_a, hash) },
      { q: parseSpintax(faq2_q, hash), a: parseSpintax(faq2_a, hash) },
      { q: parseSpintax(faq3_q, hash), a: parseSpintax(faq3_a, hash) },
      { q: parseSpintax(faq4_q, hash), a: parseSpintax(faq4_a, hash) }
    ],
    hindiText: parseSpintax(hinglishTemplate, hash),
    profiles: []
  };
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
  
  const totalAdsToShow = 48; 
  
  // Use city as seed for the image pool
  const cityImages = getDeterministicImagesPool(city, totalAdsToShow);
  const paginatedImages = cityImages.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage);
  
  const totalPages = Math.ceil(totalAdsToShow / adsPerPage);

  // Fetch global phone from KV
  const globalPhone = await getValue("contact_phone");

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
            "priceRange": `INR ${price}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cityName,
              "addressRegion": state,
              "addressCountry": "IN"
            }
          }
        };
      })
    }
  };

  return (
    <div className="bg-gray-50 pb-12">
      {/* Dynamic SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <div className="flex flex-wrap gap-2">
          {([
            `Escorts in ${cityName}`,
            `${cityName} Escorts`,
            `Independent Escorts ${cityName}`,
            `${cityName} Escort Directory`,
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
      </section>
    </div>
  );
}
