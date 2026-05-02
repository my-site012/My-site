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
  
  const intros = [
    `Let's be real, finding a genuine connection in a city like ${cityName} can be a total headache. You're probably tired of scrolling through fake ads and getting ghosted. That's exactly why we're here. If you're looking for the best <strong>Call Girls in ${cityName}</strong>, you've finally landed on the right spot. We've spent time curating a list of <strong>${cityName} call girls</strong> who aren't just stunning but actually real. Whether you're just visiting and staying at a nice hotel or you've lived here for years, our <strong>escort service in ${cityName}</strong> is all about making your night unforgettable without any of the usual drama. <br/><br/>The girls you see on our site? They're the real deal. No filters, no fake promises. We know your time is precious, so we've made sure someone is always around <strong>24/7</strong>. Whenever you're in the mood for some high-end companionship, we've got you covered. No corporate talk here—just great service and total discretion, because we know how important your privacy is.`,
    
    `So, you're in ${cityName} and looking for a little excitement? I totally get it. This city has a vibe of its own, but finding the right company can be tricky. If you want to meet the most beautiful <strong>Call Girls in ${cityName}</strong>, you're in for a treat. We don't do things the boring way. Our <strong>${cityName} call girls</strong> are handpicked for guys who appreciate class and a good time. Think of our <strong>escort service in ${cityName}</strong> as your personal link to the city's most elite companions. <br/><br/>Don't worry about the small stuff. We've simplified everything—<strong>verified profiles</strong>, <strong>no advance payment</strong>, and zero nonsense. Whether you're chilling at home or booked into a luxury suite, our girls are ready to head your way. It's about more than just a meeting; it's about an experience that sticks with you. Ready to make your ${cityName} stay a lot more interesting? Let's get started.`,
    
    `I know what you're thinking—is this another one of those scammy sites? Honestly, I'd be skeptical too. But we're doing things differently in ${cityName}. If you're searching for <strong>Call Girls in ${cityName}</strong> who actually look like their photos, you're in the right place. We've built a solid reputation for providing <strong>${cityName} call girls</strong> who are smart, gorgeous, and totally discreet. Finding a reliable <strong>escort service in ${cityName}</strong> shouldn't feel like a chore, so we've made it as smooth as possible. <br/><br/>We've got everyone from bubbly college girls to more sophisticated types, so whatever you're into, we can help. We're open <strong>24/7</strong> and we're super flexible with <strong>home delivery</strong> or <strong>hotel delivery</strong>. And the best part? No weird online transfers. Just <strong>cash payment</strong> when you meet. Simple, safe, and exactly how it should be in a city like ${cityName}.`
  ];

  const types = [
    `Everyone has a "type," right? We've made sure our selection in ${cityName} is as diverse as the city itself. If you're into that youthful, fun energy, our <strong>College girls in ${cityName}</strong> are a huge hit—they're all about having a good time. If you prefer someone more grounded and sophisticated, you'll love the <strong>Housewives</strong> in our list; they bring a different kind of warmth to the table. <br/><br/>And for those nights when you want something extra special, our elite <strong>Russian escorts</strong> are here to blow your mind. We also have <strong>High Profile models</strong> and independent girls for when you really want to level up your evening. Whatever you're feeling, there's someone here in ${cityName} ready to match your energy.`,
    
    `We don't believe in "one size fits all" when it comes to companionship. Our <strong>${cityName} call girls</strong> come from all walks of life. Maybe you're in the mood for a playful <strong>College girl</strong> who can keep the conversation light and fun? Or perhaps you're looking for the refined charm of a <strong>Housewife in ${cityName}</strong>? We've got them all. <br/><br/>For a bit of an international flavor, our <strong>Russian call girls in ${cityName}</strong> are absolute showstoppers. We also work with a lot of <strong>Independent call girls</strong> who offer a really personalized, one-on-one vibe. Basically, whatever you're craving, our <strong>escort service in ${cityName}</strong> has a profile that will make you stop scrolling and start calling.`,
    
    `Finding the right partner for the night is all about choice. In ${cityName}, we've put together a lineup that includes everything from stunning <strong>College students</strong> to classy <strong>Housewives</strong> and even <strong>High-profile models</strong> who are used to the VIP life. Our <strong>Russian escorts in ${cityName}</strong> are always in high demand because they bring that world-class beauty right to your doorstep. <br/><br/>Every girl in our ${cityName} circle is vetted, so you don't have to worry about quality. Whether it's a quick date or a long night of passion, our <strong>${cityName} call girls</strong> are ready to deliver. We've got local beauties and international stunners, so you're never short on options in this city.`
  ];

  const whyChoose = [
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Real Girls, No Fluff:</strong> No catfishing here. What you see is exactly what shows up at your door in ${cityName}.</li>
      <li><strong>Pay as You Go:</strong> Scared of scams? We don't take a single rupee in advance. <strong>Cash payment</strong> only.</li>
      <li><strong>Your Business is Yours:</strong> We're big on privacy. No records, no data leaks, just total discretion.</li>
      <li><strong>We Travel to You:</strong> Whether it's a <strong>home delivery</strong> or a <strong>hotel delivery</strong>, we make it happen.</li>
      <li><strong>Always On:</strong> It's 3 AM and you're lonely? No problem. We're available <strong>24/7</strong> in ${cityName}.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Verified & Real:</strong> We manually check every profile. Authentic <strong>${cityName} call girls</strong> only.</li>
      <li><strong>Safe Payments:</strong> Forget those sketchy online links. Pay the girl directly in <strong>cash</strong> when you meet.</li>
      <li><strong>Super Discreet:</strong> Your reputation is safe. We handle everything with the highest level of secrecy.</li>
      <li><strong>Top Tier Selection:</strong> From <strong>Russian beauties</strong> to local favorites, we only list the best.</li>
      <li><strong>Instant Connection:</strong> Grab a <strong>genuine ${cityName} call girls number</strong> and start chatting right away.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Handpicked Models:</strong> Every <strong>escort in ${cityName}</strong> is selected for her personality and looks.</li>
      <li><strong>Trust First:</strong> No advance, no hidden fees, no BS. Just straightforward <strong>cash payment</strong> on arrival.</li>
      <li><strong>Anonymity Guaranteed:</strong> We don't keep your info. Your identity is totally safe with us.</li>
      <li><strong>City-Wide Service:</strong> We cover every corner of ${cityName} with fast <strong>home and hotel delivery</strong>.</li>
      <li><strong>Available 24/7:</strong> Night or day, a premium companion in ${cityName} is just a call away.</li>
    </ul>`
  ];

  const bookingSteps = [
    `<ol class="list-decimal pl-5 space-y-2">
      <li><strong>Pick a Beauty:</strong> Browse through our <strong>verified profiles</strong> and see who catches your eye.</li>
      <li><strong>Say Hi:</strong> Call or WhatsApp the <strong>${cityName} call girls number</strong> you see on their profile.</li>
      <li><strong>Talk Details:</strong> Let her know where you are (Home or Hotel) and for how long you want to hang out.</li>
      <li><strong>The Meeting:</strong> Once she arrives, verify everything and settle the <strong>cash payment</strong>. Then, enjoy!</li>
    </ol>`,
    `<ol class="list-decimal pl-5 space-y-2">
      <li><strong>Find Your Match:</strong> Check out the latest <strong>${cityName} call girls</strong> on our list.</li>
      <li><strong>Get in Touch:</strong> Hit that WhatsApp button or give the <strong>genuine number</strong> a quick call.</li>
      <li><strong>Give Your Location:</strong> Tell us if it's a home or hotel date. Remember, no advance is needed!</li>
      <li><strong>Payment Time:</strong> When the model reaches you, just pay her in <strong>cash</strong> and start your session.</li>
    </ol>`
  ];

  const privacyTexts = [
    `Look, we know how it is. In the <strong>escort service in ${cityName}</strong> world, privacy isn't just a "feature"—it's the whole point. We've built this site to be a safe haven. We use encrypted chats and we never, ever store your personal info. Our girls are pros; they know how to be discreet so your private life stays exactly where it belongs—private. <br/><br/>Choosing us means you're picking an agency that actually gives a damn about your reputation. Grab a <strong>genuine ${cityName} call girls number</strong> and relax, knowing everything is handled with total secrecy.`,
    `We get that booking an <strong>escort in ${cityName}</strong> can feel a bit nerve-wracking. That's why we've made our system 100% anonymous. From your first text to the actual meeting, your details stay between us. We don't keep logs or share numbers. It's all very "under the radar." <br/><br/>Our name in ${cityName} stands for trust. When you pick a <strong>verified profile</strong> here, you're choosing safety. No digital footprints, just a simple <strong>cash payment</strong> and a night you won't forget.`,
    `Your secret is safe with us, seriously. We've helped plenty of guys in ${cityName} who need things kept quiet. Our <strong>${cityName} call girls</strong> are trained to be as professional and low-key as possible. We don't ask for registrations or any of that annoying stuff. No advance payment means no paper trail. <br/><br/>Whether you're a big shot or just a regular guy who wants to keep things private, our <strong>escort service in ${cityName}</strong> is your best bet. We handle every date with the utmost care, so you can just focus on having a good time without any worries.`
  ];

  return {
    metaTitle: hash % 2 === 0 ? `Genuine Call Girls in ${cityName} | ${cityName} Escorts - 100% Real 24/7` : `Top ${cityName} Call Girls | Elite Escort Service in ${cityName} - No Advance`,
    metaDescription: hash % 3 === 0 ? `Looking for real call girls in ${cityName}? We've got verified profiles, zero advance payment, and total privacy. Best escort service in ${cityName} for a fun night.` : `Find the most stunning ${cityName} call girls here. Verified photos, cash payment on arrival, and 24/7 delivery to your hotel or home. Discreet service in ${cityName}.`,
    metaKeywords: `${cityName} Escorts, call girls in ${cityName}, ${cityName} call girls, ${cityName} escort service, ${cityName} call girls number, genuine call girls ${cityName}, verified profiles, cash payment, home delivery, hotel delivery, 24/7`,
    h1: hash % 2 === 0 ? `Genuine Call Girls in ${cityName} - Real Escort Service 24/7` : `Meet Verified Call Girls in ${cityName} | Elite Escorts & No Advance`,
    heroSubtext: `Searching for a real connection? We've got the most <strong>exclusive call girls in ${cityName}</strong>. All our profiles are <strong>verified</strong>, from fun college girls to elite high-profile models. Safe, discreet, <strong>cash payment</strong>, and <strong>home delivery</strong> available. Get a <strong>genuine ${cityName} call girls number</strong> now.`,
    introHeading: hash % 2 === 0 ? `Looking for the Best Call Girls in ${cityName}? You're in Luck.` : `The Only Place for Real & Elite ${cityName} Call Girls`,
    introText: intros[hash % intros.length],
    whyChooseHeading: `Why You'll Love Our Call Girl Service in ${cityName}`,
    whyChooseText: whyChoose[hash % whyChoose.length],
    typesHeading: `Different Types of Call Girls We Have in ${cityName}`,
    typesText: types[hash % types.length],
    bookingHeading: `How to Book Your ${cityName} Call Girl — Super Easy Steps`,
    bookingText: bookingSteps[hash % bookingSteps.length],
    areasHeading: `We're Everywhere in ${cityName}`,
    areasText: `We don't leave any corner of ${cityName} untouched. Whether you're in a fancy hotel downtown or a quiet spot in ${state}, our girls can reach you fast. We're talking <strong>home delivery</strong> and <strong>hotel delivery</strong> throughout <strong>${cityName}</strong>, day or night. Wherever you're staying, we'll make sure you're not alone.`,
    rateHeading: `Fair Rates for Call Girls in ${cityName}`,
    rateIntro: `No one likes hidden fees. Here's a quick look at the rates for our <strong>escort service in ${cityName}</strong>. And remember, we strictly follow a <strong>no advance payment</strong> rule. You pay when you see her.`,
    privacyHeading: `Your Privacy is Our #1 Priority in ${cityName}`,
    privacyText: privacyTexts[hash % privacyTexts.length],
    faqHeading: `Still Got Questions? Check These Out.`,
    faqs: [
      { q: `Are the ${cityName} profiles actually real?`, a: `Yep, 100%. We check every girl manually. The photos are real, and the girls are <strong>verified</strong>. No fake stuff here.` },
      { q: `Can I get home delivery in ${cityName}?`, a: `Of course! We offer both <strong>home delivery</strong> and <strong>hotel delivery</strong> in ${cityName}. Just let us know where you are.` },
      { q: `How do I pay?`, a: `Only <strong>cash payment</strong> when you meet. We'll never ask for money upfront or online.` },
      { q: `Is this available right now?`, a: `Probably! We're open <strong>24/7</strong> in ${cityName}, so just give us a shout whenever.` },
      { q: `Do you have Russian girls in ${cityName}?`, a: `We sure do. Check out our high-profile and Russian escort section for something extra special.` }
    ],
    hindiText: hash % 2 === 0 ? `${cityName} mein genuine service chahiye? Faltu ki sites chhoro aur direct humein contact karo. Sabhi profiles **verified** hain aur hum koi **advance nahi lete**. <strong>Cash payment</strong> karo jab model se mil lo. Pure ${cityName} mein hum **24/7** available hain, chahe hotel ho ya ghar.` : `Bhai, agar tum ${cityName} mein real <strong>call girl service</strong> dhoond rahe ho to bilkul sahi jagah aaye ho. Koi advance ka lafda nahi, sirf genuine <strong>verified profiles</strong>. Meeting ke time pe <strong>cash payment</strong> dena. ${cityName} mein kahi bhi ho, hum 24/7 call pe hain.`,
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
