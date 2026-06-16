"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCitySlug } from "@/lib/data/locations";
import SearchableSelect from "./SearchableSelect";

interface CitySearchProps {
  cities: string[];
  layout?: "header" | "hero";
}

export default function CitySearch({ cities, layout = "header" }: CitySearchProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize category based on URL path
  const getInitialCategory = () => {
    if (pathname?.startsWith("/massage")) {
      return "massage";
    }
    return "call-girls";
  };

  const [category, setCategory] = useState("call-girls");
  const [selectedCity, setSelectedCity] = useState("");

  // Sync category if pathname changes
  useEffect(() => {
    setCategory(getInitialCategory());
  }, [pathname]);

  const handleSearch = () => {
    if (!selectedCity || selectedCity === "Select City") return;
    const slug = getCitySlug(selectedCity);
    
    // Save selected city and category in cookies (valid for 1 year)
    document.cookie = `user-city=${slug}; path=/; max-age=31536000`;
    document.cookie = `user-category=${category}; path=/; max-age=31536000`;

    router.push(`/${category}/${slug}`);
  };

  const categories = ["Category: Call Girls", "Category: Massage"];
  
  const getCategoryDisplay = (catVal: string) => {
    return catVal === "massage" ? "Category: Massage" : "Category: Call Girls";
  };

  const handleCategoryChange = (displayVal: string) => {
    if (displayVal.includes("Massage")) {
      setCategory("massage");
    } else {
      setCategory("call-girls");
    }
  };

  if (layout === "header") {
    return (
      <div className="hidden md:flex gap-2 items-center flex-1 max-w-xs justify-end">
        <SearchableSelect 
          options={cities}
          value={selectedCity}
          onChange={setSelectedCity}
          placeholder="Select City"
          layout="header"
        />
        <button 
          onClick={handleSearch}
          className="bg-red-600 text-white px-4 py-1.5 rounded text-sm hover:bg-red-700 transition font-medium cursor-pointer shrink-0"
        >
          Search
        </button>
      </div>
    );
  }

  // Hero layout
  return (
    <div className="flex flex-col md:flex-row gap-3 justify-center items-center w-full max-w-3xl mx-auto shadow-xl p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
      <div className="w-full md:w-1/3">
        <SearchableSelect
          options={categories}
          value={getCategoryDisplay(category)}
          onChange={handleCategoryChange}
          placeholder="Select Category"
          layout="hero"
          searchable={false}
        />
      </div>
      
      <div className="w-full md:w-1/3">
        <SearchableSelect
          options={cities}
          value={selectedCity}
          onChange={setSelectedCity}
          placeholder="Select City"
          layout="hero"
        />
      </div>
      
      <button 
        onClick={handleSearch}
        className="bg-red-600 text-white font-bold px-10 py-4 rounded-lg shadow-lg w-full md:w-auto hover:bg-red-700 transform hover:scale-105 transition-all cursor-pointer whitespace-nowrap"
      >
        SEARCH NOW
      </button>
    </div>
  );
}
