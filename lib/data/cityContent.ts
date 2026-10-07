export interface ProfileBio {
  name: string;
  bio: string;
}

export interface CitySEOContent {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  h1: string;
  heroSubtext: string;
  introHeading: string;
  introText: string;
  whyChooseHeading: string;
  whyChooseText: string;
  typesHeading: string;
  typesText: string;
  bookingHeading: string;
  bookingText: string;
  areasHeading: string;
  areasText: string;
  rateHeading: string;
  rateIntro: string;
  privacyHeading: string;
  privacyText: string;
  faqHeading: string;
  faqs: { q: string; a: string }[];
  hindiText: string;
  profiles: ProfileBio[];
}

export const cityContentData: Record<string, CitySEOContent> = {
  jaipur: {
    metaTitle: "Call Girls in Jaipur | Verified Escorts & Independent Companions",
    metaDescription: "Book top call girls in Jaipur and verified Jaipur escorts service. Genuine independent female companions with direct contact in Pink City 24/7.",
    metaKeywords: "Call Girls in Jaipur, Jaipur Call Girls, Escorts in Jaipur, Jaipur Escort Service, Independent Call Girls Jaipur, Malviya Nagar Escorts, Vaishali Nagar Call Girls, Tonk Road Call Girls",
    h1: "Call Girls in Jaipur | Verified Escorts & Independent Companions",
    heroSubtext: "Connect with verified independent call girls in Jaipur with direct contact numbers. Fast 30-minute doorstep and hotel outcall delivery across Malviya Nagar, Vaishali Nagar, Mansarovar, Tonk Road, C-Scheme, Sitapura, and Jagatpura.",
    introHeading: "Verified Female Companions & Escort Service in Pink City Jaipur",
    introText: "Welcome to the official Jaipur directory for independent female companions and escort services. Whether staying at luxury heritage hotels in C-Scheme, business hotels near Sitapura and Sanganer, or transit accommodations near Jaipur International Airport, our platform connects you directly with genuine local models, college companions, and VIP escorts without agency middlemen.",
    whyChooseHeading: "Why Book Companions in Jaipur via CallGirl4U",
    whyChooseText: `<p class="mb-4">Jaipur visitors and locals choose our directory for transparency, security, and direct provider communication:</p>
<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> Settle payment in person only after meeting your companion in your hotel room or private residence.</li>
  <li><strong>Zero Advance Deposit:</strong> Avoid online payment fraud, prepaid gift card scams, or fake medical registration fees.</li>
  <li><strong>Prompt Local Outcalls:</strong> Fast 30-minute doorstep arrival across Malviya Nagar, Vaishali Nagar, Raja Park, Mansarovar, MI Road, and Airport zones.</li>
  <li><strong>Direct Contact:</strong> Chat directly via WhatsApp or phone with self-managed independent providers.</li>
</ul>`,
    typesHeading: "Popular Companion Categories in Jaipur",
    typesText: `Explore diverse female companion profiles in Jaipur:
<ul class="list-disc pl-5 space-y-2 mt-2">
  <li><strong>College Models:</strong> Young, enthusiastic companions for friendly coffee dates, sightseeing in Pink City, and casual outings.</li>
  <li><strong>Mature Housewife Companions:</strong> Warm, attentive companions for soothing conversations and relaxed Girlfriend Experience (GFE) meetings.</li>
  <li><strong>VIP Russian & International Escorts:</strong> High-profile international models available for 5-star luxury hotel bookings across Jaipur.</li>
</ul>`,
    bookingHeading: "Steps to Book a Call Girl in Jaipur Safely",
    bookingText: `<ol class="list-decimal pl-5 space-y-2">
  <li>Browse active Jaipur listings and choose your preferred companion profile.</li>
  <li>Click the Contact button to start chatting directly via WhatsApp or phone call.</li>
  <li>Confirm meeting time, hotel room or residence location, and session expectations.</li>
  <li>Meet face-to-face and complete payment in cash after verification.</li>
</ol>`,
    areasHeading: "Jaipur Neighborhood & Hotel Outcall Coverage",
    areasText: "Doorstep delivery covers all key Jaipur localities: Malviya Nagar, Vaishali Nagar, Jagatpura, Sitapura Industrial Area, C-Scheme, Tonk Road, Ajmer Road (200 Feet Bypass), Mansarovar, Gopalpura, Sanganer, Raja Park, Bani Park, and Jaipur International Airport hotel clusters.",
    rateHeading: "Jaipur Companion Pricing & Rates Guide",
    rateIntro: "Standard rates in Jaipur range between ₹3,000 to ₹10,000 depending on session duration (1 hour, 2 hours, or overnight stay) and companion category. Direct payment on arrival | never pay any advance booking charge.",
    privacyHeading: "Discreet & Confidential Booking in Jaipur",
    privacyText: "Your privacy is protected with complete discretion. We do not store client search history or personal contact numbers, ensuring confidential companion bookings with peace of mind.",
    faqHeading: "Frequently Asked Questions | Jaipur Call Girls Directory",
    faqs: [
      { q: "Are call girl profiles in Jaipur verified with real photos?", a: "Yes. Profiles undergo photo and contact verification so you can connect directly with authentic independent companions." },
      { q: "Do I need to pay any advance fee before meeting in Jaipur?", a: "No. Never pay any advance, hotel card booking fee, or registration deposit online. Always pay directly in cash after meeting your companion." },
      { q: "Which hotel zones are covered for outcall delivery in Jaipur?", a: "Companions deliver outcall services to all major hotels in Tonk Road, C-Scheme, Malviya Nagar, Vaishali Nagar, MI Road, and near Jaipur Airport." },
      { q: "How long does outcall delivery take in Jaipur?", a: "Most independent companions arrive within 30 to 45 minutes of booking confirmation across all central Jaipur locations." }
    ],
    hindiText: `<p class="mb-4"><strong>Jaipur Call Girl & Escort Directory:</strong> Jaipur (Pink City) me verified independent call girls aur escorts ke sath connect karein. Direct phone ya WhatsApp contact ke sath safe aur confidential experience enjoy karein bina kisi advance deposit ke.</p>`,
    profiles: []
  },

  delhi: {
    metaTitle: "Call Girls in Delhi | Verified NCR Escort Directory",
    metaDescription: "Find verified independent call girls in Delhi NCR. Direct contact, real photos, zero advance payment across South Delhi, Connaught Place & Dwarka.",
    metaKeywords: "Delhi Call Girls, Call Girl in Delhi, Independent Companions Delhi, Delhi Escort Service, South Delhi Escorts, Aerocity Call Girls",
    h1: "Call Girls in Delhi NCR | Verified Independent Companions",
    heroSubtext: "Browse verified independent call girls across Delhi NCR including South Delhi, Connaught Place, Aerocity, Dwarka, and Rohini. Direct booking with zero advance payment.",
    introHeading: "Verified Female Companions in Delhi NCR",
    introText: "Welcome to CallGirl4U's Delhi directory. Find verified independent companions available 24/7 across South Delhi, Central Delhi, West Delhi, and Aerocity hotel hubs. Enjoy direct provider contact with zero deposit demands.",
    whyChooseHeading: "Why Choose CallGirl4U in Delhi",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> No advance booking charges or upfront deposit.</li>
  <li><strong>Verified Independent Profiles:</strong> Direct access to genuine local models.</li>
  <li><strong>Discreet Hotel Outcalls:</strong> Fast doorstep delivery to hotels in Aerocity, Saket, and CP.</li>
</ul>`,
    typesHeading: "Categories Available in Delhi",
    typesText: `Choose from college companions, mature housewives, high-profile independent models, and VIP Russian escorts for 5-star hotel bookings.`,
    bookingHeading: "Booking Guide for Delhi",
    bookingText: `Select a profile, connect via Contact, confirm your hotel room or residence location, and pay directly in cash after meeting.`,
    areasHeading: "Delhi Service Coverage",
    areasText: "Service covers South Delhi (Saket, GK, Hauz Khas), Central Delhi (CP, Karol Bagh), Aerocity hotel zone, Dwarka, Janakpuri, and Rohini.",
    rateHeading: "Delhi Rates & Pricing Guide",
    rateIntro: "Standard pricing applies based on short time or overnight stay. Always pay in person upon meeting.",
    privacyHeading: "Discreet Privacy Standards in Delhi",
    privacyText: "Complete zero-log confidentiality ensures zero digital footprints or credit card records.",
    faqHeading: "Delhi Directory FAQs",
    faqs: [
      { q: "Is advance payment required in Delhi NCR?", a: "No, never pay any money online beforehand. Pay cash in person after meeting." },
      { q: "Are Aerocity hotel deliveries supported?", a: "Yes, independent companions provide prompt outcall service to Aerocity hotel hubs." }
    ],
    hindiText: `<p class="mb-4"><strong>Delhi Call Girl Directory:</strong> Delhi NCR me verified companions ke saath safe date book karein. Direct contact policy ke saath zero fraud risk.</p>`,
    profiles: []
  },

  mumbai: {
    metaTitle: "Call Girls in Mumbai | Verified Companion Directory",
    metaDescription: "Find verified independent call girls in Mumbai. Direct contact, real photos, zero advance payment across Bandra, Andheri, Juhu & South Mumbai.",
    metaKeywords: "Mumbai Call Girls, Call Girl in Mumbai, Bandra Escorts, Andheri Call Girls, Independent Companions Mumbai",
    h1: "Call Girls in Mumbai | Verified Independent Companions",
    heroSubtext: "Discover verified independent companions across Mumbai including Bandra, Andheri, Juhu, Powai, and South Mumbai. Direct booking with zero advance payment.",
    introHeading: "Verified Female Companions in Mumbai",
    introText: "Connect directly with verified independent companions in Mumbai without middleman commissions. Listings cover corporate event dates, hotel outcalls, and private arrangements.",
    whyChooseHeading: "Why Book in Mumbai via CallGirl4U",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Cash Payment on Meeting:</strong> Pay face-to-face after meeting your companion.</li>
  <li><strong>Verified Models:</strong> Authenticated photos and direct numbers.</li>
  <li><strong>Prompt Doorstep Delivery:</strong> Outcall service across Suburbs and Town.</li>
</ul>`,
    typesHeading: "Companion Categories in Mumbai",
    typesText: "Featuring high-profile fashion models, college companions, mature ladies, and elite VIP escorts.",
    bookingHeading: "How to Book in Mumbai",
    bookingText: "Browse Mumbai listings, click Contact, confirm meeting venue, and pay in cash after meeting.",
    areasHeading: "Mumbai Neighborhood Coverage",
    areasText: "Service covers Bandra West, Andheri East/West, Juhu, BKC, Powai, Lower Parel, and Colaba.",
    rateHeading: "Mumbai Pricing Overview",
    rateIntro: "Fair market rates determined by independent providers. Direct payment on arrival.",
    privacyHeading: "Mumbai Privacy Standards",
    privacyText: "Zero digital logs preserve your anonymity completely.",
    faqHeading: "Mumbai Directory FAQs",
    faqs: [
      { q: "Do companions cover BKC and Airport hotels in Mumbai?", a: "Yes, fast outcall delivery is available to BKC, Bandra, and Airport hotel zones." }
    ],
    hindiText: `<p class="mb-4"><strong>Mumbai Call Girl Directory:</strong> Mumbai me verified independent models aur companions ke saath connect karein. Direct contact aur zero advance payment.</p>`,
    profiles: []
  },

  surat: {
    metaTitle: "Call Girls in Surat | Verified Escort & Companion Directory",
    metaDescription: "Find verified independent call girls in Surat, Gujarat. Direct contact, genuine photos across Vesu, Piplod & Ring Road.",
    metaKeywords: "Surat Call Girls, Call Girl in Surat, Vesu Escorts, Piplod Call Girls, Independent Companions Surat",
    h1: "Call Girls in Surat | Verified Independent Companions",
    heroSubtext: "Browse genuine independent call girls across Surat including Vesu, Piplod, Adajan, Varachha, and Ring Road. Direct booking with zero advance payment.",
    introHeading: "Verified Female Companions in Surat",
    introText: "Connect with independent models and female companions in Surat, Gujarat. Enjoy direct Contact messaging, transparent pricing, and direct face-to-face payment.",
    whyChooseHeading: "Why Book Companions in Surat",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> Settle payment face-to-face only after meeting.</li>
  <li><strong>Zero Advance Deposit:</strong> Never transfer money online before meeting.</li>
  <li><strong>Direct Provider Access:</strong> Chat directly with self-managed independent providers.</li>
  <li><strong>Discreet Hotel Outcalls:</strong> Fast doorstep delivery across major Surat hotels.</li>
</ul>`,
    typesHeading: "Surat Companion Categories",
    typesText: "College models, housewives, and VIP companions available for private hotel dates.",
    bookingHeading: "Surat Booking Steps",
    bookingText: "Select a Surat companion profile, send a message, agree on location, and pay cash after meeting.",
    areasHeading: "Surat Location Coverage",
    areasText: "Delivery available across Vesu, Piplod, Adajan, City Light, Ghod Dod Road, Varachha, and Dumas Road.",
    rateHeading: "Surat Pricing Guide",
    rateIntro: "Rates depend on session duration. Always pay directly in cash after meeting.",
    privacyHeading: "Surat Privacy Standards",
    privacyText: "Strict zero-log infrastructure protects client confidentiality.",
    faqHeading: "Surat Directory FAQs",
    faqs: [
      { q: "Is advance payment required in Surat?", a: "No, you pay directly in person after meeting your companion across all Surat listings." }
    ],
    hindiText: `<p class="mb-4"><strong>Surat Call Girl Directory:</strong> Surat me verified independent companions ke saath direct connect karein. Zero advance fee aur direct provider contact.</p>`,
    profiles: []
  },

  ahmedabad: {
    metaTitle: "Call Girls in Ahmedabad | Verified Companion Directory",
    metaDescription: "Find verified independent call girls in Ahmedabad. Direct booking, authentic photos across SG Highway, Satellite & Bodakdev.",
    metaKeywords: "Ahmedabad Call Girls, Call Girl in Ahmedabad, SG Highway Escorts, Satellite Call Girls, Independent Companions Ahmedabad",
    h1: "Call Girls in Ahmedabad | Verified Independent Companions",
    heroSubtext: "Discover verified independent call girls across Ahmedabad including SG Highway, Satellite, Bodakdev, Prahlad Nagar, and Vastrapur. Zero advance payment.",
    introHeading: "Verified Female Companions in Ahmedabad",
    introText: "Welcome to CallGirl4U's Ahmedabad directory. Connect directly with independent models and female escorts for hotel and residential outcalls across Ahmedabad.",
    whyChooseHeading: "Why Choose CallGirl4U in Ahmedabad",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> No advance payments or online registration charges.</li>
  <li><strong>Verified Models:</strong> Manual photo verification for complete authenticity.</li>
  <li><strong>Discreet Meetings:</strong> Prompt outcall delivery to hotels along SG Highway and Airport Road.</li>
</ul>`,
    typesHeading: "Available Categories in Ahmedabad",
    typesText: "College student companions, mature housewives, and high-profile VIP escorts.",
    bookingHeading: "Ahmedabad Booking Steps",
    bookingText: "Choose a profile, click Contact, confirm meeting details, and pay in cash after meeting.",
    areasHeading: "Ahmedabad Neighborhood Coverage",
    areasText: "Service covers SG Highway, Satellite, Bodakdev, Prahlad Nagar, Navrangpura, Ashram Road, and Airport zone.",
    rateHeading: "Ahmedabad Rate Guide",
    rateIntro: "Transparent pricing negotiated directly with independent providers. Pay face-to-face upon meeting.",
    privacyHeading: "Privacy Standards in Ahmedabad",
    privacyText: "Zero-log browsing provides complete client discretion.",
    faqHeading: "Ahmedabad FAQs",
    faqs: [
      { q: "Are SG Highway hotels covered in Ahmedabad?", a: "Yes, companions deliver prompt outcall services to all major hotels along SG Highway." }
    ],
    hindiText: `<p class="mb-4"><strong>Ahmedabad Call Girl Directory:</strong> Ahmedabad me verified independent companions ke saath safe booking karein. Direct direct contact aur zero advance payment.</p>`,
    profiles: []
  },

  pune: {
    metaTitle: "Call Girls in Pune | Verified Companion Directory",
    metaDescription: "Find verified independent call girls in Pune. Direct contact, real photos across Viman Nagar, Koregaon Park, Baner & Hinjawadi.",
    metaKeywords: "Pune Call Girls, Call Girl in Pune, Viman Nagar Escorts, Koregaon Park Call Girls, Hinjewadi Escorts",
    h1: "Call Girls in Pune | Verified Independent Companions",
    heroSubtext: "Browse verified independent call girls across Pune including Viman Nagar, Koregaon Park, Baner, Hinjawadi, and Wakad. Direct contact with zero advance.",
    introHeading: "Verified Female Companions in Pune",
    introText: "Connect with genuine independent companions in Pune. Ideal for corporate travelers and residents seeking discreet dates in IT hubs and luxury hotel zones.",
    whyChooseHeading: "Why Choose CallGirl4U in Pune",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> Never pay any deposit or booking fee online.</li>
  <li><strong>Direct Access:</strong> Connect directly with independent models.</li>
  <li><strong>Fast IT Hub Outcalls:</strong> Quick delivery to Hinjawadi, Baner, and Viman Nagar hotels.</li>
</ul>`,
    typesHeading: "Pune Companion Categories",
    typesText: "College students, mature ladies, and elite VIP companions for corporate dinner dates.",
    bookingHeading: "Pune Booking Steps",
    bookingText: "Select a profile, send a text message, agree on venue details, and complete payment in cash after meeting.",
    areasHeading: "Pune Service Coverage",
    areasText: "Covers Viman Nagar, Koregaon Park, Kalyani Nagar, Baner, Wakad, Hinjawadi, Kharadi, and Shivaji Nagar.",
    rateHeading: "Pune Pricing Guide",
    rateIntro: "Fair market rates set by independent providers. Direct in-person payment.",
    privacyHeading: "Pune Privacy Standards",
    privacyText: "Strict client confidentiality with zero personal data retention.",
    faqHeading: "Pune Directory FAQs",
    faqs: [
      { q: "Are Hinjawadi and Baner hotels supported for outcall?", a: "Yes, fast outcall delivery is available to all major hotels in Hinjawadi IT Park and Baner." }
    ],
    hindiText: `<p class="mb-4"><strong>Pune Call Girl Directory:</strong> Pune me verified independent companions ke saath direct connect karein. Zero advance payment risk.</p>`,
    profiles: []
  },

  bangalore: {
    metaTitle: "Call Girls in Bangalore | Verified Companion Directory",
    metaDescription: "Find verified independent call girls in Bangalore (Bengaluru). Direct contact, genuine photos across Indiranagar, Koramangala & Whitefield.",
    metaKeywords: "Bangalore Call Girls, Call Girl in Bangalore, Indiranagar Escorts, Koramangala Call Girls, Whitefield Escorts",
    h1: "Call Girls in Bangalore | Verified Independent Companions",
    heroSubtext: "Discover verified independent call girls across Bangalore (Bengaluru) including Indiranagar, Koramangala, Whitefield, HSR Layout, and MG Road.",
    introHeading: "Verified Female Companions in Bangalore",
    introText: "Welcome to CallGirl4U's Bangalore directory. Connect directly with independent models and female escorts across Silicon Valley's top neighborhoods.",
    whyChooseHeading: "Why Book in Bangalore via CallGirl4U",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> No advance payments or prepaid card fees.</li>
  <li><strong>Direct Booking:</strong> Zero middleman commissions.</li>
  <li><strong>Silicon Valley Coverage:</strong> Doorstep delivery to luxury hotels in Indiranagar, MG Road, and Electronic City.</li>
</ul>`,
    typesHeading: "Bangalore Companion Categories",
    typesText: "College student companions, sophisticated independent models, and VIP international escorts.",
    bookingHeading: "Bangalore Booking Guide",
    bookingText: "Pick a companion profile, contact directly, confirm meeting location, and pay cash face-to-face.",
    areasHeading: "Bangalore Neighborhood Coverage",
    areasText: "Service covers Indiranagar, Koramangala, Whitefield, HSR Layout, Jayanagar, Electronic City, and MG Road.",
    rateHeading: "Bangalore Rates & Pricing",
    rateIntro: "Rates are determined independently by providers. Always pay upon meeting in person.",
    privacyHeading: "Bangalore Privacy Protection",
    privacyText: "Zero-log system maintains complete anonymity for all clients.",
    faqHeading: "Bangalore FAQs",
    faqs: [
      { q: "Are Koramangala and Indiranagar hotels covered?", a: "Yes, independent companions offer prompt outcall delivery to hotels in Koramangala and Indiranagar." }
    ],
    hindiText: `<p class="mb-4"><strong>Bangalore Call Girl Directory:</strong> Bangalore me verified independent companions ke saath safe date book karein. Direct contact aur zero advance deposit.</p>`,
    profiles: []
  },

  bengaluru: {
    metaTitle: "Call Girls in Bengaluru | Verified Companion Directory",
    metaDescription: "Find verified independent call girls in Bengaluru. Direct contact, real photos across Indiranagar, Koramangala & Whitefield.",
    metaKeywords: "Bengaluru Call Girls, Call Girl in Bengaluru, Indiranagar Escorts, Koramangala Call Girls, Whitefield Escorts",
    h1: "Call Girls in Bengaluru | Verified Independent Companions",
    heroSubtext: "Browse verified independent companions across Bengaluru including Indiranagar, Koramangala, Whitefield, HSR Layout, and MG Road.",
    introHeading: "Verified Female Companions in Bengaluru",
    introText: "Connect with genuine independent companions in Bengaluru. Enjoy transparent pricing and direct contact with zero advance deposit.",
    whyChooseHeading: "Why Choose CallGirl4U in Bengaluru",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> Pay face-to-face only after meeting your companion.</li>
  <li><strong>Verified Models:</strong> Manual photo verification for authenticity.</li>
  <li><strong>Prompt Hotel Outcalls:</strong> Service across major tech parks and hotel zones.</li>
</ul>`,
    typesHeading: "Available Categories in Bengaluru",
    typesText: "College models, housewives, and VIP escorts for hotel dates.",
    bookingHeading: "Bengaluru Booking Steps",
    bookingText: "Select a profile, send a text message, agree on venue details, and pay cash after meeting.",
    areasHeading: "Bengaluru Location Coverage",
    areasText: "Covers Indiranagar, Koramangala, Whitefield, HSR Layout, MG Road, and Electronic City.",
    rateHeading: "Bengaluru Pricing Guide",
    rateIntro: "Fair market rates set by independent providers. Direct in-person payment.",
    privacyHeading: "Bengaluru Privacy Standards",
    privacyText: "Complete client confidentiality with zero digital logs.",
    faqHeading: "Bengaluru FAQs",
    faqs: [
      { q: "Is payment required upon arrival in Bengaluru?", a: "Yes, we follow a strict pay-on-meeting policy." }
    ],
    hindiText: `<p class="mb-4"><strong>Bengaluru Call Girl Directory:</strong> Bengaluru me verified independent models ke saath connect karein. Zero advance deposit.</p>`,
    profiles: []
  },

  kolkata: {
    metaTitle: "Call Girls in Kolkata | Verified Escort Directory",
    metaDescription: "Find verified independent call girls in Kolkata. Direct booking, authentic photos across Salt Lake, Park Street & Rajarhat New Town.",
    metaKeywords: "Kolkata Call Girls, Call Girl in Kolkata, Salt Lake Escorts, Park Street Call Girls, New Town Escorts",
    h1: "Call Girls in Kolkata | Verified Independent Companions",
    heroSubtext: "Discover verified independent call girls across Kolkata including Salt Lake, Park Street, Rajarhat New Town, Ballygunge, and EM Bypass.",
    introHeading: "Verified Female Companions in City of Joy Kolkata",
    introText: "Welcome to CallGirl4U's Kolkata directory. Connect directly with genuine independent companions across Kolkata without middleman charges.",
    whyChooseHeading: "Why Choose CallGirl4U in Kolkata",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> No upfront deposit or online booking fee.</li>
  <li><strong>Verified Independent Profiles:</strong> Direct access to local models.</li>
  <li><strong>Discreet Hotel Delivery:</strong> Fast outcall service to Park Street, Salt Lake, and Airport hotel zones.</li>
</ul>`,
    typesHeading: "Categories Available in Kolkata",
    typesText: "College companions, mature housewife companions, and VIP models.",
    bookingHeading: "Kolkata Booking Guide",
    bookingText: "Pick a companion profile, chat via Contact, confirm your hotel room location, and pay cash face-to-face.",
    areasHeading: "Kolkata Neighborhood Coverage",
    areasText: "Service covers Park Street, Salt Lake Sector V, Rajarhat New Town, Ballygunge, Gariahat, and EM Bypass.",
    rateHeading: "Kolkata Rate Expectations",
    rateIntro: "Transparent pricing negotiated directly with providers. Pay upon meeting in person.",
    privacyHeading: "Kolkata Privacy Protection",
    privacyText: "Zero logs ensure total discretion for all clients in Kolkata.",
    faqHeading: "Kolkata FAQs",
    faqs: [
      { q: "Are Salt Lake and Park Street hotels supported in Kolkata?", a: "Yes, independent companions offer prompt outcall delivery to hotels in Salt Lake and Park Street." }
    ],
    hindiText: `<p class="mb-4"><strong>Kolkata Call Girl Directory:</strong> Kolkata me verified independent companions ke saath safe booking karein. Direct contact aur zero advance payment.</p>`,
    profiles: []
  },

  hyderabad: {
    metaTitle: "Call Girls in Hyderabad | Verified Companion Directory",
    metaDescription: "Find verified independent call girls in Hyderabad. Direct contact, real photos across HITECH City, Gachibowli, Jubilee Hills & Banjara Hills.",
    metaKeywords: "Hyderabad Call Girls, Call Girl in Hyderabad, HITECH City Escorts, Gachibowli Call Girls, Jubilee Hills Escorts",
    h1: "Call Girls in Hyderabad | Verified Independent Companions",
    heroSubtext: "Browse verified independent call girls across Hyderabad including HITECH City, Gachibowli, Jubilee Hills, Banjara Hills, and Madhapur.",
    introHeading: "Verified Female Companions in Hyderabad",
    introText: "Connect directly with verified independent companions in Cyberabad and Hyderabad. Browse active listings with direct contact and zero advance fees.",
    whyChooseHeading: "Why Choose CallGirl4U in Hyderabad",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> Pay face-to-face after meeting your companion.</li>
  <li><strong>Direct Booking:</strong> Connect directly with self-managed providers.</li>
  <li><strong>IT Hub Hotel Delivery:</strong> Fast outcall service to Gachibowli, HITECH City, and Financial District.</li>
</ul>`,
    typesHeading: "Hyderabad Companion Categories",
    typesText: "College student models, housewife companions, and elite VIP escorts.",
    bookingHeading: "Hyderabad Booking Steps",
    bookingText: "Choose a profile, click Contact, confirm meeting details, and pay in cash after meeting.",
    areasHeading: "Hyderabad Service Coverage",
    areasText: "Covers HITECH City, Gachibowli, Jubilee Hills, Banjara Hills, Madhapur, Kondapur, and Begumpet.",
    rateHeading: "Hyderabad Pricing Guide",
    rateIntro: "Fair market rates set independently by providers. Direct payment on arrival.",
    privacyHeading: "Hyderabad Privacy Protection",
    privacyText: "Zero-log infrastructure preserves client anonymity completely.",
    faqHeading: "Hyderabad FAQs",
    faqs: [
      { q: "Are Gachibowli and HITECH City hotels supported?", a: "Yes, fast outcall delivery is available to all major hotels in Gachibowli and HITECH City." }
    ],
    hindiText: `<p class="mb-4"><strong>Hyderabad Call Girl Directory:</strong> Hyderabad me verified independent models ke saath connect karein. Zero advance payment.</p>`,
    profiles: []
  },

  goa: {
    metaTitle: "Call Girls in Goa | Verified Companion & Beach Escort Directory",
    metaDescription: "Find verified independent call girls in Goa. Direct contact, real photos across Calangute, Baga, Candolim & Panaji.",
    metaKeywords: "Goa Call Girls, Call Girl in Goa, Calangute Escorts, Baga Call Girls, Panaji Escorts, Russian Escorts Goa",
    h1: "Call Girls in Goa | Verified Independent Beach Companions",
    heroSubtext: "Discover verified independent call girls across Goa including Calangute, Baga, Candolim, Anjuna, Colva, and Panaji. Zero advance deposit.",
    introHeading: "Verified Female Companions in Goa",
    introText: "Welcome to CallGirl4U's Goa directory. Connect directly with independent beach companions, college models, and VIP Russian escorts during your vacation in Goa.",
    whyChooseHeading: "Why Book Companions in Goa",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> Never pay any online deposit or booking fee while on holiday.</li>
  <li><strong>Vacation Doorstep Service:</strong> Fast delivery to beach resorts and private villas.</li>
  <li><strong>Direct Contact:</strong> Connect directly with independent models.</li>
</ul>`,
    typesHeading: "Goa Companion Categories",
    typesText: "Beach companions, college models, and VIP Russian escorts for resort dates.",
    bookingHeading: "Goa Booking Steps",
    bookingText: "Pick a companion profile, message on Contact, confirm resort/hotel room details, and pay in cash after meeting.",
    areasHeading: "Goa Service Coverage",
    areasText: "Service covers North Goa (Calangute, Baga, Candolim, Anjuna, Vagator) and South Goa (Colva, Margao, Panaji).",
    rateHeading: "Goa Pricing Overview",
    rateIntro: "Rates vary based on resort outcall location and companion category. Direct payment on arrival.",
    privacyHeading: "Goa Vacation Discretion Standards",
    privacyText: "Complete zero-log discretion ensures safe and anonymous dates during your trip.",
    faqHeading: "Goa Directory FAQs",
    faqs: [
      { q: "Are resort outcalls supported in Calangute and Baga?", a: "Yes, independent companions provide prompt outcall service to resorts in North and South Goa." }
    ],
    hindiText: `<p class="mb-4"><strong>Goa Call Girl Directory:</strong> Goa vacation me verified independent companions ke saath safe booking karein. Direct contact aur safe vacation booking.</p>`,
    profiles: []
  },

  panaji: {
    metaTitle: "Call Girls in Panaji Goa | Verified Companion Directory",
    metaDescription: "Find verified independent call girls in Panaji, Goa. Direct contact, real photos across Miramar, Dona Paula & Panaji.",
    metaKeywords: "Panaji Call Girls, Call Girl in Panaji, Miramar Escorts, Dona Paula Call Girls, Independent Companions Panaji",
    h1: "Call Girls in Panaji | Verified Independent Companions",
    heroSubtext: "Browse verified independent call girls in Panaji, Miramar, Dona Paula, and Miramar Beach. Zero advance payment.",
    introHeading: "Verified Female Companions in Panaji",
    introText: "Connect directly with independent companions in Panaji city. Enjoy transparent pricing and direct booking.",
    whyChooseHeading: "Why Choose CallGirl4U in Panaji",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Zero Advance Deposit:</strong> Pay cash face-to-face only.</li>
  <li><strong>Direct Provider Chat:</strong> Instant Contact messaging.</li>
  <li><strong>Capital City Outcalls:</strong> Service across Panaji hotels and guest houses.</li>
</ul>`,
    typesHeading: "Panaji Companion Categories",
    typesText: "College models, mature ladies, and VIP companions.",
    bookingHeading: "Panaji Booking Steps",
    bookingText: "Select a profile, message on Contact, confirm venue, and pay cash after meeting.",
    areasHeading: "Panaji Area Coverage",
    areasText: "Covers Panaji City Center, Miramar, Dona Paula, Fontainhas, and Bambolim.",
    rateHeading: "Panaji Rate Guide",
    rateIntro: "Fair pricing determined by independent providers. Direct in-person payment.",
    privacyHeading: "Panaji Privacy Protection",
    privacyText: "Complete client confidentiality with zero digital footprint.",
    faqHeading: "Panaji FAQs",
    faqs: [
      { q: "Are Miramar and Dona Paula hotel deliveries supported?", a: "Yes, fast outcall delivery is available to hotels in Miramar and Dona Paula." }
    ],
    hindiText: `<p class="mb-4"><strong>Panaji Call Girl Directory:</strong> Panaji Goa me verified independent companions ke saath direct connect karein. Zero advance deposit.</p>`,
    profiles: []
  },

  chandigarh: {
    metaTitle: "Call Girls in Chandigarh | Verified Companion Directory",
    metaDescription: "Find verified independent call girls in Chandigarh, Mohali & Zirakpur. Direct contact, real photos across Sector 17, 35 & 22.",
    metaKeywords: "Chandigarh Call Girls, Call Girl in Chandigarh, Mohali Escorts, Zirakpur Call Girls, Sector 17 Escorts",
    h1: "Call Girls in Chandigarh | Verified Independent Companions",
    heroSubtext: "Browse verified independent call girls across Chandigarh Tri-City including Mohali, Zirakpur, Panchkula, and Sector 17/35. Zero advance payment.",
    introHeading: "Verified Female Companions in Chandigarh Tri-City",
    introText: "Welcome to CallGirl4U's Chandigarh directory. Connect directly with independent companions across Chandigarh, Mohali, and Zirakpur with zero deposit demands.",
    whyChooseHeading: "Why Choose CallGirl4U in Chandigarh",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> No advance booking charges or upfront deposit.</li>
  <li><strong>Verified Tri-City Profiles:</strong> Direct access to genuine local models.</li>
  <li><strong>Prompt Hotel Outcalls:</strong> Fast doorstep delivery to hotels in Sector 17, 35, Mohali, and Zirakpur.</li>
</ul>`,
    typesHeading: "Chandigarh Companion Categories",
    typesText: "College student companions, mature housewives, and VIP models.",
    bookingHeading: "Chandigarh Booking Guide",
    bookingText: "Select a profile, send a text message, agree on hotel details, and pay cash face-to-face.",
    areasHeading: "Chandigarh Service Coverage",
    areasText: "Covers Sector 17, 22, 35, 43, Mohali Phase 3B2/7/10, Zirakpur VIP Road, and Panchkula.",
    rateHeading: "Chandigarh Rate Expectations",
    rateIntro: "Rates are determined independently by providers. Always pay upon meeting in person.",
    privacyHeading: "Chandigarh Privacy Standards",
    privacyText: "Zero-log system maintains complete anonymity for all clients in Chandigarh.",
    faqHeading: "Chandigarh FAQs",
    faqs: [
      { q: "Are Mohali and Zirakpur hotels covered?", a: "Yes, independent companions provide fast outcall service across Mohali and Zirakpur hotel zones." }
    ],
    hindiText: `<p class="mb-4"><strong>Chandigarh Call Girl Directory:</strong> Chandigarh Tri-City (Mohali, Zirakpur) me verified companions ke saath safe date book karein. Zero advance payment.</p>`,
    profiles: []
  },

  jodhpur: {
    metaTitle: "Call Girls in Jodhpur | Verified Companion Directory",
    metaDescription: "Find verified independent call girls in Jodhpur, Rajasthan. Direct contact, real photos across Ratanada, Sardarpura & Paota.",
    metaKeywords: "Jodhpur Call Girls, Call Girl in Jodhpur, Ratanada Escorts, Sardarpura Call Girls, Independent Companions Jodhpur",
    h1: "Call Girls in Jodhpur | Verified Independent Companions",
    heroSubtext: "Discover verified independent call girls in Jodhpur including Ratanada, Sardarpura, Paota, Shastri Nagar, and Airport Road.",
    introHeading: "Verified Female Companions in Sun City Jodhpur",
    introText: "Connect directly with independent companions in Jodhpur without agency markups. Browse active profiles with authentic photos and direct numbers.",
    whyChooseHeading: "Why Book Companions in Jodhpur",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> Pay face-to-face only after meeting.</li>
  <li><strong>Zero Advance Deposit:</strong> Avoid prepaid card scams completely.</li>
  <li><strong>Fast Hotel Delivery:</strong> Outcall service across Ratanada and Circuit House Road hotels.</li>
</ul>`,
    typesHeading: "Jodhpur Companion Categories",
    typesText: "College models, mature housewife companions, and VIP escorts.",
    bookingHeading: "Jodhpur Booking Guide",
    bookingText: "Choose a profile, contact directly, confirm meeting details, and pay cash after meeting.",
    areasHeading: "Jodhpur Area Coverage",
    areasText: "Service covers Ratanada, Sardarpura, Paota, Shastri Nagar, Chopasni Road, and Airport zone.",
    rateHeading: "Jodhpur Rate Expectations",
    rateIntro: "Fair market rates set by independent providers. Direct in-person payment.",
    privacyHeading: "Jodhpur Privacy Standards",
    privacyText: "Strict zero-log infrastructure protects client confidentiality.",
    faqHeading: "Jodhpur FAQs",
    faqs: [
      { q: "Are Ratanada hotel outcalls supported in Jodhpur?", a: "Yes, fast outcall delivery is available to all major hotels in Ratanada and Sardarpura." }
    ],
    hindiText: `<p class="mb-4"><strong>Jodhpur Call Girl Directory:</strong> Jodhpur me verified independent companions ke saath direct connect karein. Zero advance payment.</p>`,
    profiles: []
  },

  udaipur: {
    metaTitle: "Call Girls in Udaipur | Verified Escort Directory",
    metaDescription: "Find verified independent call girls in Udaipur, Rajasthan. Direct contact, authentic photos across Hiran Magri, Sukher & City Palace area.",
    metaKeywords: "Udaipur Call Girls, Call Girl in Udaipur, Hiran Magri Escorts, Sukher Call Girls, Lake City Escorts",
    h1: "Call Girls in Udaipur | Verified Independent Lake City Companions",
    heroSubtext: "Browse verified independent call girls across Udaipur including Hiran Magri, Sukher, Panchwati, Fateh Sagar, and Fatehpura.",
    introHeading: "Verified Female Companions in Lake City Udaipur",
    introText: "Welcome to CallGirl4U's Udaipur directory. Connect with verified independent companions during your heritage stay or business trip in Udaipur.",
    whyChooseHeading: "Why Choose CallGirl4U in Udaipur",
    whyChooseText: `<ul class="list-disc pl-5 space-y-2 mb-4">
  <li><strong>Pay After Meeting:</strong> No advance booking charges or deposit demands.</li>
  <li><strong>Direct Booking:</strong> Connect directly with self-managed providers.</li>
  <li><strong>Resort Doorstep Service:</strong> Fast delivery to hotels and resorts around Lake Pichola and Fateh Sagar.</li>
</ul>`,
    typesHeading: "Udaipur Companion Categories",
    typesText: "College companions, mature housewives, and VIP models for resort dates.",
    bookingHeading: "Udaipur Booking Steps",
    bookingText: "Select a profile, send a message, agree on hotel details, and pay cash face-to-face.",
    areasHeading: "Udaipur Location Coverage",
    areasText: "Covers Hiran Magri, Sukher, Fatehpura, Panchwati, Old City Lake area, and Airport Road.",
    rateHeading: "Udaipur Pricing Overview",
    rateIntro: "Rates are set independently by providers. Always pay directly in person after meeting.",
    privacyHeading: "Udaipur Privacy Standards",
    privacyText: "Complete zero-log confidentiality ensures safe and private dates.",
    faqHeading: "Udaipur FAQs",
    faqs: [
      { q: "Are hotel outcalls available around Fateh Sagar and Lake Pichola?", a: "Yes, independent companions offer prompt outcall delivery to hotels and resorts across Udaipur." }
    ],
    hindiText: `<p class="mb-4"><strong>Udaipur Call Girl Directory:</strong> Udaipur (Lake City) me verified independent companions ke saath safe date book karein. Zero advance payment.</p>`,
    profiles: []
  }
};
