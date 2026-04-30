"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCitySlug } from "@/lib/data/locations";

interface CitySearchProps {
  cities: string[];
  layout?: "header" | "hero";
}

export default function CitySearch({ cities, layout = "header" }: CitySearchProps) {
  const [selectedCity, setSelectedCity] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!selectedCity || selectedCity === "Select City") return;
    const slug = getCitySlug(selectedCity);
    router.push(`/call-girls/${slug}`);
  };

  if (layout === "header") {
    return (
      <>
        <select 
          className="border rounded px-3 py-1.5 text-sm flex-1 max-w-xs hidden md:block text-gray-700"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option>Select City</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <button 
          onClick={handleSearch}
          className="bg-red-600 text-white px-4 py-1.5 rounded text-sm hidden md:block hover:bg-red-700 transition font-medium"
        >
          Search
        </button>
      </>
    );
  }

  // Hero layout
  return (
    <div className="flex flex-col md:flex-row gap-3 justify-center items-center w-full max-w-3xl mx-auto shadow-xl p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
      <select className="p-4 border-0 rounded-lg shadow-sm w-full md:w-1/3 text-gray-700 font-medium focus:ring-2 focus:ring-red-500 outline-none">
        <option>Category: Call Girls</option>
      </select>
      
      <select 
        className="p-4 border-0 rounded-lg shadow-sm w-full md:w-1/3 text-gray-700 font-medium focus:ring-2 focus:ring-red-500 outline-none"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option>Select City</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      
      <button 
        onClick={handleSearch}
        className="bg-red-600 text-white font-bold px-10 py-4 rounded-lg shadow-lg w-full md:w-auto hover:bg-red-700 transform hover:scale-105 transition-all"
      >
        SEARCH NOW
      </button>
    </div>
  );
}
