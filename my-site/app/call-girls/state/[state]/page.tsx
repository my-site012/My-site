import { locations, getAllStates, getStateSlug, getCitySlug } from "@/lib/data/locations";
import AdCard from "@/components/AdCard";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import { getCitySeo } from "@/lib/seo-templates";

export async function generateStaticParams() {
  return getAllStates().map(state => ({
    state: getStateSlug(state)
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const customSeo = getCitySeo(state);

  return {
    title: customSeo.title,
    description: customSeo.description,
    alternates: {
      canonical: `https://callgirl4u.com/call-girls/state/${state}`,
    }
  };
}

function getRandomImages(count: number): string[] {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(imagesDir)) return [];
    const files = fs.readdirSync(imagesDir).filter(file => file.endsWith(".webp") || file.endsWith(".jpg") || file.endsWith(".png"));
    const shuffled = [...files].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(file => `/images/${file}`);
  } catch (error) {
    return [];
  }
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  
  // Find original state name from slug
  const allStates = getAllStates();
  const stateName = allStates.find(s => getStateSlug(s) === state) || state.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  
  const cities = locations[stateName] || [];
  const profileImages = getRandomImages(12);
  const defaultNames = ["Priya", "Neha", "Kajal", "Simran", "Riya", "Pooja", "Deepika", "Nisha", "Aarti", "Meera"];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 text-uppercase">
            Call Girls in {stateName} – Verified & Available 24/7
          </h1>
          <p className="text-gray-600 text-lg">
            Browse the most beautiful and verified call girls available across all major cities in {stateName}. 
            Safe, discreet service with 100% genuine profiles.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Cities in this State */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-xl mb-4 text-gray-900 border-b pb-2">Cities in {stateName}</h3>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {cities.map((city) => (
                <Link 
                  key={city} 
                  href={`/call-girls/${getCitySlug(city)}`}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium"
                >
                  {city} Escorts
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content: Featured Profiles in State */}
        <main className="lg:col-span-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Rated Profiles in {stateName}</h2>
          
          {profileImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {profileImages.map((imgPath, index) => (
                <AdCard 
                  key={index}
                  id={`${state}-${index}`}
                  title={`${defaultNames[index % defaultNames.length]} - ${stateName} Elite`}
                  location={cities[index % cities.length] || stateName}
                  price={(Math.floor(Math.random() * 10) + 5) * 1000}
                  imagePath={imgPath}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
              <p className="text-gray-500 text-lg italic">Coming soon... No profiles found in {stateName} yet.</p>
            </div>
          )}

          {/* State SEO Text Block */}
          <div className="mt-16 prose prose-lg prose-red max-w-none text-gray-800">
            <h2 className="text-3xl font-black text-gray-900 mb-6">Premier Call Girls & Escort Services in {stateName}</h2>
            <p>
              Looking for top-tier companionship in {stateName}? CallGirl4U brings you a curated list of verified 
              independent escorts across the entire state. Our platform ensures that you connect with genuine profiles for 
              an unforgettable experience. Whether you're traveling for business or residing locally, the best {stateName} call girls 
              are just a click away.
            </p>
            <p>
              We cover all major hubs in {stateName}, providing safe and discreet services. Our models are known for their 
              professionalism and beauty. From college girls to high-profile independent companions, the variety at 
              CallGirl4U is unmatched. We prioritize your privacy and guarantee no advance payment fraud—simply pay 
              cash on delivery and enjoy the finest escort service in {stateName}.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
