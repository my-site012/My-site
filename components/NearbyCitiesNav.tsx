import Link from "next/link";
import { getNearbyCities, getCityReviewData } from "@/lib/seo-enhancements";
import { getCitySlug } from "@/lib/data/locations";

interface NearbyCitiesNavProps {
  cityName: string;
  citySlug: string;
  stateName: string;
  categorySlug?: string;
  categoryLabel?: string;
  subAreas?: string[];
}

export default function NearbyCitiesNav({
  cityName,
  citySlug,
  stateName,
  categorySlug = "call-girls",
  categoryLabel = "Escorts",
  subAreas = [],
}: NearbyCitiesNavProps) {
  const nearbyCities = getNearbyCities(citySlug, cityName, 12);
  const reviews = getCityReviewData(citySlug);

  return (
    <section aria-label="Nearby Locations and Directory Navigation" className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
      {/* Verified Rating Badge (Point 1 Trust signal) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            {cityName} Directory &amp; Nearby Locations
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Verified local advertiser listings across {stateName}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold text-amber-900 shadow-xs">
          <span className="text-amber-500">★★★★★</span>
          <span className="font-bold">{reviews.ratingValue} / 5</span>
          <span className="text-amber-700 text-xs">({reviews.reviewCount} Reviews)</span>
        </div>
      </div>

      {/* Sub-areas if available */}
      {subAreas.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Popular Areas in {cityName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {subAreas.map((area) => (
              <Link
                key={area}
                prefetch={false}
                href={`/${categorySlug}/${getCitySlug(area)}`}
                className="text-xs md:text-sm font-medium bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                {area} {categoryLabel}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Cities in same state */}
      {nearbyCities.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Other Cities in {stateName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {nearbyCities.map((c) => (
              <Link
                key={c.slug}
                prefetch={false}
                href={`/${categorySlug}/${c.slug}`}
                className="text-xs md:text-sm font-medium bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
