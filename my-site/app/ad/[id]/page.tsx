import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import AdCard from "@/components/AdCard";
import ReportModal from "@/components/ReportModal";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId, getHash, getContactNumber } from "@/lib/ad-logic";
import { getValue } from "@/lib/kv";
import WhatsAppButton from "@/components/WhatsAppButton";

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

const services = ["GFE (Girlfriend Experience)", "Incall Menu", "Outcall Delivery", "Body Massage", "Dinner Date", "Night Stay", "Roleplay", "Party Companion"];
const languages = ["English", "Hindi", "Punjabi", "Marathi"];

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Parse ID details
  const locationParts = id.split('-');
  const rawLocation = locationParts.length > 1 ? locationParts[0] : "Mumbai";
  const adIndex = locationParts.length > 1 ? parseInt(locationParts[locationParts.length - 1]) : 0;
  
  // Consistency Logic
  const name = getNameFromId(id);
  const hash = getHash(id);
  const age = 21 + (hash % 8); 
  const location = rawLocation.replace(/\b\w/g, c => c.toUpperCase());
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

  // Image Selection (Must match CityPage exactly)
  let profileImages: string[] = [];
  if (id.includes('-') && !id.startsWith('featured')) {
    const cityPool = getDeterministicImagesPool(rawLocation, 24); 
    const mainImg = cityPool[adIndex % cityPool.length];
    
    // For gallery, we take shifted versions from the same city pool to keep it consistent
    profileImages = [
        mainImg, 
        cityPool[(adIndex + 1) % cityPool.length], 
        cityPool[(adIndex + 2) % cityPool.length], 
        cityPool[(adIndex + 3) % cityPool.length]
    ];
    
    // Add extra for related section
    for(let i=4; i<12; i++) {
        profileImages.push(cityPool[(adIndex + i) % cityPool.length]);
    }
  } else {
    // For featured, use id pool
    profileImages = getDeterministicImagesPool(id, 12); 
  }
  
  const mainImage = profileImages.length > 0 ? profileImages[0] : "";
  const galleryImages = profileImages.slice(1, 4);
  const relatedImages = profileImages.slice(4, 8); 

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <span>›</span>
          <Link href={`/call-girls/${rawLocation}`} className="hover:text-red-600">{location}</Link>
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
                  <p className="text-lg text-gray-600 mt-1 uppercase font-bold text-sm tracking-widest border-l-4 border-red-600 pl-3">Independent in {location}</p>
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
                   Hi, I am {name}. I am a high-profile independent companion available for genuine clients in {location}. 
                   I provide safe and satisfying service with 100% genuine photos. No advance payment required. 
                   Message me on WhatsApp or call me directly to book your appointment. Total privacy guaranteed.
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
        {relatedImages.length > 0 && (
          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-tight">
               Other Real Profiles in {location}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedImages.map((imgPath, index) => {
                const siblingId = `${rawLocation}-${adIndex + index + 5}`;
                const siblingName = getNameFromId(siblingId);
                const siblingPrice = getPriceFromId(siblingId);
                return (
                  <AdCard 
                    key={index}
                    id={siblingId}
                    title={`${siblingName} - Independent`}
                    location={location}
                    price={siblingPrice}
                    imagePath={imgPath}
                    index={index}
                    phone={globalPhone || undefined}
                  />
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
