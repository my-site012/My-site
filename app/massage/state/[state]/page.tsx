import { locations, getAllStates, getStateSlug, getCitySlug } from "@/lib/data/locations";
import AdCard from "@/components/AdCard";
import type { Metadata } from "next";
import Link from "next/link";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId, getContactNumber, getHash } from "@/lib/ad-logic";
import { cachedGetValue } from "@/lib/kv";

// ISR: revalidate every hour — content is deterministic, no need to re-render on every request
export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllStates().map(state => ({
    state: getStateSlug(state)
  }));
}

function getCityHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 7;
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

function getMassageStateSeoData(stateName: string) {
  const hash = getCityHash(stateName);

  const metaTitleTemplate = hash % 2 === 0
    ? `Massage Service in ${stateName} ❤️ Full Body Spa & Female to Male Massage`
    : `${stateName} Massage Girls | Best Body Massage Parlour Near You`;

  const metaDescriptionTemplate = hash % 3 === 0
    ? `Book verified full body massage service in ${stateName}. Professional female to male massage at home or hotel. Sensual & relaxing body spa with cash on delivery.`
    : `Find top-rated massage parlour in ${stateName} with direct WhatsApp contact. Full body, B2B, & relaxation massage available 24/7 in ${stateName}.`;

  const metaKeywords = `Massage in ${stateName}, ${stateName} Massage Service, Body Massage ${stateName}, Female to Male Massage ${stateName}, Massage Parlour ${stateName}, Full Body Massage ${stateName}, Spa in ${stateName}`;

  const h1Template = hash % 2 === 0
    ? `Full Body Massage in ${stateName} ❤️ Best Spa & Massage Service`
    : `Massage Service in ${stateName} | Female to Male Body Spa`;

  const heroSubtextTemplate = `{Discover|Find|Book|Explore} {verified|genuine|professional|trained} <strong class="font-bold">Massage Service in ${stateName}</strong>. {Connect directly|Get in touch} with {experienced|skilled|trained} massage therapists via {direct WhatsApp|phone number}. {Our directory features|Browse through} {relaxing full body massages, sensual B2B massage, aromatherapy spa, and home massage delivery|body-to-body spa, deep tissue massage, and outcall home massage services} available {24/7|round-the-clock} in ${stateName}. All {sessions|bookings} are {based on|conducted via} <strong class="font-bold">Cash on Delivery</strong> — {no advance payment required|zero deposit needed}.`;

  const introHeading = hash % 2 === 0
    ? `Best Massage Parlour in ${stateName} — Verified & Trusted`
    : `Top Massage Service in ${stateName} | Home & Hotel Delivery`;

  const introText = `{Welcome to the premier|Discover the leading} directory for booking {premium|professional|relaxing} <strong class="font-bold">Massage Service in ${stateName}</strong>. Whether you are {looking for a relaxing full body massage after a long day|seeking a rejuvenating spa experience}, our platform connects you directly with {certified therapists and independent massage providers|experienced massage specialists} across the state. We feature {verified|genuine} profiles of {female massage therapists|trained spa professionals} who offer services ranging from {traditional Indian massage|body-to-body massage|aromatherapy} to {deep tissue therapy|Swedish relaxation massage|sensual companion massage}. All services are {offered with cash-on-delivery|available with zero advance payment} so you {never have to worry about online fraud|pay only after complete satisfaction}. Our directory covers ${stateName} with {doorstep home delivery|hotel room service} in all major localities and cities.`;

  const typesHeading = `Types of Massage Available in ${stateName}`;
  const typesText = `{Our ${stateName} massage directory features diverse service options:}
<ul class="list-disc pl-5 space-y-2 mt-2">
  <li><strong>{Full Body Massage|Swedish Massage}:</strong> {A deeply relaxing, head-to-toe massage targeting muscle tension and stress relief. Perfect for business travelers and locals seeking relaxation.|Classic relaxation massage using long, flowing strokes to ease muscle tension and improve circulation.}</li>
  <li><strong>{B2B Massage|Body to Body Massage}:</strong> {An intimate and sensual massage where the therapist uses her full body to deliver a deeply pleasurable relaxation experience.|Exclusive skin-to-skin massage technique providing maximum relaxation and sensory pleasure.}</li>
  <li><strong>{Aromatherapy Spa|Thai Massage}:</strong> {Using essential oils and herbal extracts for a multi-sensory relaxation experience that calms the mind and body.|Traditional techniques combined with acupressure points for deep muscle relief and flexibility.}</li>
  <li><strong>{Happy Ending Massage|Sensual Companion Massage}:</strong> {A full relaxation massage session that ends with a pleasurable climax for complete satisfaction and stress relief.|An intimate massage experience offered by professional companions in a private, comfortable setting.}</li>
</ul>
<p class="mt-4">{Browse our verified listings to find the perfect massage experience in ${stateName} matching your preferences and budget. All therapists are {professionally trained|experienced} and {available 24/7|available round-the-clock} for both incall and outcall services.}</p>`;

  const bookingHeading = `How to Book Massage Service in ${stateName}`;
  const bookingText = `<p class="mb-4">{Booking a {professional|verified} massage in ${stateName} is {easy and secure|simple and safe} through our directory:}</p>
<ol class="list-decimal pl-5 space-y-2">
  <li><strong>{Browse Profiles|Select a Therapist}:</strong> {View verified massage therapist profiles with photos, rates, and service descriptions.|Choose from our active listing of trained massage professionals in ${stateName}.}</li>
  <li><strong>{Direct Contact|WhatsApp Connect}:</strong> {Use the direct WhatsApp number to chat with the therapist and discuss your preferred massage type, duration, and location.|Instantly contact the massage provider via phone or WhatsApp without any middlemen.}</li>
  <li><strong>{Confirm Booking|Schedule Session}:</strong> {Agree on the session time, location (home/hotel/parlour), and service package. Never send any advance payment online.|Finalize the massage appointment details without any online transfer of funds.}</li>
  <li><strong>{Enjoy & Pay Cash|Cash on Delivery}:</strong> {Enjoy your full relaxation massage session and pay directly in cash to the therapist after completing the service.|Pay the agreed amount face-to-face in cash only after your massage session is completed.}</li>
</ol>
<p class="mt-4">{This secure, cash-only process ensures you enjoy genuine massage services without any risk of online scam or fraud.}</p>`;

  const areasHeading = `Massage Service Coverage in ${stateName}`;
  const areasText = `{Our verified directory covers all major areas, hotels, and residential localities across <strong class="font-bold">${stateName}</strong> for home and hotel massage delivery. Whether you are staying at a {5-star luxury hotel|guest house|private residence}, our massage therapists can provide {doorstep service|room service} directly. Popular areas for massage home delivery include {business districts, tourist hotspots, and major transit areas|premium hotel zones, corporate hubs, and residential neighborhoods}. Most independent massage providers in ${stateName} can reach your location within {30-45 minutes|an hour}. Always {share your complete address|confirm location details} directly with the therapist via WhatsApp for a smooth, on-time service. Our ${stateName} region directory ensures you find a {nearby professional|local massage expert} wherever you are in the state.}`;

  const rateHeading = `Massage Service Price List in ${stateName}`;
  const rateIntro = `{The rates for massage services in <strong class="font-bold">${stateName}</strong> vary based on service type, duration, and therapist experience. The following is an estimated price guide. Always confirm actual rates directly with the provider before booking. Strictly follow Cash on Delivery — never pay any advance booking fee, medical card charge, or transport cost online.}`;

  const privacyHeading = `Privacy & Discretion for Massage Bookings`;
  const privacyText = `{Your privacy is our top priority. Our ${stateName} massage directory operates on a {strict no-logs policy|complete anonymity basis}, meaning we {don't store your browsing data|never track your searches or location}. All communication is {direct between you and the massage provider|completely private and end-to-end}. By using {cash-only payment|Cash on Delivery}, there are no {bank statements or credit card trails|online payment records} linking you to the service. Your {identity|personal information} is fully protected at all times. Enjoy {complete discretion|100% privacy} while booking your ${stateName} massage service.}`;

  const faqHeading = `FAQs – Massage Service in ${stateName}`;

  const faqs = [
    {
      q: `{Are the massage therapists in ${stateName} verified?|How can I confirm the massage providers are genuine?}`,
      a: `{Yes. All massage therapist profiles in our ${stateName} directory are manually reviewed for photo authenticity and contact verification. Report any suspicious listing using the flag button.|Our team manually verifies profile photos and contact details for all massage providers listed in ${stateName}.}`
    },
    {
      q: `{Do I need to pay advance for massage service in ${stateName}?|Is there any upfront booking fee required?}`,
      a: `{Absolutely not. We strictly enforce Cash on Delivery. Never pay any advance fee, transport charges, or medical card fee online before your session.|No advance payment is needed. Always pay the massage therapist directly in cash after your session is complete.}`
    },
    {
      q: `{What massage types are available in ${stateName}?|Which massage services can I book?}`,
      a: `{Our ${stateName} directory offers full body massage, B2B massage, aromatherapy spa, Swedish relaxation, deep tissue massage, and sensual companion massage.|Various options are available including traditional Indian massage, body-to-body spa, happy ending massage, and home delivery massage.}`
    },
    {
      q: `{Can I get massage service delivered to my hotel in ${stateName}?|Is home/hotel outcall massage available?}`,
      a: `{Yes. Most massage providers in ${stateName} offer hotel and home outcall services throughout the state and nearby areas. Confirm your location directly via WhatsApp.|Outcall home and hotel delivery massage is available across ${stateName}. Contact the therapist directly to arrange.}`
    }
  ];

  const hinglishText = `{<p class="mb-4"><strong>${stateName} Massage Service</strong> ki talash ab aasaan ho gayi hai. Hamari website par aapko milenge <strong>verified aur professional massage therapists</strong> ke direct <strong>WhatsApp numbers</strong>. Agar aap ${stateName} mein hain aur ek relaxing full body massage ya B2B massage ka experience lena chahte hain, toh aap bilkul sahi jagah par hain.</p>

<p class="mb-4">Hamari directory par aapko milegi poori variety jaise <strong>Full Body Massage</strong>, <strong>Body to Body Massage</strong>, <strong>Aromatherapy Spa</strong>, aur <strong>Happy Ending Massage</strong>. Yahan sabhi massage providers apni profile khud manage karti hain, isliye kisi middleman ya agency ko extra commission dene ki bilkul zarurat nahi hai.</p>

<p class="mb-4">Sabse zaroori baat — hamesha <strong>Cash on Delivery</strong> ka use karein. Internet par bahut se fraud log booking fee, medical card charges ya transport charges ke naam par advance payment mangte hain. Hum aapko sakht salah dete hain ki kisi ko bhi online advance payment na karein. Massage session complete hone ke baad hi cash payment karein.</p>

<p class="mb-4">Aap apne hotel ya ghar par home delivery massage book kar sakte hain. ${stateName} ke sabhi major areas mein 24 ghante service available hai. Bas profile select karein, WhatsApp karein aur apna appointment confirm karein. Aapki privacy aur discretion hamari top priority hai.</p>

<p class="mb-4">Hum regularly apna database update karte hain taaki aapko ${stateName} mein fresh aur active massage profiles milein. Sahi companion choose karein, safe rahen, aur <strong>${stateName} massage service</strong> ka premium experience enjoy karein bina kisi online fraud ke darr ke!</p>|<p class="mb-4">Agar aap <strong>${stateName} mein best massage service</strong> dhundh rahe hain, toh hamara portal aapka sabse bada helper hai. Yahan par aapko milenge experienced <strong>female massage therapists</strong> ke direct <strong>WhatsApp numbers</strong> jo bina kisi registration ke accessible hain.</p>

<p class="mb-4">Hamare ${stateName} massage directory mein aapko milega — <strong>Full Body Massage</strong>, sensual <strong>B2B Massage</strong>, traditional <strong>Indian Spa</strong>, aur <strong>Happy Ending Massage</strong> — sabhi services ek hi jagah par. Sabhi profiles manually verified hain aur regularly update kiye jaate hain.</p>

<p class="mb-4">Kisi bhi advance payment se bachein. Hamari directory par listed koi bhi genuine therapist advance booking fee nahi maangti. Hum hamesha <strong>Cash on Delivery</strong> ko promote karte hain jisse aapka paisa aur privacy dono 100% safe rehte hain.</p>

<p class="mb-4">${stateName} ke premium hotels ya aapke ghar par doorstep massage delivery available hai. Apni pasandida profile choose karein, seedha WhatsApp karein aur apna relaxation session enjoy karein. Fraud profile report karne ke liye listing par diye gaye report button ka use karein.</p>

<p class="mb-4">Hamara aim hai aapko ${stateName} mein ek safe, premium, aur trusted massage experience dena — bina kisi jhanjhat ke. Verified profiles browse karein aur ek relaxing companion ke sath full satisfaction enjoy karein!</p>}`;

  return {
    metaTitle: parseSpintax(metaTitleTemplate, hash),
    metaDescription: parseSpintax(metaDescriptionTemplate, hash),
    metaKeywords,
    h1: parseSpintax(h1Template, hash),
    heroSubtext: parseSpintax(heroSubtextTemplate, hash),
    introHeading: parseSpintax(introHeading, hash),
    introText: parseSpintax(introText, hash),
    typesHeading: parseSpintax(typesHeading, hash),
    typesText: parseSpintax(typesText, hash),
    bookingHeading: parseSpintax(bookingHeading, hash),
    bookingText: parseSpintax(bookingText, hash),
    areasHeading: parseSpintax(areasHeading, hash),
    areasText: parseSpintax(areasText, hash),
    rateHeading: parseSpintax(rateHeading, hash),
    rateIntro: parseSpintax(rateIntro, hash),
    privacyHeading: parseSpintax(privacyHeading, hash),
    privacyText: parseSpintax(privacyText, hash),
    faqHeading: parseSpintax(faqHeading, hash),
    faqs: faqs.map(faq => ({
      q: parseSpintax(faq.q, hash),
      a: parseSpintax(faq.a, hash)
    })),
    hindiText: parseSpintax(hinglishText, hash)
  };
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const allStates = getAllStates();
  const stateName = allStates.find(s => getStateSlug(s) === state) || state.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const seoData = getMassageStateSeoData(stateName);

  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    keywords: seoData.metaKeywords,
    alternates: {
      canonical: `https://callgirl4u.com/massage/state/${state}`,
    }
  };
}

export default async function MassageStatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;

  // Find original state name from slug
  const allStates = getAllStates();
  const stateName = allStates.find(s => getStateSlug(s) === state) || state.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const cities = locations[stateName] || [];
  
  // Use unique seed prefix for massage to show different images than other categories
  const seedKey = `msg-${state}`;
  const profileImages = getDeterministicImagesPool(seedKey, 12);
  const defaultNames = ["Priya", "Neha", "Kajal", "Simran", "Riya", "Pooja", "Deepika", "Nisha", "Aarti", "Meera"];

  // Fetch global phone from KV
  const globalPhone = await cachedGetValue("contact_phone");

  // Get rich SEO content
  const seoData = getMassageStateSeoData(stateName);

  // Dynamic Schema for SEO (CollectionPage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoData.h1,
    "description": seoData.metaDescription,
    "url": `https://callgirl4u.com/massage/state/${state}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": profileImages.length,
      "itemListElement": profileImages.map((imgPath, index) => {
        const adId = `msg-${state}-${index}`;
        const adName = defaultNames[index % defaultNames.length];
        const price = getPriceFromId(adId);
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "LocalBusiness",
            "name": `${adName} - ${stateName} Massage Therapist`,
            "image": `https://callgirl4u.com${imgPath}`,
            "telephone": getContactNumber(adId, globalPhone),
            "priceRange": `INR ${price}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": cities[index % cities.length] || stateName,
              "addressRegion": stateName,
              "postalCode": (110001 + (getHash(cities[index % cities.length] || stateName) % 889999)).toString(),
              "streetAddress": `${cities[index % cities.length] || stateName} City Center`,
              "addressCountry": "IN"
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

      {/* Breadcrumb */}
      <section className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500">
        <Link href="/" className="hover:text-red-600">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/massage" className="hover:text-red-600">Massage Service</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{stateName}</span>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Cities in this State */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-xl mb-4 text-gray-900 border-b pb-2">Cities in {stateName}</h3>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {cities.map((city) => (
                <Link 
                  key={city} 
                  href={`/massage/${getCitySlug(city)}`}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium"
                >
                  {city} Massage
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content: Featured Profiles in State & SEO Article */}
        <main className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Rated Massage Therapists in {stateName}</h2>
          
          {profileImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {profileImages.map((imgPath, index) => {
                const adId = `msg-${state}-${index}`;
                const adName = defaultNames[index % defaultNames.length];
                const adTitle = `${adName} - Massage Therapist`;
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

          {/* State SEO Text Block */}
          <article className="mt-16 prose prose-lg prose-red max-w-none text-gray-800 border-t pt-8">
            <h2 className="text-2xl mb-4">{seoData.introHeading}</h2>
            <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.introText }} />

            {/* Safe Dating & Anti-Scam Advisory */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8 not-prose">
              <h3 className="text-lg font-bold text-amber-800 mb-2 mt-0 flex items-center gap-2">
                ⚠️ Safe Booking Advisory for {stateName} Massage
              </h3>
              <p className="text-gray-700 text-sm mb-3">
                To ensure a genuine, safe massage experience in <strong>{stateName}</strong>:
              </p>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1.5">
                <li><strong>Never Pay Upfront:</strong> No legitimate massage provider requires advance payment via UPI, Paytm, or bank transfer. Always pay cash after service.</li>
                <li><strong>Verify Therapist:</strong> Confirm the therapist matches their verified profile photos before the session starts.</li>
                <li><strong>Choose Safe Venues:</strong> Arrange sessions at reputable hotels or secure private residences.</li>
                <li><strong>Report Scams:</strong> Use the <strong>"Report Profile"</strong> button to flag suspicious listings or advance payment demands immediately.</li>
              </ul>
            </div>

            <h2 className="text-2xl mb-4">{seoData.typesHeading}</h2>
            <div className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.typesText }} />

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
                    <th className="p-4 font-semibold text-gray-700">Massage Type</th>
                    <th className="p-4 font-semibold text-gray-700">1 Hour</th>
                    <th className="p-4 font-semibold text-gray-700">2 Hours</th>
                    <th className="p-4 font-semibold text-gray-700">Full Night</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-4">Full Body Relaxation Massage</td>
                    <td className="p-4">₹1,500</td>
                    <td className="p-4">₹2,500</td>
                    <td className="p-4">₹5,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4">B2B / Body-to-Body Massage</td>
                    <td className="p-4">₹2,500</td>
                    <td className="p-4">₹4,000</td>
                    <td className="p-4">₹8,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4">Happy Ending / Sensual Massage</td>
                    <td className="p-4">₹3,000</td>
                    <td className="p-4">₹5,000</td>
                    <td className="p-4">₹10,000</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4">VIP Companion Spa in {stateName}</td>
                    <td className="p-4">₹5,000</td>
                    <td className="p-4">₹8,000</td>
                    <td className="p-4">₹15,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl mb-4">{seoData.privacyHeading}</h2>
            <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.privacyText }} />

            <h2 className="text-2xl mb-6">{seoData.faqHeading}</h2>
            <div className="space-y-4 mb-10">
              {seoData.faqs.map((faq: { q: string; a: string }, i: number) => (
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Tags</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {([
                `Massage in ${stateName}`,
                `${stateName} Massage Service`,
                `Body Massage ${stateName}`,
                `Female to Male Massage ${stateName}`,
                `Massage Parlour ${stateName}`,
                `Full Body Massage ${stateName}`,
                `Spa in ${stateName}`,
                `Russian Massage ${stateName}`,
                `Sensual Spa ${stateName}`,
                `Massage Near Me`,
              ] as string[]).map((tag, i) => {
                const colors = [
                  'bg-red-600','bg-orange-500','bg-blue-700','bg-green-700',
                  'bg-gray-800','bg-red-700','bg-orange-600','bg-blue-600',
                  'bg-green-600','bg-rose-600','bg-indigo-700','bg-amber-600',
                ];
                return (
                  <Link
                    key={i}
                    href={`/massage/state/${state}`}
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
                  `Massage In ${stateName}`,
                  `Massage Near Me`,
                  `Massage Service In ${stateName}`,
                  `Body Massage In ${stateName}`,
                  `Massage Parlour In ${stateName}`,
                  `Full Body Massage In ${stateName}`,
                  `Spa In ${stateName}`,
                  `Female To Male Massage ${stateName}`,
                  `B2B Massage ${stateName}`,
                  `Massage Service Contact Number ${stateName}`,
                  `Massage Price ${stateName}`,
                  `Massage Near Me`,
                  `${stateName} Massage`,
                  `Massage Service Near Me`,
                  `Cheap Massage Near Me`,
                  `Massage Rate ${stateName}`,
                  `Massage Service Rate ${stateName}`,
                  `Massage Center In ${stateName}`,
                  `Best Spa In ${stateName}`,
                  `Low Price Massage ${stateName}`,
                  `${stateName} Massage Service`,
                  `Massage Phone Number ${stateName}`,
                  `Spa Near Me`,
                  `${stateName} Massage Center`,
                  `Russian Massage ${stateName}`,
                  `Massage Low Price ${stateName}`,
                  `Massage Service In ${stateName}`,
                  `Near me Massage`,
                  `Massage Photo ${stateName}`,
                  `Body Massage Phone Number ${stateName}`,
                  `Spa Services In ${stateName}`,
                  `Low Rate Massage ${stateName}`,
                  `Massage Low Rate ${stateName}`,
                  `Massage Escort Service ${stateName}`,
                  `Cheap Rate Massage ${stateName}`,
                  `Night Massage ${stateName}`,
                  `Nearest Massage ${stateName}`,
                  `Massage Parlours Near Me`,
                  `Low Cost Massage ${stateName}`,
                  `Spa Massage ${stateName}`,
                  `Near By Massage ${stateName}`,
                  `Massage Services ${stateName}`,
                  `Massage Agent Number ${stateName}`,
                  `Cheapest Massage ${stateName}`,
                ] as string[]).map((tag, idx, arr) => (
                  <span key={idx}>
                    <Link
                      href={`/massage/state/${state}`}
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
