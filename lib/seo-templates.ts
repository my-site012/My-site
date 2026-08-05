import { CitySEOContent } from "./data/cityContent";

export const metaTitles = [
  "Call Girls in (City) | Verified Companion Directory | CallGirl4U",
  "Verified Independent Call Girls in (City) | Cash on Delivery",
  "Call Girls in (City) - Direct WhatsApp Contact & Real Photos",
  "Find Independent Companions in (City) | Zero Advance Fees",
  "Call Girls Directory (City) | Genuine Independent Profiles"
];

export const metaDescriptions = [
  "Find verified independent call girls in (City). Browse authentic photos, direct WhatsApp contact, and cash on delivery booking with zero advance payment.",
  "Looking for genuine companions in (City)? Connect directly with independent models and female escorts with complete privacy.",
  "Explore active call girl listings in (City). Direct contact, transparent rates, and 100% cash-on-meeting policy for safe booking.",
  "Browse verified female companions in (City). Direct WhatsApp booking with zero deposit or upfront charges. 24/7 doorstep service.",
  "Connect with high-class independent call girls in (City). Verified profiles, discreet meetings, and cash payment upon arrival."
];

/**
 * Returns a deterministic SEO template based on the city name
 */
export function getCitySeo(city: string) {
  // Use a simple hash based on city string length and characters to pick a template
  const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const titleIndex = hash % metaTitles.length;
  const descIndex = hash % metaDescriptions.length;
  
  const cityName = city.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  
  return {
    title: metaTitles[titleIndex].replace(/\(City\)/g, cityName),
    description: metaDescriptions[descIndex].replace(/\(City\)/g, cityName)
  };
}

export function getCityHash(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function parseSpintax(text: string, seed: number): string {
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

export function getDefaultSeoData(cityName: string, state: string): CitySEOContent {
  const hash = getCityHash(cityName);
  
  const titleIndex = hash % metaTitles.length;
  const descIndex = hash % metaDescriptions.length;

  const metaTitleTemplate = metaTitles[titleIndex].replace(/\(City\)/g, cityName);
  const metaDescriptionTemplate = metaDescriptions[descIndex].replace(/\(City\)/g, cityName);

  const metaKeywordsTemplate = `${cityName} Call Girls, Call Girl in ${cityName}, Independent Companions ${cityName}, Escort Service ${cityName}, Verified Female Escorts, Cash on Delivery`;

  const h1Template = hash % 2 === 0 
    ? `Call Girls in ${cityName} — Verified Independent Companions` 
    : `Verified Independent Call Girls in ${cityName} | Cash on Delivery`;

  const heroSubtextTemplate = `{Discover|Explore|Find} {verified|genuine|premium} <strong class="font-bold">Call Girls in ${cityName}</strong> with direct WhatsApp contact. {Our directory features|We list} independent companions, local college models, and VIP escorts available for incall and outcall meetings across ${state}. All bookings operate on a strict <strong class="font-bold">Cash on Delivery</strong> policy with zero advance payment.`;

  const introHeadingTemplate = hash % 2 === 0 
    ? `Verified Companions in ${cityName}` 
    : `Independent Call Girls in ${cityName} — Direct Booking`;

  const introTemplate = `{Welcome to CallGirl4U's directory for|Browse our verified listings of} <strong class="font-bold">Call Girls in ${cityName}</strong>. Whether you are visiting ${cityName} for business or residing locally, our portal helps you connect directly with genuine independent companions. All listings are managed directly by providers with verified photos and direct WhatsApp numbers. We strictly prohibit advance payments or deposit demands, ensuring a transparent and scam-free experience. Choose from diverse categories including college companions, mature ladies, and high-profile international models for discreet hotel or residential outcall service.`;

  const whyChooseHeadingTemplate = `Why Choose CallGirl4U in ${cityName}`;

  const whyChooseTemplate = `<p class="mb-4">Our platform prioritizes client safety, privacy, and direct communication. Here is why users choose our directory in ${cityName}:</p>
<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Verified Profiles:</strong> Manual review of listings to ensure genuine photos and active contact details.</li>
  <li><strong>Cash on Delivery (COD):</strong> Pay only in cash after meeting your companion in person. Never send advance deposits or registration fees online.</li>
  <li><strong>Direct WhatsApp Contact:</strong> Connect directly with independent models without middleman commissions or agency markups.</li>
  <li><strong>Complete Confidentiality:</strong> We enforce zero-log privacy protocols so your personal information remains 100% private.</li>
</ul>`;

  const typesHeadingTemplate = `Available Companion Categories in ${cityName}`;

  const typesTemplate = `Companions in ${cityName} offer flexible date arrangements to match your preferences:
<ul class="list-disc pl-5 space-y-2 mt-2">
  <li><strong>College Companions:</strong> Young, energetic ladies perfect for casual dates, evening outings, or social events.</li>
  <li><strong>Mature & Housewife Companions:</strong> Warm and experienced women offering relaxing girlfriend experience (GFE) meetings.</li>
  <li><strong>VIP & Russian Models:</strong> Premium international and high-profile models for luxury hotel dates and corporate events.</li>
  <li><strong>Independent Escorts:</strong> Self-managed profiles offering customized date packages across ${cityName}.</li>
</ul>`;

  const bookingHeadingTemplate = `How to Book a Companion in ${cityName}`;

  const bookingStepsTemplate = `<p class="mb-4">Follow these simple steps for a secure date in ${cityName}:</p>
<ol class="list-decimal pl-5 space-y-2">
  <li><strong>Select a Profile:</strong> Browse active companion cards and review photos, service preferences, and rates.</li>
  <li><strong>Contact via WhatsApp:</strong> Click the direct WhatsApp button to initiate a conversation with your chosen provider.</li>
  <li><strong>Agree on Details:</strong> Confirm meeting time, location (hotel or home outcall), and agreed rates without transferring any deposit.</li>
  <li><strong>Meet & Pay Cash:</strong> Meet in a safe venue and complete payment face-to-face in cash after verification.</li>
</ol>`;

  const areasHeadingTemplate = `Service Coverage in ${cityName}`;

  const areasTemplate = `Our directory covers major commercial, residential, and hotel zones across ${cityName}. Whether staying at a central hotel or private residence in ${state}, companions are available for prompt outcall delivery. Always confirm exact location details directly with your companion via WhatsApp.`;

  const rateHeadingTemplate = `Call Girl Rates & Pricing Guide in ${cityName}`;

  const rateIntroTemplate = `Rates in ${cityName} vary based on session duration, provider category, and service type. All prices are determined independently by providers. Always follow our Cash on Delivery policy—never transfer advance booking or security fees online before meeting.`;

  const privacyHeadingTemplate = `Privacy & Security Standards`;

  const privacyTemplate = `We operate on a zero-log infrastructure. We do not require user account creation, store search histories, or retain personal data. Cash transactions eliminate credit card statements, ensuring total discretion for both clients and independent providers in ${cityName}.`;

  const faqHeadingTemplate = `Frequently Asked Questions — ${cityName} Directory`;

  const faq1_q = `Are companion profiles in ${cityName} verified?`;
  const faq1_a = `Yes. Listings undergo manual screening to verify photo authenticity and active contact numbers in ${cityName}. Users can report suspicious ads anytime.`;

  const faq2_q = `Is advance payment required before meeting in ${cityName}?`;
  const faq2_a = `No. We follow a strict Cash on Delivery policy. Never pay advance deposit, registration fees, or card charges online. Pay only in cash after meeting.`;

  const faq3_q = `What companion categories are available in ${cityName}?`;
  const faq3_a = `Listings feature college companions, mature housewives, independent models, and VIP international escorts across ${cityName}.`;

  const faq4_q = `Are outcall services available to hotels in ${cityName}?`;
  const faq4_a = `Yes, independent companions offer outcall services to major hotels, guest houses, and private residences throughout ${cityName}.`;

  const hinglishTemplate = `<p class="mb-4"><strong>${cityName} Call Girl Directory:</strong> Agar aap ${cityName} me verified independent companions dhoondh rahe hain, toh CallGirl4U aapko direct WhatsApp contact provide karta hai. Yahan sabhi profiles active hain aur zero advance payment model par kaam karti hain.</p>

<p class="mb-4">Hamare portal par College Girls, Housewife Companions, aur VIP Models ki categories available hain. Aap bina kisi middleman ke direct companion se chat karke timing aur location confirm kar sakte hain.</p>

<p class="mb-4"><strong>Safety Precaution:</strong> Kisi bhi provider ko online advance fee, travel charges ya medical card ke naam par advance payment mat karein. Hamesha face-to-face milne ke baad hi cash payment karein.</p>

<p class="mb-4">${cityName} ke sabhi main areas aur top hotels me outcall service available hai. Profile select kijiye aur direct WhatsApp button se companion se connect kijiye.</p>`;

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
