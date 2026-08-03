import { getAllCities, getCitySlug, getStateFromCity, locations, EXTENDED_CITIES, isExtendedCity } from "@/lib/data/locations";
import AdCard from "@/components/AdCard";
import Link from "next/link";
import type { Metadata } from "next";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId, getContactNumber, getHash } from "@/lib/ad-logic";
import { cachedGetValue, getJson, lRange, kvCommand } from "@/lib/kv";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data/blogPosts";

const validSlugs = new Set([
  ...getAllCities().map(city => getCitySlug(city)),
  ...EXTENDED_CITIES.map(city => getCitySlug(city)),
]);

// ISR: revalidate every hour — content is deterministic, no need to re-render on every request
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const main = getAllCities().map(city => ({ city: getCitySlug(city) }));
  const extended = EXTENDED_CITIES.map(city => ({ city: getCitySlug(city) }));
  return [...main, ...extended];
}

function getCityHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 7; // Different offset than call-girls for different content
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

function getMassageSeoData(cityName: string, state: string) {
  const hash = getCityHash(cityName);

  const metaTitleTemplate = hash % 2 === 0
    ? `Massage Service in ${cityName} ❤️ Full Body Spa & Female to Male Massage`
    : `${cityName} Massage Girls | Best Body Massage Parlour Near You`;

  const metaDescriptionTemplate = hash % 3 === 0
    ? `Book verified full body massage service in ${cityName}. Professional female to male massage at home or hotel. Sensual & relaxing body spa with cash on delivery.`
    : `Find top-rated massage parlour in ${cityName} with direct WhatsApp contact. Full body, B2B, & relaxation massage available 24/7 in ${cityName}.`;

  const metaKeywords = `Massage in ${cityName}, ${cityName} Massage Service, Body Massage ${cityName}, Female to Male Massage ${cityName}, Massage Parlour ${cityName}, Full Body Massage ${cityName}, Spa in ${cityName}`;

  const h1Template = hash % 2 === 0
    ? `Full Body Massage in ${cityName} ❤️ Best Spa & Massage Service`
    : `Massage Service in ${cityName} | Female to Male Body Spa`;

  const heroSubtextTemplate = `{Discover|Find|Book|Explore} {verified|genuine|professional|trained} <strong class="font-bold">Massage Service in ${cityName}</strong>. {Connect directly|Get in touch} with {experienced|skilled|trained} massage therapists via {direct WhatsApp|phone number}. {Our directory features|Browse through} {relaxing full body massages, sensual B2B massage, aromatherapy spa, and home massage delivery|body-to-body spa, deep tissue massage, and outcall home massage services} available {24/7|round-the-clock} in ${cityName}. All {sessions|bookings} are {based on|conducted via} <strong class="font-bold">Cash on Delivery</strong> — {no advance payment required|zero deposit needed}.`;

  const introHeading = hash % 2 === 0
    ? `Best Massage Parlour in ${cityName} — Verified & Trusted`
    : `Top Massage Service in ${cityName} | Home & Hotel Delivery`;

  const introText = `{Welcome to the premier|Discover the leading} directory for booking {premium|professional|relaxing} <strong class="font-bold">Massage Service in ${cityName}</strong>. Whether you are {looking for a relaxing full body massage after a long day|seeking a rejuvenating spa experience}, our platform connects you directly with {certified therapists and independent massage providers|experienced massage specialists} across the city. We feature {verified|genuine} profiles of {female massage therapists|trained spa professionals} who offer services ranging from {traditional Indian massage|body-to-body massage|aromatherapy} to {deep tissue therapy|Swedish relaxation massage|sensual companion massage}. All services are {offered with cash-on-delivery|available with zero advance payment} so you {never have to worry about online fraud|pay only after complete satisfaction}. Our directory covers ${state} with {doorstep home delivery|hotel room service} in all major localities.`;

  const typesHeading = `Types of Massage Available in ${cityName}`;
  const typesText = `{Our ${cityName} massage directory features diverse service options:}
<ul class="list-disc pl-5 space-y-2 mt-2">
  <li><strong>{Full Body Massage|Swedish Massage}:</strong> {A deeply relaxing, head-to-toe massage targeting muscle tension and stress relief. Perfect for business travelers and locals seeking relaxation.|Classic relaxation massage using long, flowing strokes to ease muscle tension and improve circulation.}</li>
  <li><strong>{B2B Massage|Body to Body Massage}:</strong> {An intimate and sensual massage where the therapist uses her full body to deliver a deeply pleasurable relaxation experience.|Exclusive skin-to-skin massage technique providing maximum relaxation and sensory pleasure.}</li>
  <li><strong>{Aromatherapy Spa|Thai Massage}:</strong> {Using essential oils and herbal extracts for a multi-sensory relaxation experience that calms the mind and body.|Traditional techniques combined with acupressure points for deep muscle relief and flexibility.}</li>
  <li><strong>{Happy Ending Massage|Sensual Companion Massage}:</strong> {A full relaxation massage session that ends with a pleasurable climax for complete satisfaction and stress relief.|An intimate massage experience offered by professional companions in a private, comfortable setting.}</li>
</ul>
<p class="mt-4">{Browse our verified listings to find the perfect massage experience in ${cityName} matching your preferences and budget. All therapists are {professionally trained|experienced} and {available 24/7|available round-the-clock} for both incall and outcall services.}</p>`;

  const bookingHeading = `How to Book Massage Service in ${cityName}`;
  const bookingText = `<p class="mb-4">{Booking a {professional|verified} massage in ${cityName} is {easy and secure|simple and safe} through our directory:}</p>
<ol class="list-decimal pl-5 space-y-2">
  <li><strong>{Browse Profiles|Select a Therapist}:</strong> {View verified massage therapist profiles with photos, rates, and service descriptions.|Choose from our active listing of trained massage professionals in ${cityName}.}</li>
  <li><strong>{Direct Contact|WhatsApp Connect}:</strong> {Use the direct WhatsApp number to chat with the therapist and discuss your preferred massage type, duration, and location.|Instantly contact the massage provider via phone or WhatsApp without any middlemen.}</li>
  <li><strong>{Confirm Booking|Schedule Session}:</strong> {Agree on the session time, location (home/hotel/parlour), and service package. Never send any advance payment online.|Finalize the massage appointment details without any online transfer of funds.}</li>
  <li><strong>{Enjoy & Pay Cash|Cash on Delivery}:</strong> {Enjoy your full relaxation massage session and pay directly in cash to the therapist after completing the service.|Pay the agreed amount face-to-face in cash only after your massage session is completed.}</li>
</ol>
<p class="mt-4">{This secure, cash-only process ensures you enjoy genuine massage services without any risk of online scam or fraud.}</p>`;

  const areasHeading = `Massage Service Coverage in ${cityName}`;
  const areasText = `{Our verified directory covers all major areas, hotels, and residential localities across <strong class="font-bold">${cityName}</strong> for home and hotel massage delivery. Whether you are staying at a {5-star luxury hotel|guest house|private residence}, our massage therapists can provide {doorstep service|room service} directly. Popular areas for massage home delivery include {business districts, tourist hotspots, and major transit areas|premium hotel zones, corporate hubs, and residential neighborhoods}. Most independent massage providers in ${cityName} can reach your location within {30-45 minutes|an hour}. Always {share your complete address|confirm location details} directly with the therapist via WhatsApp for a smooth, on-time service. Our ${state} region directory ensures you find a {nearby professional|local massage expert} wherever you are in the city.}`;

  const rateHeading = `Massage Service Price List in ${cityName}`;
  const rateIntro = `{The rates for massage services in <strong class="font-bold">${cityName}</strong> vary based on service type, duration, and therapist experience. The following is an estimated price guide. Always confirm actual rates directly with the provider before booking. Strictly follow Cash on Delivery — never pay any advance booking fee, medical card charge, or transport cost online.}`;

  const privacyHeading = `Privacy & Discretion for Massage Bookings`;
  const privacyText = `{Your privacy is our top priority. Our ${cityName} massage directory operates on a {strict no-logs policy|complete anonymity basis}, meaning we {don't store your browsing data|never track your searches or location}. All communication is {direct between you and the massage provider|completely private and end-to-end}. By using {cash-only payment|Cash on Delivery}, there are no {bank statements or credit card trails|online payment records} linking you to the service. Your {identity|personal information} is fully protected at all times. Enjoy {complete discretion|100% privacy} while booking your ${cityName} massage service.}`;

  const faqHeading = `FAQs – Massage Service in ${cityName}`;

  const faqs = [
    {
      q: `{Are the massage therapists in ${cityName} verified?|How can I confirm the massage providers are genuine?}`,
      a: `{Yes. All massage therapist profiles in our ${cityName} directory are manually reviewed for photo authenticity and contact verification. Report any suspicious listing using the flag button.|Our team manually verifies profile photos and contact details for all massage providers listed in ${cityName}.}`
    },
    {
      q: `{Do I need to pay advance for massage service in ${cityName}?|Is there any upfront booking fee required?}`,
      a: `{Absolutely not. We strictly enforce Cash on Delivery. Never pay any advance fee, transport charges, or medical card fee online before your session.|No advance payment is needed. Always pay the massage therapist directly in cash after your session is complete.}`
    },
    {
      q: `{What massage types are available in ${cityName}?|Which massage services can I book?}`,
      a: `{Our ${cityName} directory offers full body massage, B2B massage, aromatherapy spa, Swedish relaxation, deep tissue massage, and sensual companion massage.|Various options are available including traditional Indian massage, body-to-body spa, happy ending massage, and home delivery massage.}`
    },
    {
      q: `{Can I get massage service delivered to my hotel in ${cityName}?|Is home/hotel outcall massage available?}`,
      a: `{Yes. Most massage providers in ${cityName} offer hotel and home outcall services throughout the city and nearby areas. Confirm your location directly via WhatsApp.|Outcall home and hotel delivery massage is available across ${cityName} and ${state}. Contact the therapist directly to arrange.}`
    }
  ];

  const hinglishText = `{<p class="mb-4"><strong>${cityName} Massage Service</strong> ki talash ab aasaan ho gayi hai. Hamari website par aapko milenge <strong>verified aur professional massage therapists</strong> ke direct <strong>WhatsApp numbers</strong>. Agar aap ${cityName} mein hain aur ek relaxing full body massage ya B2B massage ka experience lena chahte hain, toh aap bilkul sahi jagah par hain.</p>

<p class="mb-4">Hamari directory par aapko milegi poori variety jaise <strong>Full Body Massage</strong>, <strong>Body to Body Massage</strong>, <strong>Aromatherapy Spa</strong>, aur <strong>Happy Ending Massage</strong>. Yahan sabhi massage providers apni profile khud manage karti hain, isliye kisi middleman ya agency ko extra commission dene ki bilkul zarurat nahi hai.</p>

<p class="mb-4">Sabse zaroori baat — hamesha <strong>Cash on Delivery</strong> ka use karein. Internet par bahut se fraud log booking fee, medical card charges ya transport charges ke naam par advance payment mangte hain. Hum aapko sakht salah dete hain ki kisi ko bhi online advance payment na karein. Massage session complete hone ke baad hi cash payment karein.</p>

<p class="mb-4">Aap apne hotel ya ghar par home delivery massage book kar sakte hain. ${cityName} ke sabhi major areas mein 24 ghante service available hai. Bas profile select karein, WhatsApp karein aur apna appointment confirm karein. Aapki privacy aur discretion hamari top priority hai.</p>

<p class="mb-4">Hum regularly apna database update karte hain taaki aapko ${cityName} mein fresh aur active massage profiles milein. Sahi companion choose karein, safe rahen, aur <strong>${cityName} massage service</strong> ka premium experience enjoy karein bina kisi online fraud ke darr ke!</p>|<p class="mb-4">Agar aap <strong>${cityName} mein best massage service</strong> dhundh rahe hain, toh hamara portal aapka sabse bada helper hai. Yahan par aapko milenge experienced <strong>female massage therapists</strong> ke direct <strong>WhatsApp numbers</strong> jo bina kisi registration ke accessible hain.</p>

<p class="mb-4">Hamare ${cityName} massage directory mein aapko milega — <strong>Full Body Massage</strong>, sensual <strong>B2B Massage</strong>, traditional <strong>Indian Spa</strong>, aur <strong>Happy Ending Massage</strong> — sabhi services ek hi jagah par. Sabhi profiles manually verified hain aur regularly update kiye jaate hain.</p>

<p class="mb-4">Kisi bhi advance payment se bachein. Hamari directory par listed koi bhi genuine therapist advance booking fee nahi maangti. Hum hamesha <strong>Cash on Delivery</strong> ko promote karte hain jisse aapka paisa aur privacy dono 100% safe rehte hain.</p>

<p class="mb-4">${cityName} ke premium hotels ya aapke ghar par doorstep massage delivery available hai. Apni pasandida profile choose karein, seedha WhatsApp karein aur apna relaxation session enjoy karein. Fraud profile report karne ke liye listing par diye gaye report button ka use karein.</p>

<p class="mb-4">Hamara aim hai aapko ${cityName} mein ek safe, premium, aur trusted massage experience dena — bina kisi jhanjhat ke. Verified profiles browse karein aur ek relaxing companion ke sath full satisfaction enjoy karein!</p>}`;

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

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const state = getStateFromCity(city) || "India";

  // Extended cities — different meta wording
  if (isExtendedCity(city)) {
    return {
      title: `Massage Service in ${cityName} | Body Spa | CallGirl4U`,
      description: `Find verified massage therapists in ${cityName} with direct WhatsApp contact. Full body massage, B2B spa, and home delivery available in ${cityName}, ${state}. Cash on delivery only.`,
      keywords: `Massage in ${cityName}, ${cityName} Massage Service, Body Massage ${cityName}, Female Massage ${cityName}, Spa ${cityName}`,
      alternates: { canonical: `https://callgirl4u.com/massage/${city}` },
    };
  }

  const seoData = getMassageSeoData(cityName, state);
  return {
    title: seoData.metaTitle,
    description: seoData.metaDescription,
    keywords: seoData.metaKeywords,
    alternates: {
      canonical: `https://callgirl4u.com/massage/${city}`,
    }
  };
}

export default async function MassageCityPage({ params, searchParams }: { params: Promise<{ city: string }>, searchParams: Promise<{ page?: string }> }) {
  const { city } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const adsPerPage = 12;

  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const state = getStateFromCity(city) || "India";

  // Find related blog posts for this city or category
  const relatedBlogs = blogPosts
    .filter(post => post.category === "massage" && (post.citySlug === city || getCitySlug(post.cityName) === city))
    .slice(0, 3);
  
  const fallbackBlogs = relatedBlogs.length > 0 
    ? relatedBlogs 
    : blogPosts.filter(post => post.category === "massage").slice(0, 3);

  const seoData = getMassageSeoData(cityName, state);
  const isExt = isExtendedCity(city);

  const totalAdsToShow = 48;

  const globalPhone = await cachedGetValue("contact_phone");
  const effectivePhone = globalPhone || undefined;

  // Fetch approved ads from KV
  let approvedAds: any[] = [];
  try {
    const approvedAdIds = await lRange(`ads:approved:massage:${city}`, 0, -1);
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
        await kvCommand(["LREM", `ads:approved:massage:${city}`, 0, adId]);
      }
    }
  } catch (err) {
    console.error("Failed to load approved ads:", err);
  }

  // Use different seed prefix for massage to show different images than call-girls
  const seedKey = `msg-${city}`;
  const cityImages = getDeterministicImagesPool(seedKey, totalAdsToShow);

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
      isMassage: true
    };
  });

  // Map deterministic ads to Card format
  const deterministicCards = cityImages.map((imgPath, index) => {
    const overallIndex = index;
    const adId = `msg-${city}-${overallIndex}`;
    const adName = getNameFromId(adId);
    const adTitle = `${adName} - Massage Therapist`;
    const price = getPriceFromId(adId);
    return {
      id: adId,
      title: adTitle,
      price: price,
      imagePath: imgPath,
      location: cityName,
      phone: effectivePhone,
      isMassage: true
    };
  });

  // Merge approved ads at the beginning
  const allCards = [...approvedCards, ...deterministicCards];
  const paginatedCards = allCards.slice((currentPage - 1) * adsPerPage, currentPage * adsPerPage);
  
  const totalPages = Math.max(1, Math.ceil(allCards.length / adsPerPage));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoData.h1,
    "description": seoData.metaDescription,
    "url": `https://callgirl4u.com/massage/${city}`,
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

  // FAQ Schema for Google Rich Results (Massage)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is massage service in ${cityName} available at home or hotel?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes. Most massage therapists listed in ${cityName} offer both home delivery and hotel room service. You can confirm the location directly with the therapist via WhatsApp. Services are available 24/7.`
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to pay any advance booking fee for massage service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No advance payment is required. All massage services listed follow a strict Cash on Delivery policy. Pay only in cash after the session is complete. Never transfer money online to any massage provider."
        }
      },
      {
        "@type": "Question",
        "name": `What types of massage are available in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Our ${cityName} massage directory includes Full Body Massage, B2B (Body to Body) Massage, Swedish Massage, Aromatherapy Spa, Deep Tissue Massage, and Female to Male Massage. All services are offered by trained professionals.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the approximate rate for massage service in ${cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Massage service rates in ${cityName} vary by session type and duration. Standard full body massage starts from approximately INR 1,500 per hour. B2B and special sessions may range from INR 2,500 to INR 6,000. Always confirm rates directly with the therapist.`
        }
      }
    ]
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
              <h1 className="text-3xl text-gray-900 mb-4">Massage Service Available in {cityName}</h1>
              <p className="text-gray-600 text-lg">
                Find <strong>verified massage therapists in {cityName}</strong>, {state} with direct WhatsApp contact.
                Full body massage, B2B spa &amp; home delivery available 24/7. <strong>Cash on delivery</strong> — no advance payment.
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

      {/* Breadcrumb */}
      <section className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500">
        <Link prefetch={false} href="/" className="hover:text-red-600">Home</Link>
        <span className="mx-2">›</span>
        <Link prefetch={false} href="/massage" className="hover:text-red-600">Massage Service</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{cityName}</span>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-gray-900">Massage Therapists in {cityName}</h2>
          <span className="text-gray-500 text-sm">{totalAdsToShow} Profiles (Page {currentPage}/{totalPages})</span>
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
                     isMassage={true}
                   />
                 );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              {currentPage < totalPages ? (
                <Link prefetch={false} href={`/massage/${city}?page=${currentPage + 1}`}
                  className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg flex items-center gap-2">
                  Show More Profiles (Page {currentPage + 1}) →
                </Link>
              ) : (
                <Link prefetch={false} href={`/massage/${city}?page=1`}
                  className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition shadow-lg">
                  ← Back to First Page
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500">No massage profiles found for {cityName} yet.</p>
          </div>
        )}
      </section>

      <article className="max-w-4xl mx-auto px-4 py-12 prose prose-lg prose-red text-gray-800 border-t">
        <h2 className="text-2xl mb-4">{seoData.introHeading}</h2>
        <p className="mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: seoData.introText }} />

        {/* Safety Advisory */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8 not-prose">
          <h3 className="text-lg font-bold text-amber-800 mb-2 mt-0 flex items-center gap-2">
            ⚠️ Safe Booking Advisory for {cityName} Massage
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            To ensure a genuine, safe massage experience in <strong>{cityName}</strong>:
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
                <td className="p-4">VIP Companion Spa in {cityName}</td>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Related Tags</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            `Massage in ${cityName}`,
            `${cityName} Massage Service`,
            `Body Massage ${cityName}`,
            `Spa in ${cityName}`,
            `Female to Male Massage ${cityName}`,
            `B2B Massage ${cityName}`,
            `Happy Ending Massage ${cityName}`,
            `Home Massage ${cityName}`,
            `Hotel Massage ${cityName}`,
            `Full Body Massage ${cityName}`,
          ] as string[]).map((tag, i) => {
            const colors = [
              'bg-purple-700','bg-pink-600','bg-blue-700','bg-teal-700',
              'bg-indigo-700','bg-violet-700','bg-pink-700','bg-blue-600',
              'bg-teal-600','bg-purple-600',
            ];
            return (
              <Link prefetch={false} key={i}
                href={`/massage/${city}`}
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
              `Massage in ${cityName}`,
              `${cityName} Massage Service`,
              `Body Massage ${cityName}`,
              `Spa in ${cityName}`,
              `Female to Male Massage ${cityName}`,
              `B2B Massage ${cityName}`,
              `Happy Ending Massage ${cityName}`,
              `Home Massage ${cityName}`,
              `Hotel Massage ${cityName}`,
              `Full Body Massage ${cityName}`,
              `Massage Parlour in ${cityName}`,
              `Male to Female Massage ${cityName}`,
              `Sensual Massage ${cityName}`,
              `Massage Service near me`,
              `Therapists in ${cityName}`,
              `Swedish Massage ${cityName}`,
              `Deep Tissue Massage ${cityName}`,
              `Aromatherapy Massage ${cityName}`,
              `Thai Massage ${cityName}`,
              `Massage near me`,
              `Massage Center in ${cityName}`,
              `Best Massage in ${cityName}`,
              `Cheap Massage in ${cityName}`,
              `Massage rates in ${cityName}`,
              `VIP Massage ${cityName}`,
              `Verified Massage Parlours ${cityName}`,
              `Independent Massage Therapist ${cityName}`,
              `Private Massage ${cityName}`,
              `Outcall Massage ${cityName}`,
              `Incall Massage ${cityName}`,
              `Massage Contact Number ${cityName}`,
              `Massage WhatsApp Number`,
              `Adult Massage ${cityName}`,
              `Erotic Massage ${cityName}`,
              `Lomi Lomi Massage ${cityName}`,
              `Hot Stone Massage ${cityName}`,
              `Sports Massage ${cityName}`,
              `Foot Massage ${cityName}`,
              `Head Massage ${cityName}`,
              `Back Massage ${cityName}`,
              `Massage for Men in ${cityName}`,
              `Massage for Women in ${cityName}`,
              `Couple Massage ${cityName}`,
              `Massage booking ${cityName}`,
              `Relaxing Massage ${cityName}`,
              `Sandwich Massage ${cityName}`,
              `Nuru Massage ${cityName}`,
              `Nurru Massage in ${cityName}`,
              `Body to Body Massage ${cityName}`,
              `Full Body Massage Center ${cityName}`,
              `Top Massage Spa ${cityName}`,
              `Massage therapy ${cityName}`,
              `Traditional Massage ${cityName}`,
              `Best Spa Service ${cityName}`,
              `Spa Massage Center ${cityName}`,
            ] as string[]).map((tag, idx, arr) => (
              <span key={idx}>
                <Link prefetch={false} href={`/massage/${city}`}
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
                    href={`/massage/${getCitySlug(c)}`}
                    className="text-xs font-semibold text-blue-600 hover:text-red-600 hover:underline py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors capitalize">
                    {c.toLowerCase()} Massage
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Recent Blogs & Guides */}
        {fallbackBlogs.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider text-center">
              Latest Massage Guides & Articles
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
            <Link prefetch={false} href={`/call-boys/${city}`}
              className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              👨 Call Boys in {cityName}
            </Link>
            <Link prefetch={false} href={`/massage`}
              className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-800 hover:text-white transition-all shadow-sm">
              📍 All India Massage Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
