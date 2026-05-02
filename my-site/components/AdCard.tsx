"use client";

import Image from "next/image";

import Link from "next/link";
import { getContactNumber } from "@/lib/ad-logic";
import { useState, useEffect } from "react";
import WhatsAppButton from "./WhatsAppButton";

interface AdCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  imagePath: string;
  index?: number;
  phone?: string;
}

export default function AdCard({ id, title, location, price, imagePath, index = 0, phone }: AdCardProps) {
  const [imgSrc, setImgSrc] = useState(imagePath);
  const [hasError, setHasError] = useState(false);
  
  const displayPhone = phone || getContactNumber(id);

  // Ensure state updates when props change
  useEffect(() => {
    setImgSrc(imagePath);
    setHasError(false);
  }, [imagePath]);

  // FALLBACK IMAGE IN CASE OF MISSING ASSETS
  const fallbackImage = "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full active:scale-[0.98]">
      <Link href={`/ad/${id}`} className="block relative aspect-[3/4] overflow-hidden">
        <Image 
          src={hasError ? fallbackImage : imgSrc} 
          alt={title} 
          fill
          priority={index < 4}
          unoptimized={true}
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${hasError ? 'opacity-50 grayscale' : ''}`}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          onError={() => {
            console.warn(`Image failed to load: ${imgSrc}`);
            setHasError(true);
          }}
        />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Premium Profile</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
          <div className="flex justify-between items-end gap-2">
            <div>
              <h3 className="text-sm md:text-lg font-bold leading-tight group-hover:text-red-400 transition-colors line-clamp-2">{title}</h3>
              <p className="text-[10px] md:text-sm text-gray-300 flex items-center gap-1 mt-0.5">
                <span className="text-red-500">📍</span> {location}
              </p>
            </div>
            <div className="text-right whitespace-nowrap">
              <span className="bg-green-600/90 text-white text-[8px] md:text-xs font-bold px-1.5 py-0.5 rounded-full mb-1 inline-block uppercase">Active</span>
              <p className="text-base md:text-xl font-black text-green-400 leading-none">₹{price}</p>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-2 md:p-3 grid grid-cols-2 gap-2 bg-gray-50 mt-auto border-t border-gray-100">
        <WhatsAppButton 
          phone={displayPhone}
          message={`Hi, My name is ___, I am in ${location} and I need a call girl. Please share a photo. (${title})`}
          className="flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#20bd5c] text-white text-[10px] md:text-sm font-bold py-2 rounded-lg transition-all shadow-sm active:scale-95"
        >
          <span className="text-xs md:text-lg">💬</span> WhatsApp
        </WhatsAppButton>
        <a 
          href={`tel:${displayPhone}`}
          className="flex items-center justify-center gap-1 bg-[#007bff] hover:bg-[#0069d9] text-white text-[10px] md:text-sm font-bold py-2 rounded-lg transition-all shadow-sm active:scale-95"
        >
          <span className="text-xs md:text-lg">📞</span> Call Now
        </a>
      </div>
    </div>
  );
}

