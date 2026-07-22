"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { locations } from "@/lib/data/locations";

export default function PostAdPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Call Girls");
  const [price, setPrice] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [phone, setPhone] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Get clean list of states (filter out keys ending with " Locations")
  const statesList = Object.keys(locations)
    .filter((key) => !key.endsWith(" Locations") && key !== "Other Locations")
    .sort();

  // Get cities for selected state
  const citiesList = selectedState ? locations[selectedState] || [] : [];

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleOpenPaymentModal = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!selectedState || !selectedCity) {
      setError("Please select both State and City");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!transactionId.trim()) {
      setError("Please enter the UTR / Transaction ID");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/ads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          price: Number(price),
          state: selectedState,
          city: selectedCity,
          phone,
          transactionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit ad");
      } else {
        setSuccess(true);
        setShowPaymentModal(false);
        // Reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setSelectedState("");
        setSelectedCity("");
        setPhone("");
        setTransactionId("");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 font-bold text-sm tracking-wider uppercase">Loading Account...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-[#0a0a0a] py-12 px-4 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 -left-10 w-96 h-96 bg-red-600/10 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 -right-10 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl">
          
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                POST YOUR <span className="text-red-500">AD</span>
              </h1>
              <p className="text-gray-400 text-xs mt-1">Hello, {user?.name || "Advertiser"}</p>
            </div>
            <Link 
              href="/"
              className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition"
            >
              ← Back
            </Link>
          </div>

          {success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center space-y-4">
              <span className="text-4xl">🎉</span>
              <h3 className="text-xl font-bold text-white">Ad Submitted Successfully!</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Thank you! Your ad has been submitted for verification. Our review team will review and approve it shortly.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-white/10 transition text-sm"
                >
                  Post Another Ad
                </button>
                <Link 
                  href="/"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleOpenPaymentModal}>
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold text-center">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Ad Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Gorgeous Independent Companion Available 24/7"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-gray-600 outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium text-sm"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about yourself, services offered, and other details..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-gray-600 outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium text-sm resize-none"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium text-sm appearance-none cursor-pointer"
                    disabled={submitting}
                  >
                    <option className="bg-[#121212] text-white" value="Call Girls">Call Girls</option>
                    <option className="bg-[#121212] text-white" value="Massage">Massage</option>
                    <option className="bg-[#121212] text-white" value="Call Boys">Call Boys</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Price (₹ / Hour)</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-gray-600 outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium text-sm"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">State</label>
                  <select 
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity("");
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium text-sm appearance-none cursor-pointer"
                    required
                    disabled={submitting}
                  >
                    <option className="bg-[#121212] text-gray-500" value="">Select State</option>
                    {statesList.map((state) => (
                      <option className="bg-[#121212] text-white" key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">City</label>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium text-sm appearance-none cursor-pointer"
                    required
                    disabled={submitting || !selectedState}
                  >
                    <option className="bg-[#121212] text-gray-500" value="">Select City</option>
                    {citiesList.map((city) => (
                      <option className="bg-[#121212] text-white" key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Contact Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white placeholder:text-gray-600 outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium text-sm"
                  required
                  disabled={submitting}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-600/20 transform active:scale-[0.98] transition-all tracking-widest uppercase text-sm mt-4"
              >
                {submitting ? "Submitting Ad..." : "Submit Ad for Review"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Payment / QR Code Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#121212] border border-white/10 p-6 md:p-8 rounded-3xl max-w-md w-full text-center space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white font-bold text-xl outline-none"
            >
              ✕
            </button>
            
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white tracking-tighter uppercase">
                Payment Required <span className="text-red-500">₹100</span>
              </h2>
              <p className="text-xs text-gray-400">
                Scan the QR code below to pay ₹100 for 24 hours ad listing.
              </p>
            </div>

            {/* QR Code Container */}
            <div className="relative w-56 h-56 mx-auto bg-white p-2 rounded-2xl overflow-hidden shadow-inner">
              <img 
                src="/Qr code.jpeg" 
                alt="Payment QR Code" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-[10px] text-amber-500/80 font-bold bg-amber-500/5 border border-amber-500/10 py-2.5 px-4 rounded-xl leading-relaxed">
              ⚠️ UTR / UPI Ref No. is mandatory. Our admin will check the transaction history against this UTR to approve your ad.
            </div>

            {/* Transaction ID / UTR Input Field */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Transaction ID / UTR Number / UPI Ref No.
              </label>
              <input 
                type="text" 
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 615400004136..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-gray-600 outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-semibold text-sm"
                required
              />
            </div>

            {error && (
              <div className="text-xs text-red-500 font-bold bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 transition text-sm"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-600/20 transition text-sm uppercase tracking-wider"
              >
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
