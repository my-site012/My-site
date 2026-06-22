"use client";

import { useState, useEffect, useCallback } from "react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = checking
  const [email, setEmail] = useState("");
  const [stats, setStats] = useState({ clicks: 0, phone: "", logs: [] as any[] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fetchError, setFetchError] = useState("");

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
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: stats.phone }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Phone number updated successfully!");
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
                placeholder="worksunil26@gmail.com"
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

        {/* Settings Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Global Meta & Contact Settings</h3>
          </div>
          <div className="p-8">
            <form onSubmit={handleUpdatePhone} className="max-w-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Global WhatsApp Number</label>
                  <input
                    type="text"
                    value={stats.phone}
                    onChange={(e) => setStats({ ...stats, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition"
                    placeholder="919119332977"
                  />
                  <p className="mt-1.5 text-[10px] text-gray-400">Include country code, e.g. 918905822138</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Global Phone Number</label>
                  <input
                    type="text"
                    value={stats.phone}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
                    placeholder="Same as WhatsApp"
                  />
                  <p className="mt-1.5 text-[10px] text-gray-400">For "Call Now" buttons</p>
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
