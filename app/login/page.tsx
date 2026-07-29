"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        router.push("/ad/post");
        router.refresh();
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000" />

      {/* LOGIN CARD */}
      <div className="relative w-full max-w-[420px]">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-blue-500/10 rounded-3xl blur-2xl" />
        
        <div className="relative bg-[#121212]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">
              WELCOME <span className="text-red-500">BACK</span>
            </h1>
            <p className="text-gray-400 text-sm">Access your premium profile and ads</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 ml-1">EMAIL ADDRESS</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-gray-600 outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-300">PASSWORD</label>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-gray-600 outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-600/20 transform active:scale-[0.98] transition-all tracking-widest uppercase text-sm"
            >
              {loading ? "Signing In..." : "Sign In Now"}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link prefetch={false} href="/signup" className="text-red-500 hover:text-red-400 font-bold transition-colors underline underline-offset-4">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
