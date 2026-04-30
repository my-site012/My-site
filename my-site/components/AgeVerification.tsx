"use client";
import { useState, useEffect } from "react";

export default function AgeVerification() {
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    const v = localStorage.getItem("age-verified");
    if (!v) setVerified(false);
  }, []);

  if (verified) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-bold mb-2">Age Verification Required</h2>
        <p className="text-gray-600 mb-6 text-sm">
          This website contains adult content. You must be 18 years or older to enter.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              localStorage.setItem("age-verified", "yes");
              setVerified(true);
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            I am 18+ — Enter
          </button>
          <button
            onClick={() => window.location.href = "https://google.com"}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
