import StateGrid from "@/components/StateGrid";
import AdCard from "@/components/AdCard";
import { getAllCities } from "@/lib/data/locations";
import { getDeterministicImagesPool, getNameFromId, getPriceFromId } from "@/lib/ad-logic";
import CitySearch from "@/components/CitySearch";
import { getValue } from "@/lib/kv";

export default async function Home() {
  // Use a stable seed for featured ads
  const featuredImages = getDeterministicImagesPool("featured-home-seed", 8);
  const globalPhone = await getValue("contact_phone");

  return (
    <div>
      {/* Hero Search Section */}
      <section className="bg-gray-50 py-12 border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-6 uppercase tracking-tighter">
            Find Verified Adult Classifieds on <span className="text-red-600">CallGirl4U</span>
          </h1>
          
          <CitySearch cities={getAllCities()} layout="hero" />
        </div>
      </section>

      {/* Featured Ads Section */}
      {featuredImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 border-b">
          <h2 className="text-2xl text-gray-900 mb-6">Featured Profiles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredImages.map((imgPath, index) => {
              const adId = `featured-${index}`;
              const adName = getNameFromId(adId);
              const price = getPriceFromId(adId);
              
              return (
                 <AdCard 
                  key={index}
                  id={adId}
                  title={`${adName} - VIP Independent`}
                  location="Delhi NCR"
                  price={price}
                  imagePath={imgPath}
                  index={index}
                  phone={globalPhone || undefined}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* State + City Grid */}
      <StateGrid />
    </div>
  );
}
