import { locations, getCitySlug, getStateSlug, getCallGirlsSlug } from "@/lib/data/locations";
import Link from "next/link";

interface ServiceStateGridProps {
  category: "call-girls" | "call-boys" | "massage";
  titlePrefix?: string;
}

export default function ServiceStateGrid({ category, titlePrefix }: ServiceStateGridProps) {
  const categoryLabels = {
    "call-girls": "Call Girls",
    "call-boys": "Call Boys",
    "massage": "Massage Services",
  };

  const label = titlePrefix || categoryLabels[category];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight text-center">
        Explore <span className="text-red-600">{label}</span> by State & City
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Object.entries(locations).map(([state, cities]) => {
          if (cities.length === 0) return null;
          const isRealState = !state.endsWith(" Locations") && state !== "Other Locations";
          return (
            <div key={state} className="space-y-2">
              {isRealState ? (
                <Link prefetch={false} href={`/${category}/state/${getStateSlug(state)}`}>
                  <h4 className="font-bold text-red-600 text-sm border-b border-red-100 pb-1 hover:text-red-700 hover:border-red-600 transition-colors uppercase tracking-wider">
                    {state}
                  </h4>
                </Link>
              ) : (
                <h4 className="font-bold text-red-600 text-sm border-b border-red-100 pb-1 uppercase tracking-wider">
                  {state}
                </h4>
              )}
              <ul className="space-y-1">
                {cities.map(city => (
                  <li key={city}>
                    <Link prefetch={false} href={`/${category}/${category === "call-girls" ? getCallGirlsSlug(city) : getCitySlug(city)}`}
                      className="text-blue-600 hover:underline text-sm capitalize">
                      {city} {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
