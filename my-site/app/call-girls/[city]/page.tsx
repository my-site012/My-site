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

    `I know what you're thinking—is this another one of those scammy sites? Honestly, I'd be skeptical too. But we're doing things differently in ${cityName}. If you're searching for <strong>Call Girls in ${cityName}</strong> who actually look like their photos, you're in the right place. We've built a solid reputation for providing <strong>${cityName} call girls</strong> who are smart, gorgeous, and totally discreet. Finding a reliable <strong>escort service in ${cityName}</strong> shouldn't feel like a chore, so we've made it as smooth as possible. <br/><br/>We've got everyone from bubbly college girls to more sophisticated types, so whatever you're into, we can help. We're open <strong>24/7</strong> and we're super flexible with <strong>home delivery</strong> or <strong>hotel delivery</strong>. And the best part? No weird online transfers. Just <strong>cash payment</strong> when you meet. Simple, safe, and exactly how it should be in a city like ${cityName}.`,

    `Welcome to the most trusted platform for <strong>Call Girls in ${cityName}</strong>. We've been connecting guys like you with stunning, verified companions for a long time now. Our network in ${cityName} includes everyone from charming college beauties to sophisticated high-profile models. What makes us different from the hundreds of fake sites out there? Simple—we deliver exactly what we promise. Real girls, real photos, and zero advance payment. Our <strong>escort service in ${cityName}</strong> runs <strong>24/7</strong> because desire doesn't follow a schedule. Drop us a message and let us sort your evening out.`,

    `Ever tried finding a legit <strong>escort service in ${cityName}</strong> and ended up wasting hours on dead links and fake profiles? We get it. This city has plenty of time-wasters, but that's not us. We've spent years building a curated list of the finest <strong>${cityName} call girls</strong> who are serious about their craft. Every girl you see here has been personally vetted. Photos are genuine, numbers are active, and service is always top-tier. We're your one-stop destination for a discreet, premium experience in ${cityName}. <br/><br/>No fuss, no advance—just pure enjoyment from start to finish.`,

    `If you're a first-timer looking for <strong>Call Girls in ${cityName}</strong>, let us make this super easy for you. Forget everything you've heard about shady agencies. We operate with complete transparency, verified listings, and a no-advance policy that protects you from day one. Our <strong>${cityName} call girls</strong> are warm, welcoming, and experienced with guests of all backgrounds. Whether you're shy or confident, you'll feel at ease. We offer <strong>home delivery</strong> and <strong>hotel delivery</strong> so you don't even have to step out. Just browse, pick, and call. It's that simple.`,

    `${cityName} is a city with an energy all its own—and sometimes that energy demands the right company. We've handpicked the most genuine <strong>Call Girls in ${cityName}</strong> so you never have to settle for less. Our platform is trusted by thousands of satisfied clients who keep coming back for one simple reason: we deliver every single time. From stunning <strong>college beauties</strong> to exotic <strong>Russian escorts</strong>, our lineup has something for every taste. Service is available <strong>round the clock</strong>, everywhere in ${cityName}.`,

    `Late night and can't sleep in ${cityName}? Or maybe you've just checked into a hotel and the room feels too quiet? We understand that feeling. Our <strong>escort service in ${cityName}</strong> was built for moments exactly like these—where you need companionship fast, without complications. Our <strong>${cityName} call girls</strong> are just a WhatsApp message away. No lengthy forms, no sketchy advance payments, no stress. Browse our verified profiles, find a beauty that catches your eye, and have her at your door in no time. This is how it should work.`,

    `Business trip to ${cityName} or just passing through? Make it memorable. Our carefully selected <strong>escort service in ${cityName}</strong> caters to professionals and travelers who expect quality without compromise. We know you value your time, so we've made the process effortless. Browse verified profiles, WhatsApp your chosen companion, confirm your hotel address, and relax. Our <strong>${cityName} call girls</strong> are punctual, presentable, and professional. <strong>Cash payment on arrival</strong>—no digital trails, no awkward transfers. Just a smooth, discreet experience from start to finish.`,

    `Why do thousands of men in ${cityName} keep choosing us over every other option? Because we're honest. Our <strong>${cityName} call girls</strong> are real people with real photos. Our prices are fair and upfront. Our service runs <strong>24/7</strong> with zero hidden charges. Whether you want someone playful and young or mature and sophisticated, our <strong>escort service in ${cityName}</strong> covers it all. <strong>College girls</strong>, <strong>housewives</strong>, <strong>Russian beauties</strong>, and top-tier <strong>high-profile models</strong>—all available for <strong>home or hotel delivery</strong>. Stop searching. You're already here.`,

    `There's a reason we're the most searched <strong>escort service in ${cityName}</strong>—we actually care about your experience. Not just yours, but the girls' too. That mutual respect creates something rare in this industry: genuine chemistry. Our <strong>${cityName} call girls</strong> love what they do, and it shows every single time. We don't just list anyone. Every profile goes through our manual verification process. No catfish, no drama, no advance payment. <strong>Home delivery</strong> and <strong>hotel delivery</strong> available all day and all night in ${cityName}.`,

    `Heard too many horror stories about fake escort sites in ${cityName}? We built this platform as a direct response to that problem. Everything here is transparent—<strong>verified profiles</strong>, active contact numbers, and a strict <strong>no advance payment</strong> rule that keeps you protected. Our <strong>${cityName} call girls</strong> are real, responsive, and ready. We operate <strong>24/7</strong> across all areas of ${cityName}. Whether it's a quiet evening at home or a night at a premium hotel, we'll send someone perfect your way. No games, no ghosting—guaranteed.`,
  ];

  const types = [
    `Everyone has a "type," right? We've made sure our selection in ${cityName} is as diverse as the city itself. If you're into that youthful, fun energy, our <strong>College girls in ${cityName}</strong> are a huge hit. If you prefer someone more grounded and sophisticated, you'll love the <strong>Housewives</strong> in our list. <br/><br/>For those nights when you want something extra special, our elite <strong>Russian escorts</strong> are here to blow your mind. We also have <strong>High Profile models</strong> and independent girls for when you really want to level up your evening.`,

    `We don't believe in "one size fits all" when it comes to companionship. Our <strong>${cityName} call girls</strong> come from all walks of life. Maybe you're in the mood for a playful <strong>College girl</strong> who can keep the conversation light and fun? Or perhaps you're looking for the refined charm of a <strong>Housewife in ${cityName}</strong>? <br/><br/>For international flavor, our <strong>Russian call girls in ${cityName}</strong> are absolute showstoppers. We also work with <strong>Independent call girls</strong> who offer a really personalized, one-on-one vibe.`,

    `Finding the right partner is all about choice. In ${cityName}, we've put together a lineup from stunning <strong>College students</strong> to classy <strong>Housewives</strong> and <strong>High-profile models</strong> used to the VIP life. Our <strong>Russian escorts in ${cityName}</strong> are always in high demand. <br/><br/>Every girl in our ${cityName} circle is vetted. Whether it's a quick date or a long night, our <strong>${cityName} call girls</strong> are ready to deliver.`,

    `The beauty of our <strong>${cityName} escort service</strong> is the sheer variety. Are you someone who enjoys the spirited energy of a <strong>College girl in ${cityName}</strong>? Or prefer the warmth of a <strong>Housewife escort</strong>? <br/><br/>Looking to go truly international? Our <strong>Russian call girls in ${cityName}</strong> are breathtaking. For the ultimate VIP experience, our <strong>High Profile models</strong> know exactly how to treat a gentleman. The choice is yours.`,

    `Not all men want the same thing—and we've built our ${cityName} roster to reflect that reality. Our <strong>College escorts</strong> bring freshness and energy. Our <strong>Mature Housewife companions</strong> are perfect for deeper connection. <br/><br/>Our <strong>Russian escorts</strong> rank among the most requested profiles—glamorous, sophisticated, and attentive. We also have <strong>South Indian, Punjabi, and Bengali beauties</strong> for those who love diversity. ${cityName} has never had this much choice.`,

    `The most popular category in our ${cityName} listings depends on who you ask. Some swear by our <strong>Independent call girls in ${cityName}</strong> for the personal, no-agency vibe. Others love our exclusive <strong>High-Profile models</strong> who carry themselves with effortless elegance. <br/><br/>Then there are our <strong>Russian and foreign escorts</strong> who make every evening feel like a five-star vacation. And the timeless appeal of our <strong>College and Housewife escorts</strong> never fades.`,

    `Think of us as your personal menu for companionship in ${cityName}. Feeling adventurous? Try one of our exotic <strong>Russian call girls</strong>. Feeling more homely? Our <strong>Housewife escorts in ${cityName}</strong> will make you feel right at home. <br/><br/>For guys who love campus energy, our <strong>College girls in ${cityName}</strong> are fun, fresh, and full of life. And when only the best will do, our <strong>VIP High-Profile models</strong> are a cut above everything else.`,

    `Diversity is the soul of our <strong>escort service in ${cityName}</strong>. The <strong>College girls</strong> in our network bring genuine enthusiasm. The <strong>Housewife companions</strong> offer a different kind of comfort—experienced and wonderfully real. <br/><br/>Our international lineup featuring <strong>Russian escorts</strong> adds global flair to ${cityName}'s social scene. For those who want nothing but the finest, our <strong>Elite Model escorts</strong> are a rare treat.`,

    `We categorize our <strong>${cityName} call girls</strong> so you find exactly what you want. <strong>College Girls</strong>: young, playful, full of energy. <strong>Housewives</strong>: nurturing, sensual, engaging. <strong>Russian Escorts</strong>: world-class looks, cosmopolitan attitude. <br/><br/><strong>High-Profile Models</strong>: polished, poised, unforgettable. <strong>Independent Call Girls in ${cityName}</strong>: flexible, personal, and genuinely passionate. Pick your type and let the evening begin.`,

    `Our ${cityName} network is built to serve every kind of preference. Whether you're drawn to the innocence of a <strong>College beauty</strong>, the elegance of a <strong>High-profile escort</strong>, or the international charm of a <strong>Russian call girl in ${cityName}</strong>—we have exactly what you're looking for. <br/><br/>All girls are thoroughly verified. Your safety and satisfaction are our top priorities in ${cityName}, no matter what type of companion you choose.`,
  ];

  const whyChoose = [
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Real Girls, No Fluff:</strong> No catfishing. What you see is exactly what shows up in ${cityName}.</li>
      <li><strong>Pay as You Go:</strong> We don't take a single rupee in advance. <strong>Cash payment</strong> only.</li>
      <li><strong>Your Privacy Matters:</strong> No records, no data leaks, total discretion always.</li>
      <li><strong>We Travel to You:</strong> <strong>Home delivery</strong> or <strong>hotel delivery</strong>—your choice.</li>
      <li><strong>Always On:</strong> 3 AM and lonely? We're available <strong>24/7</strong> in ${cityName}.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Verified & Real:</strong> We manually check every profile. Authentic <strong>${cityName} call girls</strong> only.</li>
      <li><strong>Safe Payments:</strong> No sketchy online links. Pay directly in <strong>cash</strong> when you meet.</li>
      <li><strong>Super Discreet:</strong> Your reputation is safe. Highest level of secrecy guaranteed.</li>
      <li><strong>Top Tier Selection:</strong> From <strong>Russian beauties</strong> to local favorites, only the best.</li>
      <li><strong>Instant Connection:</strong> Get a <strong>genuine ${cityName} call girls number</strong> and start chatting today.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Handpicked Models:</strong> Every <strong>escort in ${cityName}</strong> is selected for personality and looks.</li>
      <li><strong>Trust First:</strong> No advance, no hidden fees. Straightforward <strong>cash payment</strong> on arrival.</li>
      <li><strong>Anonymity Guaranteed:</strong> We don't store your info. Your identity is totally safe.</li>
      <li><strong>City-Wide Service:</strong> Every corner of ${cityName} covered with fast <strong>home and hotel delivery</strong>.</li>
      <li><strong>Available 24/7:</strong> Night or day, a premium companion is just a call away.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Zero Advance Policy:</strong> Pay cash directly to the girl in ${cityName}. Never upfront.</li>
      <li><strong>Genuine Profiles Only:</strong> Every listing is manually reviewed. No fakes, no bots.</li>
      <li><strong>Wide Coverage:</strong> We serve every area and neighbourhood across ${cityName}.</li>
      <li><strong>Round-the-Clock Service:</strong> Our <strong>${cityName} call girls</strong> are available 24 hours, 7 days a week.</li>
      <li><strong>No Data Stored:</strong> We value your anonymity completely. Zero digital footprints.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>100% Authentic:</strong> Every <strong>call girl in ${cityName}</strong> is personally verified before listing.</li>
      <li><strong>No Advance Ever:</strong> We have a strict no-prepayment policy. Pay only when she arrives.</li>
      <li><strong>Fastest Response:</strong> Most requests in ${cityName} are fulfilled within the hour.</li>
      <li><strong>Premium Variety:</strong> College girls, housewives, Russian escorts, and VIP models—all here.</li>
      <li><strong>Complete Secrecy:</strong> No names, no logs, no records. Your meeting stays private forever.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>No Fake Profiles:</strong> We personally vet every <strong>${cityName} escort</strong> to ensure she's real.</li>
      <li><strong>Cash-Only Safety:</strong> No online transfers. Your money and safety are always protected.</li>
      <li><strong>Doorstep Delivery:</strong> We bring the companionship to you—hotel or home, anywhere in ${cityName}.</li>
      <li><strong>Flexible Timing:</strong> Book for an hour, a few hours, or a full night. No pressure.</li>
      <li><strong>Customer First:</strong> Your satisfaction is our priority. We go above and beyond every time.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Elite Network:</strong> Only the most beautiful and professional <strong>call girls in ${cityName}</strong> make our list.</li>
      <li><strong>Transparent Pricing:</strong> No surprises. Rates are discussed upfront before any meeting.</li>
      <li><strong>Private & Secure:</strong> Encrypted communication, no data sharing, total peace of mind.</li>
      <li><strong>Hotel Friendly:</strong> We know all the best hotels in ${cityName}. Discreet arrivals guaranteed.</li>
      <li><strong>Always Available:</strong> Day, night, or early morning—someone is always ready for you in ${cityName}.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Satisfaction Guaranteed:</strong> We stand behind the quality of every <strong>${cityName} escort</strong> we list.</li>
      <li><strong>No Hidden Charges:</strong> What you agree on is what you pay. Simple as that.</li>
      <li><strong>Fresh Listings:</strong> Our ${cityName} profiles are updated regularly so you always see new faces.</li>
      <li><strong>Easy Booking:</strong> One WhatsApp message is all it takes to set everything up.</li>
      <li><strong>Trusted by Thousands:</strong> Hundreds of satisfied clients in ${cityName} can't be wrong.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Real Photos:</strong> Every image is authentic. No stock photos or stolen pictures here.</li>
      <li><strong>Advance-Free Policy:</strong> Never pay before meeting. <strong>Cash on arrival</strong> in ${cityName}—always.</li>
      <li><strong>Multi-Category Choice:</strong> Russian, College, Housewife, Model—pick what suits your mood.</li>
      <li><strong>Same-Day Service:</strong> Book and meet today. No waiting, no lengthy processes in ${cityName}.</li>
      <li><strong>Absolute Confidentiality:</strong> We treat your privacy like our own. No exceptions, ever.</li>
    </ul>`,
    `<ul class="list-disc pl-5 space-y-2">
      <li><strong>Locally Trusted:</strong> We've been serving ${cityName} clients for years with consistent quality.</li>
      <li><strong>No Advance Needed:</strong> Pay the girl in cash when she arrives. Zero risk to you.</li>
      <li><strong>Discreet Packaging:</strong> Our girls arrive quietly and professionally—no one will know a thing.</li>
      <li><strong>VIP Treatment:</strong> Every client in ${cityName} is treated like a VIP, no matter the budget.</li>
      <li><strong>24/7 Support:</strong> Questions? We're always available to help you choose and book.</li>
    </ul>`,
  ];

  const bookingSteps = [
    `<ol class="list-decimal pl-5 space-y-2">
      <li><strong>Pick a Beauty:</strong> Browse our <strong>verified profiles</strong> and see who catches your eye.</li>
      <li><strong>Say Hi:</strong> Call or WhatsApp the <strong>${cityName} call girls number</strong> on their profile.</li>
      <li><strong>Talk Details:</strong> Let her know your location (Home or Hotel) and how long you need.</li>
      <li><strong>Enjoy:</strong> Once she arrives, verify and settle the <strong>cash payment</strong>. Then enjoy!</li>
    </ol>`,
    `<ol class="list-decimal pl-5 space-y-2">
      <li><strong>Find Your Match:</strong> Check out the latest <strong>${cityName} call girls</strong> on our list.</li>
      <li><strong>Get in Touch:</strong> Hit WhatsApp or call the <strong>genuine number</strong> directly.</li>
      <li><strong>Share Location:</strong> Home or hotel—tell us where you are. No advance needed!</li>
      <li><strong>Pay & Play:</strong> When she reaches you, pay in <strong>cash</strong> and start your session.</li>
    </ol>`,
    `<ol class="list-decimal pl-5 space-y-2">
      <li><strong>Browse Profiles:</strong> Explore our wide selection of <strong>verified ${cityName} escorts</strong>.</li>
      <li><strong>Send a Message:</strong> WhatsApp the girl you like with a simple greeting.</li>
      <li><strong>Confirm Details:</strong> Agree on timing, duration, and your address in ${cityName}.</li>
      <li><strong>Welcome Her:</strong> She arrives, you verify she matches her photos, then pay <strong>cash</strong>.</li>
    </ol>`,
    `<ol class="list-decimal pl-5 space-y-2">
      <li><strong>Choose Wisely:</strong> Take your time browsing—we have plenty of beautiful <strong>call girls in ${cityName}</strong>.</li>
      <li><strong>Make Contact:</strong> Use the WhatsApp button on her profile for instant connection.</li>
      <li><strong>Set the Scene:</strong> Tell her your hotel name or home address. No advance payment required.</li>
      <li><strong>Settle Up:</strong> Greet her, verify her identity, pay <strong>cash on arrival</strong>, and enjoy your evening.</li>
    </ol>`,
    `<ol class="list-decimal pl-5 space-y-2">
      <li><strong>Scroll & Select:</strong> Find a profile you love from our handpicked <strong>${cityName} call girls</strong>.</li>
      <li><strong>One Click Connect:</strong> Tap WhatsApp and introduce yourself casually.</li>
      <li><strong>Location & Duration:</strong> Share your ${cityName} address and preferred time slot.</li>
      <li><strong>Cash & Enjoy:</strong> She arrives on time, you pay in cash, and the magic begins.</li>
    </ol>`,
  ];

  const privacyTexts = [
    `Look, we know how it is. In the <strong>escort service in ${cityName}</strong> world, privacy isn't just a "feature"—it's the whole point. We've built this site to be a safe haven. We never store your personal info and our girls are pros at discretion. <br/><br/>Choosing us means picking an agency that actually cares about your reputation. Grab a <strong>genuine ${cityName} call girls number</strong> and relax, knowing everything is handled with total secrecy.`,
    `We get that booking an <strong>escort in ${cityName}</strong> can feel nerve-wracking. That's why we've made our system 100% anonymous. From your first text to the actual meeting, your details stay between us. We don't keep logs or share numbers. <br/><br/>Our name in ${cityName} stands for trust. Pick a <strong>verified profile</strong> here and you're choosing safety. No digital footprints, just a simple <strong>cash payment</strong> and a night you won't forget.`,
    `Your secret is safe with us. We've helped plenty of guys in ${cityName} who need things kept quiet. Our <strong>${cityName} call girls</strong> are trained to be professional and low-key. No registrations, no annoying forms. No advance payment means no paper trail. <br/><br/>Whether you're a big shot or a regular guy wanting privacy, our <strong>escort service in ${cityName}</strong> is your best bet. We handle every date with utmost care.`,
    `Privacy is not an afterthought for us—it's built into every part of how we operate in ${cityName}. We communicate through secure channels and zero personal data is ever stored on our end. Our <strong>${cityName} call girls</strong> are briefed to be completely anonymous when they visit. <br/><br/>The <strong>cash payment</strong> model means there's no bank record, no credit card statement, nothing connecting you to the service. Just a private, enjoyable experience in ${cityName}.`,
    `We've been trusted by thousands of discreet clients across ${cityName} because we take secrecy seriously. No names are exchanged beyond what's necessary. No screenshots, no records, no gossip. Our <strong>escort service in ${cityName}</strong> operates like a sealed vault. <br/><br/>You deserve to enjoy your private time without worry. That's why we built everything from the ground up with your anonymity as the top priority. Trust us once and you'll understand why everyone comes back.`,
    `In ${cityName}, our reputation for discretion is unmatched. When you contact us, your information goes nowhere. When our <strong>call girl</strong> arrives, she's professional and private. When you pay in <strong>cash</strong>, there's zero digital trace. <br/><br/>We've designed every step of the process to protect you completely. No registrations required, no accounts to create, no personal data to worry about. This is what genuine privacy looks like in the <strong>escort service in ${cityName}</strong>.`,
    `A lot of guys in ${cityName} are worried about privacy—and rightfully so. That's why we've never stored a single client's data since day one. Our <strong>${cityName} call girls</strong> sign confidentiality agreements and take your privacy as seriously as we do. <br/><br/>There are no online payment links, no email confirmations, no app notifications. Just a private WhatsApp chat and a discreet <strong>cash payment</strong> at your door. Clean, simple, and completely secure.`,
    `We understand that privacy is everything when it comes to booking <strong>call girls in ${cityName}</strong>. That's why we've stripped away everything that could create a trail. No accounts, no logins, no receipts. Just you, a verified companion, and a private evening. <br/><br/>Our girls arrive in regular clothing, with no signage or giveaways. They're trained for discretion in hotel lobbies, apartment buildings, and gated communities across ${cityName}. Your secret stays yours, always.`,
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
  
  const totalAdsToShow = 48; 
  
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

      {/* Tags Section */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {([
            `Call Girls in ${cityName}`,
            `${cityName} Call Girls`,
            `Call Girl service in ${cityName}`,
            `${cityName} Escorts`,
            `escort service in ${cityName}`,
            `${cityName} call girls number`,
            `genuine call girls ${cityName}`,
            `college girls in ${cityName}`,
            `Russian call girls ${cityName}`,
            `housewife in ${cityName}`,
            `${cityName} independent escorts`,
            `cheap call girls in ${cityName}`,
            `female escorts in ${cityName}`,
            `model escorts ${cityName}`,
            `VIP call girls ${cityName}`,
            `high profile escorts ${cityName}`,
            `call girl near me ${cityName}`,
            `hotel call girls ${cityName}`,
            `home delivery call girls ${cityName}`,
            `${cityName} call girl agency`,
            `24/7 escorts ${cityName}`,
            `verified call girls ${cityName}`,
            `${cityName} female call girls`,
            `call girls contact number ${cityName}`,
            `${cityName} sex girl`,
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
