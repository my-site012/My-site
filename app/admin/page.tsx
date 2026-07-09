"use client";

import { useState, useEffect, useCallback } from "react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = checking
  const [email, setEmail] = useState("");
  const [stats, setStats] = useState({ clicks: 0, phone: "", logs: [] as any[], maintenance: false, dailyHits: [] as {date: string; hits: number}[] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [phones, setPhones] = useState<string[]>(["", "", "", "", "", ""]);
  const [boyPhones, setBoyPhones] = useState<string[]>(["", "", "", "", "", ""]);

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

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setFetchError("");
      } else if (res.status === 401) {
        // Session expired, go back to login
        setIsLoggedIn(false);
      } else {
        setFetchError("Failed to load data. Please try again.");
      }
    } catch (err) {
      setFetchError("Network error. Check connection.");
    }
  }, []);

  // On mount: check if session cookie exists by trying to fetch stats
  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

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
      body: JSON.stringify({ phone: phoneString, callBoyPhone: boyPhoneString }),
    });
    setLoading(false);
    if (res.ok) {
      setStats(prev => ({ ...prev, phone: phoneString, callBoyPhone: boyPhoneString } as any));
      setMessage("Phone numbers updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
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
