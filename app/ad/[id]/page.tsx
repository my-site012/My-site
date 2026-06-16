import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import AdCard from "@/components/AdCard";
import ReportModal from "@/components/ReportModal";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId, getHash, getContactNumber } from "@/lib/ad-logic";
import { getValue } from "@/lib/kv";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getAllStates, getStateSlug } from "@/lib/data/locations";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    robots: {
      index: false,
      follow: true, 
    },
    alternates: {
      canonical: `https://callgirl4u.com/ad/${id}`,
    }
  };
}

const services = [
  "GFE (Girlfriend Experience)", 
  "Incall Menu", 
  "Outcall Delivery", 
  "Body Massage", 
  "Dinner Date", 
  "Night Stay", 
  "Roleplay", 
  "Party Companion",
  "Blowjob",
  "Oral Sex",
  "Incall",
  "Outcall",
  "Condom Sex",
  "Without Condom Sex"
];
const languages = ["English", "Hindi", "Punjabi", "Marathi"];

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Parse ID details
  const locationParts = id.split('-');
  const isMassage = id.startsWith('msg-');
  const isFeatured = id.startsWith('featured');

  let rawLocation = "Mumbai";
  let adIndex = 0;

  if (isFeatured) {
    rawLocation = "featured";
    adIndex = locationParts.length > 1 ? parseInt(locationParts[locationParts.length - 1]) : 0;
  } else if (isMassage) {
    // ID format: msg-city-slug-index (e.g., msg-aerocity-0 or msg-new-delhi-0)
    // First element is "msg", last element is the index, middle elements are the city slug
    rawLocation = locationParts.slice(1, -1).join('-');
    adIndex = locationParts.length > 2 ? parseInt(locationParts[locationParts.length - 1]) : 0;
  } else {
    // ID format: city-slug-index (e.g., aerocity-0 or new-delhi-0)
    // Last element is the index, elements before that are the city slug
    rawLocation = locationParts.slice(0, -1).join('-');
    adIndex = locationParts.length > 1 ? parseInt(locationParts[locationParts.length - 1]) : 0;
    if (!rawLocation) {
      rawLocation = "Mumbai";
    }
  }
  
  // Consistency Logic
  const name = getNameFromId(id);
  const hash = getHash(id);
  const age = 21 + (hash % 8); 
  const location = rawLocation.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const price = getPriceFromId(id);

  // Fetch global phone from KV
  const globalPhone = await getValue("contact_phone");
  const displayPhone = globalPhone || getContactNumber(id);
  
  const girlServices = [
    services[hash % services.length],
    services[(hash + 1) % services.length],
    services[(hash + 2) % services.length],
    services[(hash + 4) % services.length]
  ];

  const spokenLanguages = `${languages[hash % languages.length]}, ${languages[(hash + 1) % languages.length]}`;

  const isState = getAllStates().some(s => getStateSlug(s) === rawLocation);

  // Image Selection (Must match CityPage / MassageCityPage exactly)
  let profileImages: string[] = [];
  if (isFeatured) {
    profileImages = getDeterministicImagesPool(id, 4); 
  } else if (isMassage) {
    const seedKey = `msg-${rawLocation}`;
    const cityPool = getDeterministicImagesPool(seedKey, 48);
    const mainImg = cityPool[adIndex % cityPool.length];
    profileImages = [
        mainImg,
        cityPool[(adIndex + 1) % cityPool.length],
        cityPool[(adIndex + 2) % cityPool.length],
        cityPool[(adIndex + 3) % cityPool.length]
    ];
  } else if (isState) {
    const statePool = getDeterministicImagesPool(rawLocation, 12);
    const mainImg = statePool[adIndex % statePool.length];
    profileImages = [
        mainImg,
        statePool[(adIndex + 1) % statePool.length],
        statePool[(adIndex + 2) % statePool.length],
        statePool[(adIndex + 3) % statePool.length]
    ];
  } else {
    const cityPool = getDeterministicImagesPool(rawLocation, 48); 
    const mainImg = cityPool[adIndex % cityPool.length];
    
    // For gallery, we take shifted versions from the same city pool to keep it consistent
    profileImages = [
        mainImg, 
        cityPool[(adIndex + 1) % cityPool.length], 
        cityPool[(adIndex + 2) % cityPool.length], 
        cityPool[(adIndex + 3) % cityPool.length]
    ];
  }
  
  const mainImage = profileImages.length > 0 ? profileImages[0] : "";
  const galleryImages = profileImages.slice(1, 4); 

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>›</span>
          <Link href={isMassage ? `/massage/${rawLocation}` : `/call-girls/${rawLocation}`} className="hover:text-red-600">{location}</Link>
          <span>›</span>
          <span className="text-gray-800 font-medium">{name} Profile</span>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-6">
            
            <div className="space-y-4">
              <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-gray-200">
                {mainImage ? (
                  <Image src={mainImage} alt={`Profile of ${name} in ${location}`} fill className="object-cover" priority unoptimized={true} />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase">No Photo</div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="relative w-full aspect-[3/4] rounded shadow-sm overflow-hidden bg-gray-200 cursor-pointer hover:opacity-90">
                    <Image src={img} alt={`${name} Gallery ${idx+1}`} fill className="object-cover" unoptimized={true} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {name} <span className="text-green-500 text-xl" title="Verified Profile">✅</span>
                  </h1>
                  <p className="text-lg text-gray-600 mt-1 uppercase font-bold text-sm tracking-widest border-l-4 border-red-600 pl-3">
                    {isMassage ? "Massage Therapist" : "Independent"} in {location}
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 font-extrabold px-4 py-2 rounded-lg border border-green-200 shadow-sm">
                  ₹{price} <span className="text-xs font-normal">/ Shot</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase font-bold">Age</span>
                  <span className="font-semibold text-gray-900">{age} Years</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase font-bold">Location</span>
                  <span className="font-semibold text-gray-900">{location}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase font-bold">Language</span>
                  <span className="font-semibold text-gray-900">{spokenLanguages}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase font-bold">Availability</span>
                  <span className="font-semibold text-gray-900 text-green-600">Available Now</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 text-gray-900 uppercase text-sm border-b pb-1">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {girlServices.map(srv => (
                    <span key={srv} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100 uppercase">
                      {srv}
                    </span>
                  ))}
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200 uppercase">Cash Only</span>
                </div>
              </div>

              <div className="mb-8">
                 <h3 className="font-bold text-lg mb-2 text-gray-900 uppercase text-sm border-b pb-1">About Profile</h3>
                 <p className="text-gray-700 text-sm leading-relaxed">
                   {isMassage ? (
                     <>
                       Hello gentlemen, I am <strong className="font-bold">{name}</strong>, a premium companion offering top-class <strong className="font-bold">Massage Service in {location}</strong>. If you are looking for a <strong className="font-bold">Verified Massage Therapist in {location}</strong> who values your privacy, I am the perfect choice. You can contact me directly on my <strong className="font-bold">Massage Therapist WhatsApp Number</strong> for booking. I offer both incall and outcall services with <strong className="font-bold">Cash on Delivery</strong>—absolutely no advance payments required. Let's spend a memorable time together!
                     </>
                   ) : (
                     <>
                       Hello gentlemen, I am <strong className="font-bold">{name}</strong>, a premium companion offering top-class <strong className="font-bold">Escort Service in {location}</strong>. If you are looking for <strong className="font-bold">Verified Call Girls in {location}</strong> who value your privacy, I am the perfect choice. You can contact me directly on my <strong className="font-bold">Call Girl WhatsApp Number</strong> for booking. I offer both incall and outcall services with <strong className="font-bold">Cash on Delivery</strong>—absolutely no advance payments required. Let's spend a memorable time together!
                     </>
                   )}
                 </p>
              </div>

              <div className="mt-auto bg-gray-900 p-6 rounded-2xl border border-gray-800 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="text-6xl text-white font-black italic select-none">VIP</span>
                </div>
                <h3 className="text-xl font-bold mb-5 text-center uppercase tracking-widest text-red-500 relative z-10">Instant Booking</h3>
                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                  <a 
                    href={`tel:${displayPhone}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl flex justify-center items-center gap-2 transition shadow-lg active:scale-95"
                  >
                     <span>📞 Call Now</span>
                  </a>
                  <WhatsAppButton 
                    phone={displayPhone}
                    message={isMassage 
                      ? `Hi, My name is ___, I am in ${location} and I need a massage service. Please share details. (${name})`
                      : `Hi, My name is ___, I am in ${location} and I need a call girl. Please share a photo. (${name})`
                    }
                    adContext={{ profileName: name, location: location, pageUrl: `/ad/${id}` }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-xl flex justify-center items-center gap-2 transition shadow-lg active:scale-95"
                  >
                     <span>💬 WhatsApp</span>
                  </WhatsAppButton>
                </div>
                <p className="text-[10px] text-center text-gray-400 mt-4 uppercase font-bold tracking-tighter">
                   Safety First: Only meet in safe places. no advance.
                </p>

                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-center">
                  <ReportModal adTitle={name} adId={id} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RELATED ADS */}
        <div className="pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-tight">
             {isMassage ? `Other Massage Therapists in ${location}` : `Other Real Profiles in ${location}`}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => {
              const siblingIndex = (adIndex + index + 5) % (isFeatured ? 8 : (isState ? 12 : 48));
              
              let siblingId = "";
              let siblingImg = "";
              
              if (isFeatured) {
                siblingId = `featured-${siblingIndex}`;
                siblingImg = getDeterministicImagesPool(siblingId, 12)[0];
              } else if (isMassage) {
                siblingId = `msg-${rawLocation}-${siblingIndex}`;
                const seedKey = `msg-${rawLocation}`;
                const cityPool = getDeterministicImagesPool(seedKey, 48);
                siblingImg = cityPool[siblingIndex % cityPool.length];
              } else if (isState) {
                siblingId = `${rawLocation}-${siblingIndex}`;
                const statePool = getDeterministicImagesPool(rawLocation, 12);
                siblingImg = statePool[siblingIndex % statePool.length];
              } else {
                siblingId = `${rawLocation}-${siblingIndex}`;
                const cityPool = getDeterministicImagesPool(rawLocation, 48);
                siblingImg = cityPool[siblingIndex % cityPool.length];
              }
              
              const siblingName = getNameFromId(siblingId);
              const siblingPrice = getPriceFromId(siblingId);
              const siblingTitle = isMassage ? `${siblingName} - Massage Therapist` : `${siblingName} - Independent`;

              return (
                <AdCard 
                  key={index}
                  id={siblingId}
                  title={siblingTitle}
                  location={location}
                  price={siblingPrice}
                  imagePath={siblingImg}
                  index={index}
                  phone={globalPhone || undefined}
                />
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
