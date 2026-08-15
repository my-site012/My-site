"use client";
import { useState, useEffect } from "react";

export default function AgeVerification() {
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    // Skip age verification for search engine bots and crawlers
    // Bots have no localStorage — without this check they'd see only the popup
    const isBot = /bot|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|crawler|spider|robot|crawling|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora\slink\spreview|showyoubot|outbrain|pinterest|developers\.google\.com\/\+\/web\/snippet/i.test(
      typeof navigator !== "undefined" ? navigator.userAgent : ""
    );
    if (isBot) return; // Googlebot & all crawlers bypass popup — they see full content

    try {
      const v = localStorage.getItem("age-verified");
      if (!v) {
        setVerified(false);
      }
    } catch (e) {
      // If localStorage is unavailable, don't block the user
      setVerified(true);
    }
  }, []);

  const handleVerify = () => {
    try {
      localStorage.setItem("age-verified", "yes");
      document.documentElement.classList.remove("age-unverified");
    } catch (e) {}
    setVerified(true);
  };

  return (
    <div 
      id="age-verification-overlay"
      className={`${verified ? 'hidden' : 'flex'} fixed inset-0 bg-black/80 z-[9999] items-center justify-center`}
    >
      <div className="bg-white rounded-xl p-8 max-w-md w-full text-center mx-4">
        <h2 className="text-xl font-bold mb-2 text-gray-900">Age Verification Required</h2>
        <p className="text-gray-600 mb-6 text-sm">
          This website contains adult content. You must be 18 years or older to enter.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleVerify}
            className="bg-red-600 hover:bg-red-700 transition-colors text-white px-6 py-3 rounded-lg font-bold cursor-pointer min-h-[48px] min-w-[140px] flex items-center justify-center text-sm"
          >
            I am 18+ — Enter
          </button>
          <button
            onClick={() => window.location.href = "https://google.com"}
            className="bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800 px-6 py-3 rounded-lg font-bold cursor-pointer min-h-[48px] min-w-[100px] flex items-center justify-center text-sm"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
