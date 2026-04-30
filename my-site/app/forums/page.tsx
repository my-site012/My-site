import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adult Forums | CallGirl4U",
  robots: { index: false, follow: true },
};

export default function ForumsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center min-h-[60vh] flex flex-col justify-center">
      <div className="bg-red-50 p-12 rounded-3xl border-2 border-red-100 border-dashed">
        <h1 className="text-4xl font-black mb-4 text-gray-900">Adult Forums</h1>
        <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse mb-6">
          COMING SOON
        </div>
        <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
          We are building a premium community space for our users to share reviews, 
          discussions, and safe meeting tips. Stay tuned!
        </p>
      </div>
    </div>
  );
}
