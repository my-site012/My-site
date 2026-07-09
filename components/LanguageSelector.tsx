"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function LanguageSelector() {
  useEffect(() => {
    const initWidget = () => {
      if (typeof window !== "undefined" && (window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi", // English and Hindi
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    (window as any).googleTranslateElementInit = initWidget;

    if ((window as any).google && (window as any).google.translate) {
      initWidget();
    }
  }, []);

  return (
    <div className="flex items-center shrink-0">
      <div 
        id="google_translate_element" 
        className="translate-widget border border-gray-200 rounded-md bg-gray-50 text-[10px] md:text-xs"
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
}
