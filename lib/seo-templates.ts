import { CitySEOContent } from "./data/cityContent";

export const metaTitles = [
  "Call Girl in (City) | Hottest (City) call girl number",
  "Call girl (City) ❤️ Premium (City) Escort service (COD)",
  "Verified Call Girl in (City) | Escort service (City) COD",
  "Hottest Call girl (City) | Get (City) call girl number 24/7",
  "Top (City) Escort service | Independent Call girl (City) 24/7"
];

export const metaDescriptions = [
  "Looking for a Call Girl in (City)? Get verified (City) call girl number. Hire independent Call girl (City) profiles with 100% privacy and cash on delivery.",
  "Book premium independent Call Girl in (City) today. Browse real photos of gorgeous models and get direct (City) call girl number with zero advance payment.",
  "Explore verified (City) Escort service. Connect with local independent Call girl (City) companions. 100% genuine profiles, cash payment on meeting.",
  "Top-rated Escort service (City) with verified Call Girl in (City). Direct contact via WhatsApp, no upfront fees, safe hotel & home doorstep delivery 24/7.",
  "Book verified Call girl (City) models. Reach out via (City) call girl number for a memorable companion experience. Safe (City) Escort service cash on delivery."
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

  const metaKeywordsTemplate = `${cityName} Call Girls, Call Girl in ${cityName}, ${cityName} call girl number, Call girl ${cityName}, ${cityName} Escort service, Escort service ${cityName}, Russian Escorts, Independent Escorts in ${cityName}, Call Girl WhatsApp Number, Cash on Delivery, Verified Call Girls`;

  const h1Template = hash % 2 === 0 
    ? `Call Girl in ${cityName} ❤️ Low Cost Verified Escorts` 
    : `Independent Call Girl in ${cityName} | Hottest Escort Service`;

  const heroSubtextTemplate = `{Discover|Explore|Find|Get access to} {verified|genuine|premium|elite} {adult classifieds and|independent} <strong class="font-bold">Call Girl in ${cityName}</strong>. {Connect safely and securely|Experience top-class companionship|Meet premium companions} with direct <strong class="font-bold">Call Girl WhatsApp Numbers</strong>. {Our independent directory covers|We list} {local college girls, professional models, and gorgeous Russian escorts|hottest VIP models, housewife companions, and local independent escorts} available {24/7|round-the-clock} for both {incall and outcall|home and hotel delivery} services. All {meetings|bookings} are {based on|conducted via} <strong class="font-bold">Cash on Delivery</strong> with absolutely {no advance payments|zero upfront fees|no deposit required}. {Your satisfaction and privacy are guaranteed|Enjoy discreet meetings with complete confidentiality}. {Browse through active lists, check photos, and choose the perfect lady for your needs.}`;

  const introHeadingTemplate = hash % 2 === 0 
    ? `Verified Call Girl in ${cityName} — Cash Payment Service` 
    : `Top ${cityName} Escort Service | Verified Companions`;

  const introTemplate = `{Welcome to the ultimate|Welcome to the leading|Introducing the finest} directory for booking high-class <strong class="font-bold">Call Girl in ${cityName}</strong>. If you are {staying in the city|in town for a business trip|a local resident} and looking to {spend a passionate night|relax with a beautiful companion|enjoy romantic moments}, our platform is your {trusted guide|#1 choice}. We feature {100% verified|genuine and active} profiles of <strong class="font-bold">Independent Escorts in ${cityName}</strong> who manage their own listings. {Unlike other agencies|Unlike standard portals}, we do not ask for any {upfront booking fees|advance payments|online deposits}. You can browse through {real photos|verified images} of beautiful models, {select your preferred companion|choose your favorite girl}, and reach her directly on her <strong class="font-bold">Call Girl WhatsApp Number</strong>. Whether you prefer the {youthful charm of local College Girls|mature companionship of Housewife Call Girls|elite experience of premium Russian Escorts}, our directory has a wide selection of profiles tailored to your desires. Every companion listed here is {well-behaved, professional, and dedicated|charming, bold, and fully trained} to provide the ultimate {GFE (Girlfriend Experience)|pleasurable meeting}. Our directory covers all popular localities and hotels across the ${state} region, ensuring {fast delivery within 30 minutes|rapid doorstep service}. Experience an unforgettable night filled with {satisfaction, warmth, and absolute discretion|pleasure, romance, and comfort} with the finest companions. {Our focus is to provide you with verified companions, saving you from online prepayment traps. Relax and enjoy a premium time with gorgeous local ladies.}`;

  const whyChooseHeadingTemplate = `Why Choose CallGirl4U for Call Girl in ${cityName}`;

  const whyChooseTemplate = `<p class="mb-4">{Choosing our directory for hiring a <strong class="font-bold">Call Girl in ${cityName}</strong> ensures a safe, premium, and scam-free experience. Here are the key highlights of our platform:}</p>
<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>{Verified Call Girls|Real Companions}:</strong> {We perform manual verification checks on all ads to ensure the images match the provider.|Every profile card features verified photos to save you from fake listings.}</li>
  <li><strong>{Cash on Delivery (COD)|No Advance Payments}:</strong> {We strictly advise against paying any advance booking fees, medical card charges, or transport fees. You only pay cash face-to-face after meeting your companion.|Safeguard your money by paying only in cash after complete satisfaction.}</li>
  <li><strong>{Direct WhatsApp Access|Fast Contact}:</strong> {Connect instantly using direct <strong class="font-bold">Call Girl WhatsApp Numbers</strong> without any middlemen or agency commissions.|Get direct phone and chat access to independent models immediately.}</li>
  <li><strong>{Absolute Discretion & Privacy|100% Confidentiality}:</strong> {Your privacy is our command. We do not store browsing history, cookies, or user logs. Enjoy your private meetings with zero paper trails.|We guarantee 100% security for both clients and independent providers.}</li>
</ul>
<p class="leading-relaxed">{With these safety features, we stand out as the most trusted platform for <strong class="font-bold">Escort Service in ${cityName}</strong>. Whether you choose an incall meeting or request a hotel delivery, you can enjoy peace of mind knowing you are dealing with genuine providers who prioritize your satisfaction. Our verified profiles undergo rigorous checks to ensure complete alignment with customer demands, giving you a smooth, stress-free time.}</p>`;

  const typesHeadingTemplate = `Categories of Call Girl Available in ${cityName}`;

  const typesTemplate = `{Advertisers in ${cityName} offer diverse companionship styles to suit your personal desires. Our listings feature several categories of companions:}
<ul class="list-disc pl-5 space-y-2 mt-2">
  <li><strong>{College Girls|Young Companions}:</strong> {Perfect for fun, bold, and energetic dates. These college call girls offer refreshing companionship and are open to fun conversations.|Charming and youthful girls who are ready to accompany you for night stays or club dates.}</li>
  <li><strong>{Housewife Call Girls|Mature Ladies}:</strong> {For those who appreciate mature, voluptuous, and experienced women. Housewife escorts in ${cityName} provide a warm, relaxing, and satisfying GFE experience.|Mature companions who know exactly how to please and satisfy a gentleman with complete ease.}</li>
  <li><strong>{Russian Escorts & Foreign Models|Elite VIP Companions}:</strong> {For a luxury, high-profile experience. Hire premium international VIP escorts who travel to luxury 5-star hotels in ${cityName}.|Gorgeous Russian call girls offering premium services for executive clients seeking elite company.}</li>
  <li><strong>{Independent Call Girls|High-Profile Models}:</strong> {Sophisticated, educated, and elegant companions who can accompany you to corporate events, dinner dates, or private hotel sessions.|Independent providers who publish their own ads and offer customized services.}</li>
</ul>
<p class="mt-4">{Explore the listings to find the ideal match that fits your aesthetic preference, budget, and location. Our directory is continuously updated with new profiles so you can enjoy fresh choices every single day. Make the most of your private time in ${cityName} with elite ladies who are dedicated to your pleasure.}</p>`;

  const bookingHeadingTemplate = `How to Safely Book Call Girl in ${cityName} — Step by Step`;

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

  const privacyTemplate = `{Discretion is the cornerstone of adult companionship. Our directory for <strong class="font-bold">Call Girl in ${cityName}</strong> operates on a strict zero-logs policy, meaning we do not track search histories, store cookies, or ask for user sign-ups. All communications are direct and private between you and the independent companion. By avoiding online payment gateways and implementing a cash-only transaction policy, we eliminate any credit card paper trails or bank statements, giving you complete peace of mind. Both clients and companions can enjoy secure meetings with total anonymity and peace of mind. Your secret is safe with us, making your booking private and safe.}`;

  const faqHeadingTemplate = `Frequently Asked Questions – Call Girl in ${cityName}`;

  const faq1_q = `{Are the profiles of <strong class="font-bold">Call Girl in ${cityName}</strong> verified?|How can I know if the photos of <strong class="font-bold">${cityName} Call Girl</strong> are genuine?}`;
  const faq1_a = `{Yes. We manually review and screen listings to verify the authenticity of photos and contact numbers in ${cityName}. We strongly encourage customers to report any profile that doesn't match the photos.|Every profile card displays verified badges which are verified manually. However, always exercise caution and report suspicious profiles.}`;

  const faq2_q = `{Is there any requirement for advance payment or deposit?|Do I need to pay a booking fee before meeting?}`;
  const faq2_a = `{No, absolutely not. We follow a strict Cash on Delivery policy. Never pay any booking fee, security deposit, medical card fee, or travel charges online in advance. Always pay directly in cash after meeting.|Under no circumstances should you transfer money beforehand. Pay the companion only in cash after you meet and verify her in person.}`;

  const faq3_q = `{What kinds of companions can I book in ${cityName}?|What categories of Call Girl are available?}`;
  const faq3_a = `{You can choose from a wide range of categories, including young college students, mature housewives, high-profile independent models, and premium Russian escorts.|Our directory lists various options, including local housewife companions, independent models, college girls, and VIP international escorts.}`;

  const faq4_q = `{What locations do the companions cover for outcall?|Can the call girls deliver service to my hotel room?}`;
  const faq4_a = `{Yes, our companions offer hotel and home outcall services to all major areas and premium hotels across ${cityName}. Ensure you meet in a safe and secure environment.|Outcall services are available at all major hotels, guest houses, and private residences in ${cityName} and surrounding localities.}`;

  const hinglishTemplate = `{<p class="mb-4"><strong>${cityName} Call Girl</strong> service dhoondhna ab behad aasan aur surakshit ho gaya hai. Hamari website par aapko milenge 100% genuine aur active profiles jisme direct <strong>Call Girl WhatsApp Number</strong> diya gaya hai. Agar aap ${cityName} me hain aur ek bold, beautiful aur friendly companion ke sath apna time spend karna chahte hain, toh aap bilkul sahi jagah par hain.</p>

<p class="mb-4">Hamari directory par aapko alag-alag categories jaise <strong>College Girls</strong>, <strong>Housewife Call Girls</strong>, aur high-profile <strong>Russian Escorts</strong> milengi jo aapki har sensual fantasy ko satisfy karne ke liye hamesha ready rehti hain. Yahan par sabhi independent escorts apni profile khud manage karti hain, isliye aapko kisi bhi middleman ya agency ko extra commission dene ki bilkul zarurat nahi hai.</p> 

<p class="mb-4">Sabse important baat jo aapko dhyan me rakhni hai woh hai <strong>Cash on Delivery</strong> policy. Internet par bahut se scammers logon se booking fee, security card fee, ya transport charges ke naam par advance online payment mangte hain. Hum aapko sakht salah dete hain ki kisi ko bhi ek rupaya bhi advance me pay na karein. Hamesha companion se face-to-face milne ke baad aur unki verification karne ke baad hi cash payment karein. Hamari site par aapko bilkul genuine call girl number milenge jahan online fraud ka zero risk hai.</p>

<p class="mb-4">Aap hotel booking ya home delivery, dono ke liye contact kar sakte hain. ${cityName} ke premium aur standard hotels me outcall service 24 ghante available hai. Bas profile select kijiye, WhatsApp link par click kijiye aur apni meeting confirm kijiye. Aapki privacy aur discretion hamare liye sabse badh kar hai, isliye hum aapse koi personal data ya credit card details nahi mangte.</p> 

<p class="mb-4">Aap bina kisi darr ke direct call karke ya message karke safe aur private dating ka maza le sakte hain. Kisi bhi fake profile ya fraud booking request ko flag karne ke liye aap har listing par diye gaye report button ka use kar sakte hain taaki hum use jaldi se remove kar sakein. Surakshit rahein aur ${cityName} me top-class call girl service ka safe experience enjoy karein!</p>

<p class="mb-4">Hum regularly hamare database ko update karte hain taaki aapko har baar naye aur fresh profiles dekhne ko milein. Agar aap ${cityName} ke kisi local area jaise main market ya railway station ke paas stay kar rahe hain, tab bhi hum aapko fast doorstep service provide karte hain. Yahan sabhi escorts bohot hi well-mannered aur educated hain jo aapke comfort aur privacy ka pura dhyan rakhti hain. Hamara aim aapko ek safe aur premium experience dena hai bina kisi online payment jhanjhat ke.</p>|<p class="mb-4">Agar aap <strong>${cityName} Call Girl</strong> ki talash me hain, toh hamara portal aapki sabse jyada madad karega. Hamari website par aapko milenge direct <strong>Call Girl WhatsApp Numbers</strong> jo bina kisi registration ya login ke accessible hain. ${cityName} me time spend karne ke liye aapko yahan milengi beautiful local models, college girls, housewife companions aur VIP models.</p>

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
