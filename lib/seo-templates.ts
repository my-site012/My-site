import { CitySEOContent } from "./data/cityContent";

export const metaTitles = [
  "Call Girl in (City) | Active (City) Companions & Numbers",
  "Call girl (City) | Independent (City) Companions (COD)",
  "Verified Call Girl in (City) | Local Companions (City) COD",
  "Call girl (City) | Direct (City) Companion Directory 24/7",
  "Top (City) Companions | Independent Call girl (City) 24/7",
  "Genuine (City) Call Girl Number | Cash on Delivery",
  "(City) Call Girls | Verified Independent Escorts & Direct Contact",
  "Independent Call Girl in (City) | VIP Companions 24/7 COD",
  "Top Call Girl Service in (City) | Active Photos & Direct Contact",
  "Hire Call Girl (City) | Direct (City) Call Girl Number COD",
  "(City) Escort Service | Verified Independent Call Girls (City)",
  "College Call Girls in (City) | Direct Contact 24/7",
  "VIP Independent Call Girl (City) | Safe Hotel & Outcall Delivery",
  "Verified (City) Call Girls Number | Cash On Delivery Escorts",
  "Top Rated Call Girl in (City) | Direct Model Contact (No Advance)",
  "(City) Call Girl Contact Number | 24/7 Independent Escorts COD",
  "Exclusive Call Girls in (City) | Verified Female Escort Service",
  "Russian & Model Call Girl in (City) | VIP Escort Service COD",
  "Browse Call Girl (City) | Active (City) Numbers & Photos",
  "24/7 Call Girl in (City) | Genuine Independent Companion (COD)",
  "Housewife & College Call Girls (City) | Direct Phone Contact",
  "Discreet Call Girl Service in (City) | Cash On Delivery Escorts",
  "(City) Female Escorts | Top Rated Call Girl in (City) 24/7",
  "Authentic Call Girl in (City) | Active Photo Profiles COD",
  "Premium Escort Service (City) | Independent Call Girls (City)"
];

export const metaDescriptions = [
  "Looking for a Call Girl in (City)? Connect with verified (City) call girl profiles. Independent companions with privacy and cash on delivery.",
  "Browse independent Call Girl in (City) listings. Real photos of companions with direct contact and zero advance payment.",
  "Explore verified (City) Escort service. Connect with local independent Call girl (City) companions. Genuine profiles, cash payment on meeting.",
  "Top-rated Escort service (City) with verified Call Girl in (City). Direct (City) call girl number, no upfront fees, safe hotel & doorstep meetings 24/7.",
  "Book verified Call girl (City) models. Reach out via (City) call girl number for a memorable companion experience. Safe (City) Escort service cash on delivery.",
  "Find active Call Girls in (City) with verified (City) Call Girl Number. Independent college models and VIP escorts with zero upfront charge.",
  "Looking for top Call Girl service in (City)? Direct phone contact with verified independent escorts. Strictly cash on delivery with complete privacy.",
  "Browse active Call Girl in (City) profiles with genuine photos. Connect via direct phone or call for safe hotel and doorstep outcalls across (City).",
  "Get direct (City) call girl number without agency middlemen. Verified female companions, college models, and Russian escorts. Cash on delivery 24/7.",
  "Connect with independent Call Girls in (City). Active photos, direct phone contact, transparent rates, zero advance fees. Safe in-person companion booking across (City).",
  "Verified (City) Escort service offering independent companions. Direct phone contact, private hotel room outcalls, and Cash on Delivery in (City).",
  "Discover elite Call Girl in (City) with verified contact details. Discreet companionship for corporate travelers and gentlemen. Pay cash after meeting.",
  "Browse high-class Call Girls in (City) with direct contact. Genuine college girls, mature housewives, and VIP models with zero advance payment.",
  "Top independent Escort service (City). Get authentic (City) Call Girl Number for prompt 30-minute outcall service across all major hotel zones.",
  "Hire verified Call Girl in (City). Authentic photos, active contact details, flexible incall and outcall meetings, and strict cash-on-delivery guarantee.",
  "Find reliable Call Girl service in (City) available 24/7. Connect directly via call or message for dinner dates, night stays, and private sessions.",
  "Explore genuine Call Girls in (City) on CallGirl4U. Direct mobile contact for self-managed female companions. Complete privacy and zero-deposit policy.",
  "Instant access to verified (City) call girl numbers. High-profile models and independent escorts ready for private dates. Safe Cash on Delivery.",
  "Looking for trusted female escorts in (City)? Browse verified profiles with real pictures and direct contact. Pay cash upon companion arrival.",
  "Premier directory for Call Girls in (City). Choose independent college companions and VIP models with direct phone access and transparent cash payment.",
  "Verified independent Call Girl in (City) directory. Zero middleman commission, direct calling, and safe hotel doorstep delivery across (City).",
  "Book verified female companions in (City) today. High-quality profiles with real photos, direct mobile number, and Cash on Delivery with no advance fee.",
  "Find top-tier Escort service in (City) with genuine independent call girls. Connect directly for discreet incall and outcall meetings.",
  "Direct (City) Call Girl Contact Number directory. Genuine verified companions ready for 24/7 hotel outcall service across (City) with zero advance.",
  "Elite independent Call Girls in (City). Browse real companion photos, get direct numbers without agency markup, and settle payment in cash on arrival."
];

/**
 * Returns a deterministic SEO template based on the city name
 */
export function getCitySeo(city: string) {
  const hash = getCityHash(city);
  
  const titleIndex = hash % metaTitles.length;
  const descIndex = (hash + 7) % metaDescriptions.length;
  
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
  const descIndex = (hash + 5) % metaDescriptions.length;

  const metaTitleTemplate = metaTitles[titleIndex].replace(/\(City\)/g, cityName);
  const metaDescriptionTemplate = metaDescriptions[descIndex].replace(/\(City\)/g, cityName);

  const metaKeywordsTemplate = `${cityName} Call Girls, Call Girl in ${cityName}, ${cityName} Call Girls Number, Independent Call Girls ${cityName}, Escort Service ${cityName}, Verified Female Escorts, Cash on Delivery, ${cityName} Female Escorts`;

  const h1Options = [
    `Call Girls in ${cityName} — Verified Independent Companions`,
    `Verified Independent Call Girls in ${cityName} | Cash on Delivery`,
    `${cityName} Call Girls | Direct Contact & Real Photos`,
    `Top Independent Call Girl Service in ${cityName} (COD Available)`,
    `Verified Escort Service in ${cityName} | Direct Companion Booking`
  ];
  const h1Template = h1Options[hash % h1Options.length];

  const heroSubtextTemplate = `{Discover|Explore|Find|Browse|Search for} {verified|genuine|premium|top-rated|trusted} independent <strong class="font-bold">Call Girls in ${cityName}</strong> {with direct|offering instant|providing verified} phone numbers. {Our directory features|We present|Find authentic|Browse our extensive catalog of} local college call girls, mature housewife escorts, and VIP models available for incall and outcall meetings across ${state}. {All bookings operate on a strict|We strictly enforce a|Every meeting follows a|Enjoy complete financial peace of mind with our} <strong class="font-bold">Cash on Delivery</strong> policy with zero advance payment.`;

  const introHeadingOptions = [
    `Verified Call Girl Services in ${cityName}`,
    `Independent Call Girls & Escorts in ${cityName}`,
    `Genuine Call Girl Directory in ${cityName}`,
    `Safe & Confidential Escort Service in ${cityName}`
  ];
  const introHeadingTemplate = introHeadingOptions[hash % introHeadingOptions.length];

  const introTemplate = `<p class="mb-4">{Welcome to the premier directory for|Explore the most trusted platform for|Discover authentic listings of|Browse top-rated profiles for|Connect directly with verified} <strong class="font-bold">Call Girls in ${cityName}</strong>, {where sophistication meets genuine companionship|delivering discreet and high-class companion experiences|offering verified escort services with utmost privacy|ensuring authentic dating and companion arrangements}. {Whether you are traveling to ${cityName} for business meetings|If you are visiting ${cityName} for corporate trips|When traveling across ${cityName} for leisure or work|As a local resident seeking a peaceful date|If you seek an elite companion for dinner or evening events}, {our portal connects you directly with|we provide direct access to|our directory links you with|you can instantly connect with} verified <strong class="font-bold">${cityName} Call Girls</strong>. {All listings provide direct contact details|Every profile is self-managed by independent providers|Our platform ensures zero-middleman communication} featuring genuine photos and transparent details.</p>
<p class="mb-4">{We maintain a strict zero-advance payment policy.|Our platform operates on complete payment transparency.|We enforce a 100% Cash on Delivery framework.|Financial security is guaranteed through cash-only settlement.} {Clients are advised never to transfer|Please refrain from transferring|Never pay any online} booking charges, registration fees, or advance deposits online. All service charges are settled strictly face-to-face in <strong class="font-bold">Cash on Delivery</strong> {after meeting your companion at your chosen venue|upon arrival at your hotel room or residence|in person after physical identity verification} in ${cityName}. {From upscale hotel suites along central avenues to private residential outcalls|Whether at 5-star hotel lounges or private apartments|Across all prime districts and residential areas in ${cityName}}, {our providers offer discretion, warmth, and tailored experiences|companions deliver utmost privacy and memorable experiences|independent escorts guarantee complete confidentiality and personal warmth} suited to your schedule.</p>`;

  const whyChooseHeadingTemplate = `Why Choose CallGirl4U for Call Girls in ${cityName}`;

  const whyChooseTemplate = `<p class="mb-4">{Finding trustworthy companion services requires privacy, safety, and authenticity.|Selecting a reliable escort directory demands complete transparency, safety, and direct communication.|When seeking companionship in ${cityName}, your safety, discretion, and peace of mind come first.} {Here is why gentlemen choose our|Explore why clients rely on our|Gentlemen and travelers trust our} directory for <strong class="font-bold">Call Girls in ${cityName}</strong>:</p>
<ul class="list-disc pl-5 space-y-3 mb-6">
  <li><strong>100% Verified Profiles:</strong> {Manual review of listings to ensure|Every ad undergoes verification for|Thorough screening to confirm} authentic photographs, accurate bio details, and active <strong class="font-bold">${cityName} Call Girls Number</strong>.</li>
  <li><strong>Strict Cash on Delivery (COD):</strong> {Complete financial safety with zero prepayment risks.|Total protection against online deposit frauds.|Zero upfront charges.} You pay only in cash after meeting your companion in person.</li>
  <li><strong>Direct Provider Access:</strong> Connect directly via phone or call {without agency middlemen|bypassing agency markups|with zero middleman commissions}.</li>
  <li><strong>Complete Anonymity & Zero-Log Privacy:</strong> {We do not require user sign-ups|No registration needed|No account creation}, nor do we store browsing logs or retain personal data. Your privacy in ${cityName} is fully protected.</li>
  <li><strong>Flexible In-Call & Out-Call Options:</strong> {Whether you prefer outcall service to 3-star, 4-star, or 5-star hotels|Prompt hotel doorstep outcalls across major hotel zones} in ${cityName} or private incall venues, providers accommodate your needs.</li>
</ul>`;

  const typesHeadingTemplate = `Popular Companion Categories Available in ${cityName}`;

  const typesTemplate = `<div class="space-y-6 mb-8">
  <div>
    <h3 class="text-xl font-bold text-gray-900 mb-2">College Call Girls in ${cityName} (18+ Only)</h3>
    <p class="text-gray-700 leading-relaxed mb-2"><strong class="font-bold">College Call Girls in ${cityName}</strong> {are immensely popular among clients who value|cater to gentlemen seeking|are chosen by clients wanting} youthful energy, contemporary mindsets, and open conversations. These companions are strictly 18+ adult students, well-educated, stylishly groomed, and socially confident. They are ideal for casual dates, coffee hangouts, dinner evenings, or weekend trips across ${cityName}.</p>
    <p class="text-gray-700 leading-relaxed">{Fluent in Hindi and English|Well-spoken and charming|Articulate and friendly}, college escorts bring a cheerful and refreshing presence that makes conversation effortless, blending naturally into upscale hotel lounges or quiet personal dates.</p>
  </div>

  <div>
    <h3 class="text-xl font-bold text-gray-900 mb-2">Mature Housewife Call Girls in ${cityName}</h3>
    <p class="text-gray-700 leading-relaxed mb-2"><strong class="font-bold">Housewife Call Girls in ${cityName}</strong> {are cherished for their emotional maturity|offer remarkable warmth|provide calm understanding}, patience, and understanding of personal companionship. Bringing real-life experience and a nurturing approach, mature escorts offer a relaxed, judgment-free environment where you can unwind without pressure.</p>
    <p class="text-gray-700 leading-relaxed">{Many mature companions are attentive|Respectful of personal boundaries|Valuing privacy and quiet comfort}, providing heartfelt conversation and a peaceful Girlfriend Experience (GFE) for clients seeking comfort and discretion.</p>
  </div>

  <div>
    <h3 class="text-xl font-bold text-gray-900 mb-2">VIP & Model Call Girls in ${cityName}</h3>
    <p class="text-gray-700 leading-relaxed mb-2"><strong class="font-bold">Model Call Girls in ${cityName}</strong> {cater to distinguished gentlemen who desire|are tailored for clients seeking|deliver elite presentation for those wanting} high-class poise, glamour, and exceptional presentation. Featuring polished grooming, elegant styling, and charming social etiquette, these models enhance any luxury setting.</p>
    <p class="text-gray-700 leading-relaxed">{Whether accompanying you to high-end hotel dinners|Ideal for corporate galas|Perfect for luxury resort vacations}, private celebrations, or luxury weekend stays in ${cityName}, VIP companions ensure you feel confident and distinguished.</p>
  </div>

  <div>
    <h3 class="text-xl font-bold text-gray-900 mb-2">Russian & International Escorts in ${cityName}</h3>
    <p class="text-gray-700 leading-relaxed mb-2"><strong class="font-bold">Russian Escorts in ${cityName}</strong> {offer an exclusive international companion experience|deliver a world-class luxury date|provide exotic global charm}. Known for their striking beauty, poised confidence, and global charm, international escorts bring a unique cultural flair to premium dates in ${cityName}.</p>
    <p class="text-gray-700 leading-relaxed">{Well-traveled and open-minded|Sophisticated and glamorous|Polished and discreet}, foreign companions are comfortable in 5-star hotel suites and luxury venues across ${state}.</p>
  </div>

  <div>
    <h3 class="text-xl font-bold text-gray-900 mb-2">Independent Call Girls in ${cityName}</h3>
    <p class="text-gray-700 leading-relaxed"><strong class="font-bold">Independent Call Girls in ${cityName}</strong> manage their own schedules, ensuring direct, transparent, and flexible communication. By accessing direct <strong class="font-bold">${cityName} Call Girls Number</strong>, you enjoy customized date arrangements, clear rate discussions, and genuine personal attention without middleman interference.</p>
  </div>
</div>`;

  const bookingHeadingTemplate = `How to Book Call Girls in ${cityName} — Step-by-Step Guide`;

  const bookingStepsTemplate = `<p class="mb-4">{Booking a verified companion in ${cityName} is simple, safe, and transparent:|Follow these 5 easy steps for a secure companion date in ${cityName}:}</p>
<ol class="list-decimal pl-5 space-y-3 mb-6">
  <li><strong>Browse Verified Listings:</strong> Explore active companion profiles in ${cityName}, reviewing real photos, category details, and service offerings.</li>
  <li><strong>Direct Contact:</strong> Click on the verified <strong class="font-bold">${cityName} Call Girls Number</strong> on the listing card to connect without middleman intervention.</li>
  <li><strong>Confirm Date Details:</strong> Discuss meeting duration, preferred venue (hotel outcall or home delivery in ${cityName}), and agreed service charges.</li>
  <li><strong>Zero Advance Payment:</strong> Never send online money, registration fees, or card charges beforehand. Our directory operates strictly on <strong class="font-bold">Cash on Delivery</strong>.</li>
  <li><strong>Meet & Pay in Cash:</strong> Meet your companion in a secure environment, verify her identity, and settle payment in cash upon arrival.</li>
</ol>`;

  const areasHeadingTemplate = `Local Area Coverage & Outcall Locations in ${cityName}`;

  const areasTemplate = `<p class="mb-4">Our directory covers all prime commercial districts, residential sectors, hotel hubs, and transport centers throughout <strong class="font-bold">${cityName}</strong> and surrounding regions of ${state}. Whether staying at a 3-star business hotel, a 5-star luxury resort, or a private residence, independent companions offer prompt and discreet outcall doorstep service.</p>
<p class="mb-4">Companions are familiar with key localities across <strong class="font-bold">${cityName}</strong>, ensuring punctual arrival and smooth meeting coordination. Always share accurate location details directly with your companion via <strong class="font-bold">${cityName} Call Girls Number</strong> for seamless service.</p>`;

  const rateHeadingTemplate = `Call Girl Rates & Pricing Guide in ${cityName}`;

  const rateIntroTemplate = `Companions in <strong class="font-bold">${cityName}</strong> offer transparent pricing structures based on category, duration, and service type. Below is an estimated pricing guide for reference:`;

  const privacyHeadingTemplate = `Privacy, Security & Zero-Log Standards in ${cityName}`;

  const privacyTemplate = `<p class="mb-4">We prioritize your anonymity above all else. Our portal runs on a zero-log infrastructure—we do not require user account registration, track IP browsing histories, or store personal communication records.</p>
<p class="mb-4">By enforcing cash payments upon meeting in <strong class="font-bold">${cityName}</strong>, bank statement trails and credit card records are completely eliminated, granting total discretion and peace of mind for both clients and independent companions.</p>`;

  const faqHeadingTemplate = `Frequently Asked Questions — ${cityName} Call Girl Directory`;

  const faq1_q = `Are call girl profiles in ${cityName} genuine and verified?`;
  const faq1_a = `Yes. Profiles published on our directory undergo manual screening to verify photo authenticity and active phone/<strong class="font-bold">${cityName} Call Girls Number</strong> details. Suspicious listings can be reported immediately using the 'Report Profile' option.`;

  const faq2_q = `Is advance payment or registration fee required in ${cityName}?`;
  const faq2_a = `No, absolutely not. We enforce a strict Cash on Delivery policy. Never transfer money, travel charges, or security card fees online in advance. Pay only in cash after meeting your companion in person.`;

  const faq3_q = `What companion categories can I find in ${cityName}?`;
  const faq3_a = `Our directory features independent college girls (18+), mature housewives, high-profile models, Russian escorts, and VIP companions across ${cityName}.`;

  const faq4_q = `Are outcall services available to hotels in ${cityName}?`;
  const faq4_a = `Yes, independent companions provide prompt outcall services to major hotels, guest houses, and private residences throughout ${cityName} and surrounding areas.`;

  const hinglishTemplate = `<p class="mb-4"><strong>${cityName} Call Girl Directory Guidelines:</strong> Agar aap ${cityName} me verified independent companions dhoondh rahe hain, toh CallGirl4U aapko direct <strong class="font-bold">${cityName} Call Girls Number</strong> provide karta hai bina kisi agency ya middleman ke.</p>

<p class="mb-4">Hamare portal par <strong class="font-bold">College Call Girls in ${cityName}</strong>, <strong class="font-bold">Housewife Call Girls in ${cityName}</strong>, <strong class="font-bold">Model Call Girls in ${cityName}</strong>, aur <strong class="font-bold">Russian Escorts in ${cityName}</strong> ki rich categories available hain. Aap direct profile par number par call karke companion se chat aur timing confirm kar sakte hain.</p>

<p class="mb-4"><strong>Important Anti-Scam Notice:</strong> Internet par kisi bhi person ko booking fee, medical card fee, ya transport charges ke naam par advance online payment na karein. Hamesha face-to-face milne ke baad hi <strong class="font-bold">Cash on Delivery</strong> payment karein.</p>

<p class="mb-4">${cityName} ke sabhi main areas aur top hotels me outcall doorstep service available hai. Profile select kijiye aur direct <strong class="font-bold">${cityName} Call Girls Number</strong> par call karke companion se connect kijiye.</p>`;

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
