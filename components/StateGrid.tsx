import { locations, getCitySlug, getStateSlug } from "@/lib/data/locations";
import Link from "next/link";

export default function StateGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Object.entries(locations).map(([state, cities]) => (
          <div key={state} className="space-y-2">
            <Link href={`/call-girls/state/${getStateSlug(state)}`}>
              <h4 className="font-bold text-red-600 text-sm border-b border-red-100 pb-1 hover:text-red-700 hover:border-red-600 transition-colors uppercase tracking-wider">{state}</h4>
            </Link>
            <ul className="space-y-1">
              {cities.map(city => (
                <li key={city}>
                  <Link
                    href={`/call-girls/${getCitySlug(city)}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {city} Call Girls
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
