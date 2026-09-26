import React from "react";

interface TelegramBannerProps {
  channelName?: string;
  channelLink?: string;
  handle?: string;
  className?: string;
}

export default function TelegramBanner({
  channelName = "FunGirls VIP Telegram Channel",
  channelLink = "https://t.me/vipfungirls",
  handle = "@vipfungirls",
  className = "",
}: TelegramBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-sky-200/90 bg-gradient-to-r from-sky-50 via-cyan-50/50 to-blue-50 p-4 sm:p-5 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-200/30 blur-2xl" />
      <div className="pointer-events-none absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-blue-200/30 blur-xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Icon & Info */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0088cc] text-white shadow-md shadow-sky-500/25 transition-transform hover:scale-105">
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-gray-900 text-sm sm:text-base">
                {channelName}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm text-gray-600">
              Real photos, daily updates &amp; direct contact in 240+ cities.
            </p>
          </div>
        </div>

        {/* Right: Join Button */}
        <a
          href={channelLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0088cc] to-[#009ce8] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-sky-500/25 transition-all hover:from-[#0077b5] hover:to-[#0088cc] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <span>Join {handle}</span>
          <span className="text-base leading-none">→</span>
        </a>
      </div>
    </div>
  );
}
