import { getCallGirlsSlug, POPULAR_CITIES } from "@/lib/data/locations";
import Link from "next/link";

export default function StateGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Popular Cities Section */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight">
              🔥 Most Popular <span className="text-red-600">Cities</span>
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              Direct access to top classifieds &amp; companions in major Indian metro cities
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {POPULAR_CITIES.map((city) => (
            <Link
              key={city}
              prefetch={false}
              href={`/call-girls/${getCallGirlsSlug(city)}`}
              className="px-4 py-2 bg-gray-50 hover:bg-red-50 text-gray-800 hover:text-red-600 font-medium text-sm rounded-lg border border-gray-200 hover:border-red-300 transition-all shadow-2xs hover:shadow-xs active:scale-95"
            >
              {city}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


