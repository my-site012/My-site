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
  "new-delhi": {
    metaTitle: "Call Girls in New Delhi | New Delhi Escorts | Genuine Profiles | CallGirl4U",
    metaDescription: "Find verified call girls in New Delhi. Browse hundreds of real ads for escort service on CallGirl4U. 100% genuine, 24/7 available.",
    metaKeywords: "New Delhi Escorts, New Delhi call girls, escorts in New Delhi, New Delhi escort service, New Delhi call girls number, CallGirl4U",
    h1: "Call Girls in New Delhi – Verified & Available 24/7 | CallGirl4U",
    heroSubtext: "Find real, verified New Delhi call girls. Safe service, cash payment, home delivery. Browse genuine profiles and get New Delhi call girls number now.",
    introHeading: "New Delhi Escorts — Safe, Verified & Affordable",
    introText: "Welcome to the ultimate platform to find genuine New Delhi call girls. Our website connects you directly with independent companions, ensuring a safe and verified experience. If you're searching for a New Delhi call girls number, we offer 100% real and verified profiles. Whether you're looking for college girls, housewives, or Russian escorts, we have it all.",
    whyChooseHeading: "Why Choose Us for Call Girl Service in New Delhi?",
    whyChooseText: "Choosing our platform guarantees you access to fully verified profiles without the risk of fake photos. We are strictly against advance payments—you only pay in cash. Our services are available 24/7 in New Delhi, with guaranteed privacy and discreet meetups tailored to your comfort.",
    typesHeading: "Types of Call Girls Available in New Delhi",
    typesText: "We offer a wide selection of companions including College Call Girls, perfect for a fun, energetic experience. Housewife Call Girls provide mature companionship. Russian Call Girls in New Delhi offer premium elite experiences, while Independent and High Profile Call Girls cater to luxury VIP clients.",
    bookingHeading: "How to Book Call Girl Service in New Delhi — Step by Step",
    bookingText: "Step 1: Browse profiles on our site. Step 2: Select your preferred girl. Step 3: Call or WhatsApp the contact number directly. Step 4: Confirm location, pay cash on delivery, and enjoy your time.",
    areasHeading: "Call Girl Service Available in All Areas of New Delhi",
    areasText: "We provide services everywhere in New Delhi. Whether you are staying at a luxury hotel in Connaught Place or your home in South Ex, our escorts travel to your location. Popular areas include Connaught Place, Hauz Khas, Vasant Vihar, Karol Bagh, Laxmi Nagar, Dwarka, Rohini, Saket, Mahipalpur, and Aerocity.",
    rateHeading: "Call Girl Rate List in New Delhi — Affordable Pricing",
    rateIntro: "We offer transparent pricing for all services. Below is a general rate estimation. All rates are negotiable. No advance payment required. Cash payment only.",
    privacyHeading: "100% Safe, Secure & Private Call Girl Service in New Delhi",
    privacyText: "Your privacy is fully protected. We do not store any personal data. All meetings happen confidentially in safe environments. No online footprints, pure cash transactions.",
    faqHeading: "Frequently Asked Questions – Call Girls in New Delhi",
    faqs: [
      { q: "How do I find a genuine call girl in New Delhi?", a: "Simply browse our verified profiles section and contact the model directly via call or WhatsApp. We guarantee 100% genuine photos." },
      { q: "Is the service available 24 hours in New Delhi?", a: "Yes, our call girls are available 24/7 for both day and night bookings across New Delhi." },
      { q: "Do you take advance payment?", a: "No, we strictly follow a Cash on Delivery policy. Never pay any advance online." },
      { q: "What types of call girls are available?", a: "You can find college girls, housewives, independent call girls, and Russian escorts in our listings." },
      { q: "Is my personal information safe with you?", a: "Absolutely. We ensure 100% confidentiality and never share client details." }
    ],
    hindiText: "New Delhi mein call girl service dhoondhna ab bahut aasan hai. Hamari website par sabhi profiles safe aur genuine hain, jo 24 ghante available rehti hain. Cash payment aur ghar delivery/hotel delivery ki suvidha uplabdh hai. Kisi bhi fake advance payment se bachein aur sirf genuine New Delhi कॉल गर्ल se milein.",
    profiles: [
      { name: "Priya", bio: "Hi, I'm Priya, a fun-loving independent girl in New Delhi. I offer genuine companionship with full privacy. Cash payment only. Call me for an unforgettable experience." },
      { name: "Neha", bio: "I'm Neha, offering the best college girl service in New Delhi. Safe, discreet, and very friendly. Let's make some amazing memories together. Cash only." },
      { name: "Kajal", bio: "Hi, Kajal here. I'm an independent model providing premium escort services in New Delhi. I guarantee 100% satisfaction with utmost privacy. Let's chat." },
      { name: "Simran", bio: "My name is Simran, an open-minded and bold girl based in New Delhi. I believe in giving my clients the most relaxing and secure experience." },
      { name: "Deepika", bio: "Hi I'm Deepika, your trusted companion in New Delhi. I am available 24/7. No fake promises, just genuine fun and a memorable time with me." },
      { name: "Riya", bio: "I am Riya, offering premium incall and outcall services in New Delhi. Expect complete confidentiality, safety, and no advance payment demands. Call me anytime." },
      { name: "Pooja", bio: "Hello, I'm Pooja, a beautiful young girl in New Delhi ready to fulfill your fantasies. Cash payment only, no online fraud. Let's meet today." },
      { name: "Aarti", bio: "Hi, Aarti here. Safe, genuine, and reliable call girl in New Delhi. Whether it's a hotel or home, I'm just a call away for fun." }
    ]
  }
};
