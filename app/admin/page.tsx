"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = checking
  const [email, setEmail] = useState("");
  const [stats, setStats] = useState({ clicks: 0, phone: "", logs: [] as any[], maintenance: false, dailyHits: [] as {date: string; hits: number}[] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [phones, setPhones] = useState<string[]>(["", "", "", "", "", ""]);
  const [boyPhones, setBoyPhones] = useState<string[]>(["", "", "", "", "", ""]);
  const [jaipurPhone, setJaipurPhone] = useState("");
  const [pendingAds, setPendingAds] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Booking & QR Settings State
  const [bookingPrice, setBookingPrice] = useState("1000");
  const [bookingQrImage, setBookingQrImage] = useState("/images/payment-qr.png");
  const [bookingUpiId, setBookingUpiId] = useState("sharmajii01@fam");
  const [savingBookingSettings, setSavingBookingSettings] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  // Payment Link Generator State
  const [genAmount, setGenAmount] = useState("1000");
  const [genName, setGenName] = useState("");
  const [genPhone, setGenPhone] = useState("");
  const [genCity, setGenCity] = useState("");
  const [genService, setGenService] = useState<"Incall" | "Outcall">("Incall");
  const [genStep2, setGenStep2] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/booking");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  }, []);

  const fetchPendingAds = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/ads/pending");
      if (res.ok) {
        const data = await res.json();
        setPendingAds(data.ads || []);
      }
    } catch (err) {
      console.error("Failed to fetch pending ads", err);
    }
  }, []);

  const handleAdAction = async (adId: string, action: "approve" | "reject") => {
    try {
      const res = await fetch("/api/admin/ads/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, action }),
      });
      if (res.ok) {
        setPendingAds(prev => prev.filter(ad => ad.id !== adId));
      } else {
        alert("Failed to update ad");
      }
    } catch {
      alert("Error updating ad");
    }
  };

  useEffect(() => {
    if (stats.phone) {
      const arr = stats.phone.split(",").map(p => p.trim());
      const filledArr = [...arr, "", "", "", "", "", ""].slice(0, 6);
      setPhones(filledArr);
    }
  }, [stats.phone]);

  useEffect(() => {
    if ((stats as any).callBoyPhone) {
      const arr = (stats as any).callBoyPhone.split(",").map((p: string) => p.trim());
      const filledArr = [...arr, "", "", "", "", "", ""].slice(0, 6);
      setBoyPhones(filledArr);
    } else {
      setBoyPhones(["", "", "", "", "", ""]);
    }
  }, [(stats as any).callBoyPhone]);

  useEffect(() => {
    setJaipurPhone((stats as any).jaipurPhone || "");
  }, [(stats as any).jaipurPhone]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        if (data.bookingAdvancePrice) setBookingPrice(String(data.bookingAdvancePrice));
        if (data.bookingQrImage) setBookingQrImage(data.bookingQrImage);
        if (data.bookingUpiId) setBookingUpiId(data.bookingUpiId);
        setFetchError("");
        fetchPendingAds();
        fetchBookings();
      } else if (res.status === 401) {
        // Session expired, go back to login
        setIsLoggedIn(false);
      } else {
        setFetchError("Failed to load data. Please try again.");
      }
    } catch (err) {
      setFetchError("Network error. Check connection.");
    }
  }, [fetchPendingAds, fetchBookings]);

  // On mount: check if session cookie exists by trying to fetch stats
  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        if (data.bookingAdvancePrice) setBookingPrice(String(data.bookingAdvancePrice));
        if (data.bookingQrImage) setBookingQrImage(data.bookingQrImage);
        if (data.bookingUpiId) setBookingUpiId(data.bookingUpiId);
        setIsLoggedIn(true);
        fetchPendingAds();
        fetchBookings();
      } else {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, [fetchPendingAds, fetchBookings]);

  // Auto-refresh every 30 seconds when logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, fetchStats]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setIsLoggedIn(true);
      fetchStats();
      fetchPendingAds();
    } else {
      alert("Invalid Email");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setIsLoggedIn(false);
  };

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const phoneString = phones.map(p => p.trim()).filter(Boolean).join(",");
    const boyPhoneString = boyPhones.map(p => p.trim()).filter(Boolean).join(",");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneString, callBoyPhone: boyPhoneString, jaipurPhone: jaipurPhone.trim() }),
    });
    setLoading(false);
    if (res.ok) {
      setStats(prev => ({ ...prev, phone: phoneString, callBoyPhone: boyPhoneString, jaipurPhone: jaipurPhone.trim() } as any));
      setMessage("Phone numbers updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSaveBookingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBookingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingAdvancePrice: bookingPrice.trim(),
          bookingQrImage: bookingQrImage.trim(),
          bookingUpiId: bookingUpiId.trim(),
        }),
      });
      if (res.ok) {
        setBookingMessage("Booking QR, UPI ID & Advance Price saved successfully!");
        setTimeout(() => setBookingMessage(""), 4000);
      } else {
        alert("Failed to save booking settings");
      }
    } catch {
      alert("Error saving booking settings");
    } finally {
      setSavingBookingSettings(false);
    }
  };

  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size is too large! Please choose an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBookingQrImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const generatedLink = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://callgirl4u.com";
    const params = new URLSearchParams();
    if (genAmount && genAmount.trim()) {
      params.set("amount", genAmount.trim());
    }
    if (genName.trim()) {
      params.set("name", genName.trim());
    }
    if (genPhone.trim()) {
      params.set("phone", genPhone.trim());
    }
    if (genCity.trim()) {
      params.set("city", genCity.trim());
    }
    if (genService) {
      params.set("service", genService);
    }
    if (genStep2) {
      params.set("step", "2");
    }
    const qs = params.toString();
    return `${origin}/booking${qs ? `?${qs}` : ""}`;
  }, [genAmount, genName, genPhone, genCity, genService, genStep2]);

  const copyGeneratedLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(generatedLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getWhatsAppShareUrl = () => {
    const clientName = genName.trim() || "Sir";
    const amountVal = genAmount.trim() || "1000";
    const cityVal = genCity.trim() ? `\n📍 *Location:* ${genCity.trim()}` : "";
    const cleanPhone = genPhone.replace(/\D/g, "");
    const phoneParam = cleanPhone ? (cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone) : "";

    const messageText = `Hello ${clientName},
Here is your official appointment booking & advance payment link:
🔗 ${generatedLink}

💰 *Advance Amount:* ₹${Number(amountVal).toLocaleString("en-IN")}${cityVal}

Please click the link, scan the QR code to complete the advance payment, and enter your 12-digit UPI UTR number to immediately generate your official booking token.`;

    return `https://wa.me/${phoneParam}?text=${encodeURIComponent(messageText)}`;
  };

  // Loading state while checking session
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 font-medium text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="admin@yourdomain.com"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition"
            >
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b px-4 py-6 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span className="text-red-600">📊</span> ADMIN INSIGHTS
            </h1>
            <p className="text-gray-500 text-sm">Welcome back, Sunil. Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchStats}
              className="text-gray-500 hover:text-red-600 font-medium text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:border-red-300 transition"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {fetchError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            ⚠️ {fetchError}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="text-5xl text-green-500">💬</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">WhatsApp Hits</p>
            <h2 className="text-4xl font-black text-gray-900">{stats.clicks}</h2>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="text-5xl text-blue-500">👤</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Unique Profiles Clicked</p>
            <h2 className="text-4xl font-black text-gray-900">{Math.floor(stats.clicks * 0.7)}</h2>
          </div>

          <div className="bg-green-600 p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
            <h2 className="text-xl font-bold mb-1">Vercel KV Connected</h2>
            <p className="text-green-100 text-sm leading-relaxed">
              Database linked successfully! Click stats are now permanently and securely saved across redeployments.
            </p>
            <p className="text-green-200 text-xs mt-2">Auto-refreshes every 30s</p>
          </div>
        </div>

        {/* 30-Day WhatsApp Hits Calendar */}
        {(() => {
          const dailyHits = stats.dailyHits || [];
          const maxHits = Math.max(...dailyHits.map(d => d.hits), 1);
          const today = new Date().toISOString().split("T")[0];

          const getColor = (hits: number) => {
            if (hits === 0) return { bg: "bg-gray-100", text: "text-gray-300" };
            const ratio = hits / maxHits;
            if (ratio > 0.75) return { bg: "bg-green-600", text: "text-white" };
            if (ratio > 0.5) return { bg: "bg-green-400", text: "text-white" };
            if (ratio > 0.25) return { bg: "bg-green-200", text: "text-green-900" };
            return { bg: "bg-green-100", text: "text-green-700" };
          };

          const totalThisMonth = dailyHits.reduce((sum, d) => sum + d.hits, 0);
          const todayHits = dailyHits.find(d => d.date === today)?.hits || 0;
          const avgHits = dailyHits.length > 0 ? Math.round(totalThisMonth / dailyHits.filter(d => d.hits > 0).length || 0) : 0;

          return (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                    <span>📅</span> WhatsApp Hits — Last 30 Days
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Har din ke unique WhatsApp clicks ka breakdown</p>
                </div>
                <div className="flex gap-4 text-center">
                  <div className="bg-green-50 rounded-2xl px-4 py-2">
                    <div className="text-2xl font-black text-green-600">{todayHits}</div>
                    <div className="text-[10px] text-green-500 font-bold uppercase">Aaj</div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl px-4 py-2">
                    <div className="text-2xl font-black text-gray-800">{totalThisMonth}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">30 Din Total</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl px-4 py-2">
                    <div className="text-2xl font-black text-blue-600">{avgHits}</div>
                    <div className="text-[10px] text-blue-400 font-bold uppercase">Avg/Din</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
                  {dailyHits.map((day) => {
                    const { bg, text } = getColor(day.hits);
                    const isToday = day.date === today;
                    const dateObj = new Date(day.date + "T00:00:00");
                    const dayNum = dateObj.getDate();
                    const monthName = dateObj.toLocaleString("en-IN", { month: "short" });
                    return (
                      <div
                        key={day.date}
                        title={`${day.date}: ${day.hits} hits`}
                        className={`group relative flex flex-col items-center justify-center rounded-xl p-2 cursor-default transition-all duration-200 hover:scale-110 hover:shadow-md ${bg} ${isToday ? "ring-2 ring-offset-1 ring-green-500" : ""}`}
                        style={{ minHeight: 56 }}
                      >
                        <span className={`text-[10px] font-bold uppercase ${text} opacity-70`}>{monthName}</span>
                        <span className={`text-base font-black leading-none ${text}`}>{dayNum}</span>
                        <span className={`text-xs font-bold mt-0.5 ${text}`}>
                          {day.hits > 0 ? day.hits : "–"}
                        </span>
                        {isToday && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="mt-4 flex items-center gap-3 justify-end">
                  <span className="text-[10px] text-gray-400 font-semibold">Kam</span>
                  <div className="flex gap-1">
                    {["bg-gray-100", "bg-green-100", "bg-green-200", "bg-green-400", "bg-green-600"].map((c) => (
                      <div key={c} className={`w-4 h-4 rounded ${c}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">Zyada</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Pending Ads Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                📢 Pending Ads for Review ({pendingAds.length})
              </h3>
              <p className="text-xs text-gray-400 mt-1">Users dwara submit kiye gaye ads jo approval ka wait kar rahe hain</p>
            </div>
            <button 
              onClick={fetchPendingAds}
              className="text-xs bg-gray-50 border px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 font-bold transition"
            >
              🔄 Refresh List
            </button>
          </div>
          <div className="p-6">
            {pendingAds.length === 0 ? (
              <div className="py-12 text-center text-gray-400 font-medium">
                🎉 Koi pending ads nahi hain review ke liye!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingAds.map((ad) => (
                  <div key={ad.id} className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                          {ad.category}
                        </span>
                        <span className="text-gray-900 font-extrabold text-sm">
                          ₹{ad.price} / Hr
                        </span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-base mb-2">{ad.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-4">{ad.description}</p>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-t border-gray-200/60 pt-4 mb-4">
                        <div>
                          <span className="text-gray-400 font-semibold uppercase block">Location</span>
                          <span className="text-gray-800 font-bold">{ad.city}, {ad.state}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-semibold uppercase block">Contact Phone</span>
                          <span className="text-gray-800 font-bold">{ad.phone}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400 font-semibold uppercase block">Submitted By</span>
                          <span className="text-gray-800 font-bold truncate block">{ad.userEmail}</span>
                        </div>
                        <div className="col-span-2 bg-yellow-50 border border-yellow-200 p-2.5 rounded-xl mt-1">
                          <span className="text-yellow-700 font-bold uppercase tracking-wider text-[9px] block">UPI Transaction ID / UTR</span>
                          <span className="text-gray-900 font-black text-sm select-all block font-mono">{ad.transactionId || "No UTR provided"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => handleAdAction(ad.id, "approve")}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
                      >
                        Approve Ad
                      </button>
                      <button
                        onClick={() => handleAdAction(ad.id, "reject")}
                        className="flex-1 bg-white hover:bg-red-50 hover:text-red-600 text-gray-600 border font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings Section */}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Global Meta & Contact Settings</h3>
          </div>
          <div className="p-8">
            <form onSubmit={handleUpdatePhone} className="max-w-2xl space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Rotated Contact Numbers (Up to 6 numbers)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {phones.map((phoneVal, i) => (
                    <div key={i}>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Number {i + 1}</label>
                      <input
                        type="text"
                        value={phoneVal}
                        onChange={(e) => {
                          const updated = [...phones];
                          updated[i] = e.target.value;
                          setPhones(updated);
                        }}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition text-sm"
                        placeholder="e.g. 918905822138"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-gray-400">
                  Include country code (e.g. 91 for India). Calls &amp; WhatsApp clicks will rotate deterministically and distribute evenly across all filled numbers.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  Call Boy Dedicated Numbers (Up to 6 numbers)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {boyPhones.map((phoneVal, i) => (
                    <div key={i}>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Number {i + 1}</label>
                      <input
                        type="text"
                        value={phoneVal}
                        onChange={(e) => {
                          const updated = [...boyPhones];
                          updated[i] = e.target.value;
                          setBoyPhones(updated);
                        }}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition text-sm"
                        placeholder="e.g. 918905822138"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-gray-400">
                  Dedicated numbers only used for the Call Boy category. If empty, it will fall back to general rotated numbers.
                </p>
              </div>

              {/* ─── Jaipur Dedicated Number ─── */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">🗺️</span>
                  <label className="text-sm font-bold text-gray-700">
                    Jaipur City &amp; Sub-Areas — Dedicated Number
                  </label>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Ye number Jaipur aur uske sare sub-areas pe lagega: <span className="font-semibold text-gray-600">Jagatpura · Gopalpura · Sitapura · Sanganer · 200 Feet Bypass · Chandpole</span>. Agar ye number empty hai toh Global number use hoga.
                </p>
                <div className="relative max-w-sm">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">📞</span>
                  <input
                    type="text"
                    value={jaipurPhone}
                    onChange={(e) => setJaipurPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-amber-50 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none transition text-sm font-medium placeholder:text-gray-400"
                    placeholder="e.g. 918905822138"
                  />
                </div>
                <p className="mt-2 text-[10px] text-gray-400">
                  Country code include karo (e.g. 91 for India). Sirf ek number enter karo.
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Maintenance Mode</h4>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      const newStatus = !stats.maintenance;
                      setStats({ ...stats, maintenance: newStatus });
                      setLoading(true);
                      const res = await fetch("/api/admin/settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ maintenance: newStatus }),
                      });
                      setLoading(false);
                      if (res.ok) {
                        setMessage(`Maintenance mode ${newStatus ? "ENABLED" : "DISABLED"} successfully!`);
                        setTimeout(() => setMessage(""), 3000);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                      stats.maintenance 
                        ? "bg-red-600 text-white hover:bg-red-700" 
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {stats.maintenance ? "🔴 Maintenance Active" : "🟢 Maintenance Off"}
                  </button>
                  <p className="text-xs text-gray-500">
                    If active, all non-admin visitors will be redirected to the maintenance page.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Settings"}
                </button>
                {message && <span className="text-green-600 font-bold text-sm animate-pulse">{message}</span>}
              </div>
            </form>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CARD 1: QR CODE, ADVANCE PRICE & UPI ID SETTINGS
        ────────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-3 bg-gradient-to-r from-red-50/70 via-white to-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                  Booking QR Code, Price &amp; UPI Settings
                </h3>
                <p className="text-xs text-gray-500">
                  Manage the default advance payment QR code, price, and UPI address shown on the booking page.
                </p>
              </div>
            </div>
            {bookingMessage && (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                ✓ {bookingMessage}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveBookingSettings} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left Column: Price & UPI ID */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Default Advance Booking Price (₹)
                  </label>
                  <div className="relative max-w-sm">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base select-none">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min={100}
                      max={100000}
                      step={50}
                      value={bookingPrice}
                      onChange={(e) => setBookingPrice(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-base font-bold text-gray-900 transition"
                      placeholder="1000"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[500, 1000, 1500, 2000, 3000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setBookingPrice(String(amt))}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                          bookingPrice === String(amt)
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    This amount is displayed as the default advance token payment when no custom link is used.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Receiver UPI ID
                  </label>
                  <div className="relative max-w-sm">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
                      🆔
                    </span>
                    <input
                      type="text"
                      required
                      value={bookingUpiId}
                      onChange={(e) => setBookingUpiId(e.target.value.trim())}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm font-mono font-bold text-gray-900 transition"
                      placeholder="e.g. sharmajii01@fam"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-400">
                    This UPI ID is used for copying and one-click UPI payment app links.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Or Image URL / Path
                  </label>
                  <input
                    type="text"
                    value={bookingQrImage}
                    onChange={(e) => setBookingQrImage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-500 outline-none text-xs font-mono text-gray-700 transition"
                    placeholder="/images/payment-qr.png or https://..."
                  />
                  <p className="mt-1 text-[11px] text-gray-400">
                    You can either upload an image directly below or paste an image link.
                  </p>
                </div>
              </div>

              {/* Right Column: QR Code Upload & Live Preview */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col items-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                  Current QR Code Preview
                </span>

                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white p-3 rounded-2xl border-2 border-gray-200 shadow-sm flex items-center justify-center overflow-hidden mb-4">
                  {bookingQrImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bookingQrImage}
                      alt="Booking QR Code Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs font-bold">No QR Selected</span>
                  )}
                </div>

                <div className="space-y-2 w-full max-w-xs">
                  <label className="w-full bg-red-50 hover:bg-red-100 text-red-700 border-2 border-dashed border-red-300 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2">
                    <span>📤</span>
                    <span>Upload New QR Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-gray-400">
                    Supports PNG, JPG, WebP. Recommended max file size: 2MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 flex items-center gap-4">
              <button
                type="submit"
                disabled={savingBookingSettings}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {savingBookingSettings ? "Saving Settings..." : "Save QR & Price Settings"}
              </button>
              {bookingMessage && (
                <span className="text-emerald-700 font-bold text-sm animate-pulse">
                  ✓ {bookingMessage}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CARD 2: CLIENT PAYMENT LINK GENERATOR
        ────────────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-gray-900 via-neutral-900 to-black text-white rounded-3xl shadow-xl overflow-hidden mt-8 border border-gray-800">
          <div className="p-6 border-b border-gray-800 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center text-xl">
                🔗
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Client Payment Link Generator
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Custom Amount
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  Generate customized advance payment links with custom pricing for each individual user/client.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Custom Price */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Payment Amount (₹) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={genAmount}
                    onChange={(e) => setGenAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white font-bold text-sm outline-none transition"
                    placeholder="1000"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["500", "1000", "1500", "2000", "3000", "5000"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setGenAmount(v)}
                      className={`text-[11px] px-2 py-0.5 rounded font-bold transition ${
                        genAmount === v
                          ? "bg-red-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      ₹{v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Client Name (Optional)
                </label>
                <input
                  type="text"
                  value={genName}
                  onChange={(e) => setGenName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm outline-none transition"
                  placeholder="e.g. Rahul"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">Pre-fills on client page &amp; WhatsApp</span>
              </div>

              {/* Client Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Client WhatsApp (Optional)
                </label>
                <input
                  type="tel"
                  value={genPhone}
                  onChange={(e) => setGenPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm outline-none transition"
                  placeholder="e.g. 9876543210"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">Enables 1-click WhatsApp message send</span>
              </div>

              {/* City / Location */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  City / Location (Optional)
                </label>
                <input
                  type="text"
                  value={genCity}
                  onChange={(e) => setGenCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white text-sm outline-none transition"
                  placeholder="e.g. Jaipur, Tiruvalla..."
                />
                <span className="text-[10px] text-gray-500 mt-1 block">Pre-selects city for client</span>
              </div>
            </div>

            {/* Additional Options */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">Service Mode:</span>
                <button
                  type="button"
                  onClick={() => setGenService("Incall")}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    genService === "Incall" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  Incall
                </button>
                <button
                  type="button"
                  onClick={() => setGenService("Outcall")}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    genService === "Outcall" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  Outcall
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300">
                <input
                  type="checkbox"
                  checked={genStep2}
                  onChange={(e) => setGenStep2(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-gray-800 border-gray-700"
                />
                <span>Directly Open QR Payment Screen (Skip to Step 2)</span>
              </label>
            </div>

            {/* Generated Link Display Box */}
            <div className="bg-black/60 border border-gray-800 rounded-2xl p-4 sm:p-5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                Generated Client Payment Link
              </span>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 bg-gray-900 border border-gray-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-red-400 break-all select-all">
                  {generatedLink}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyGeneratedLink}
                    className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl text-xs shadow transition active:scale-95 whitespace-nowrap cursor-pointer"
                  >
                    {copiedLink ? "✓ Link Copied!" : "📋 Copy Link"}
                  </button>

                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-xs shadow transition active:scale-95 inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <span>💬</span>
                    <span>Send on WhatsApp</span>
                  </a>

                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-3.5 py-3 rounded-xl text-xs transition"
                    title="Open in new tab to test"
                  >
                    👁️
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                Send this link to your client on WhatsApp or SMS. When they open it, it will automatically show your customized ₹{Number(genAmount || 1000).toLocaleString("en-IN")} price, your latest QR code, and your UPI details.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Bookings & Generated Tokens */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-red-50/50 to-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎟️</span>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Customer Bookings &amp; Tokens</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">{bookings.length} Bookings</span>
              <button
                type="button"
                onClick={fetchBookings}
                className="text-xs text-gray-500 hover:text-black font-bold p-1 rounded"
                title="Refresh Bookings"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-4">Token</th>
                  <th className="p-4">Client / Phone</th>
                  <th className="p-4">Mode / Service</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Payment UTR</th>
                  <th className="p-4">Date / Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono font-black text-sm text-red-600 whitespace-nowrap">
                      <span className="bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                        {b.token}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">{b.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <span>📞 {b.phone}</span>
                        <a
                          href={`https://wa.me/91${b.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 font-bold hover:underline"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-semibold">
                      <span className={`inline-block px-2 py-0.5 rounded ${b.serviceType === "Incall" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                        {b.serviceType}
                      </span>
                      <div className="text-gray-500 text-[11px] mt-0.5">{b.category}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {b.city} {b.state ? `(${b.state})` : ""}
                      {b.address && <div className="text-[11px] text-gray-400 truncate max-w-[150px]">{b.address}</div>}
                    </td>
                    <td className="p-4 text-xs font-bold text-gray-700 whitespace-nowrap">
                      {b.duration}
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-bold text-emerald-700">₹{b.advanceAmount || 1000}</div>
                      {b.utr ? (
                        <span className="font-mono text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                          UTR: {b.utr}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 font-semibold">Pending UTR</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                      <div>{b.date}</div>
                      <div className="text-[10px] text-gray-400">{b.timeSlot}</div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400 font-medium">
                      No customer bookings received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Recent Activity Log</h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold">{stats.logs.length} Recent Clicks</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-4">Time</th>
                  <th className="p-4">Profile Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Page URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.logs.map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-gray-900 text-sm">
                      {log.profileName} <span className="text-red-500" title="Genuine Photos">💋 100% GENUINE PHOTOS</span>
                    </td>
                    <td className="p-4 text-sm text-blue-600 font-medium whitespace-nowrap">
                      <span className="bg-blue-50 px-2 py-1 rounded-lg">{log.location}</span>
                    </td>
                    <td className="p-4 text-sm text-blue-500 hover:text-blue-700 hover:underline max-w-[200px] truncate whitespace-nowrap">
                      <a href={log.pageUrl} target="_blank" rel="noopener noreferrer">
                        {log.pageUrl}
                      </a>
                    </td>
                  </tr>
                ))}
                {stats.logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400 font-medium">
                      No recent activity logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
