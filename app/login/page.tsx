"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 ml-1">EMAIL ADDRESS</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-gray-600 outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-300">PASSWORD</label>
                <Link href="#" className="text-[10px] md:text-xs text-red-500 hover:text-red-400 font-bold uppercase transition-colors">Forgot?</Link>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-gray-600 outline-none focus:border-red-500/50 focus:bg-white/10 transition-all font-medium"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-600/20 transform active:scale-[0.98] transition-all tracking-widest uppercase text-sm"
            >
              Sign In Now
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-full border-t border-white/5"></div>
              <span className="relative bg-[#121212] px-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3 rounded-2xl transition-all">
                <span className="text-lg">G</span>
                <span className="text-xs font-bold font-sans">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-3 rounded-2xl transition-all">
                <span className="text-lg">𝕏</span>
                <span className="text-xs font-bold font-sans">Twitter</span>
              </button>
            </div>
          </div>

          <p className="text-center mt-8 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="#" className="text-red-500 hover:text-red-400 font-bold transition-colors underline underline-offset-4">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
