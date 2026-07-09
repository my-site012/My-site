import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under Maintenance | CallGirl4U",
  description: "We are currently conducting scheduled system maintenance to improve our service quality. We will be back online shortly.",
  robots: "noindex, nofollow",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 md:p-12 rounded-3xl border border-gray-700 shadow-2xl max-w-lg w-full text-center">
        {/* Animated Icon */}
        <div className="w-20 h-20 bg-red-600/10 border border-red-600/30 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-pulse">
          ⚙️
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
          System <span className="text-red-500">Maintenance</span>
        </h1>
        <p className="text-gray-300 text-base leading-relaxed mb-6">
          We are currently updating our systems to provide you with a faster, safer, and better browsing experience. 
        </p>
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 text-gray-400 text-xs">
          Estimated downtime: <span className="text-white font-bold">15 - 30 minutes</span>. Please check back shortly. Thank you for your patience!
        </div>
      </div>
    </div>
  );
}
