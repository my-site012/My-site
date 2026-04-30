"use client";

import { useState } from "react";

export default function ReportModal({ adTitle, adId }: { adTitle: string; adId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adId,
          adTitle,
          reason,
          reporterEmail: email,
          message
        })
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          setIsOpen(false);
          setStatus("idle");
          setReason("");
          setEmail("");
          setMessage("");
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group text-gray-400 hover:text-red-600 text-[10px] md:text-sm font-bold flex items-center gap-1.5 transition-all mt-6 bg-gray-50 hover:bg-red-50 px-4 py-2 rounded-xl self-start border border-gray-100 hover:border-red-100"
      >
        <span className="text-gray-300 group-hover:text-red-400 transition-colors">🚩</span> 
        <span className="uppercase tracking-widest">Report this ad</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden transform animate-in zoom-in-95 duration-300 border border-gray-100">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-[900] text-gray-900 leading-none tracking-tighter uppercase italic">
                    REPORT <span className="text-red-500 underline decoration-4 underline-offset-4">ISSUE</span>
                  </h2>
                  <p className="text-gray-500 text-sm mt-3">
                    Safety is our priority. Reporting <span className="font-bold text-gray-900 tracking-tight">{adTitle}</span>.
                  </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-gray-900 transition-colors text-2xl">×</button>
              </div>

              {status === "success" ? (
                <div className="py-16 text-center animate-in slide-in-from-bottom-4 duration-500">
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-sm border border-green-100">✓</div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">REPORT SECURED</h3>
                  <p className="text-gray-500 mt-2 max-w-[280px] mx-auto leading-relaxed">Thank you. Our moderation team will review this profile immediately.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">The main problem</label>
                    <div className="relative">
                      <select 
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 outline-none focus:border-red-500/50 focus:bg-white transition-all appearance-none font-bold"
                      >
                        <option value="">Select a specific reason...</option>
                        <option value="Fake Profile / Not a real person">Fake Profile / Not a real person</option>
                        <option value="Scam / Asking for advance payment">Scam / Asking for advance payment</option>
                        <option value="Underage or Inappropriate">Underage or Inappropriate</option>
                        <option value="Wrong Category / Location">Wrong Category / Location</option>
                        <option value="Other / Unusual Activity">Other / Unusual Activity</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Your Contact (Optional)</label>
                    <input 
                      type="email" 
                      placeholder="Enter your email if you want updates"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 outline-none focus:border-red-500/50 focus:bg-white transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Detailed Description</label>
                    <textarea 
                      placeholder="Please provide more context for our team..."
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 outline-none focus:border-red-500/50 focus:bg-white transition-all resize-none font-medium placeholder:text-gray-400"
                    />
                  </div>

                  {status === "error" && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-pulse uppercase tracking-wider text-center">
                      Transmission failed. Please restart.
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <button 
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-[0.4] bg-gray-100 hover:bg-gray-200 text-gray-500 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs"
                    >
                      Dismiss
                    </button>
                    <button 
                      type="submit"
                      disabled={status === "loading"}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20 transform active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
                    >
                      {status === "loading" ? "SENDING..." : "COMMIT REPORT"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
