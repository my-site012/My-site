import Link from "next/link";
import { getAllCities } from "@/lib/data/locations";
import CitySearch from "./CitySearch";

export default function Header() {
  return (
    <header className="bg-white border-b-2 border-red-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-1 md:gap-3">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-3xl font-black tracking-tighter flex items-center gap-1 group shrink-0">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded italic shadow-sm">CallGirl</span>
          <span className="text-gray-900 uppercase">4U</span>
        </Link>

        {/* Brand Focus - Premium India Badge - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1 md:gap-2 px-2 py-1 bg-gray-50 rounded-full border border-gray-200 shrink-0">
          <span className="text-xl">🇮🇳</span>
          <span className="text-[10px] md:text-xs font-black tracking-widest text-gray-800 uppercase">India</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-[120px] xs:max-w-[200px] md:max-w-md ml-auto">
          <CitySearch cities={getAllCities()} layout="header" />
        </div>

        {/* Auth & Post */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Auth Links */}
          <div className="flex gap-1 text-[10px] md:text-sm font-bold items-center">
            <Link href="/login" className="text-gray-800 bg-white border border-gray-300 px-1.5 py-1 rounded-md hover:bg-gray-50 transition-all shadow-sm active:scale-95 whitespace-nowrap">Login</Link>
            <Link href="/signup" className="text-white bg-gradient-to-r from-red-600 to-red-700 px-2 py-1 rounded-md hover:from-red-700 hover:to-red-800 transition-all shadow-md border border-red-700 active:scale-95 whitespace-nowrap">Sign Up</Link>
          </div>

          {/* Post Ad - Compact on mobile */}
          <Link href="/ad/post" className="bg-red-600 text-white px-2 py-1 rounded-md text-[10px] md:text-sm font-bold hover:bg-black transition shadow-md flex items-center gap-0.5">
            <span className="hidden xs:inline">+</span> 
            <span className="hidden sm:inline">Post Your Ad</span>
            <span className="sm:hidden">Post Ad</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
