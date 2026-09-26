"use client";

import { useState } from "react";

export default function TelegramFloatingButton() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <aside
      aria-label="Telegram VIP Channel Quick Access"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-1.5 select-none"
    >
      <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#0088cc] to-[#00a2ed] text-white pl-3.5 pr-2 py-2 rounded-full shadow-2xl shadow-sky-600/35 border border-white/25 hover:from-[#0077b5] hover:to-[#0092d8] transition-all transform hover:scale-105 active:scale-95">
        <a
          href="https://t.me/vipfungirls"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-bold text-xs sm:text-sm text-white"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          <span className="tracking-wide">Join VIP Telegram</span>
        </a>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setClosed(true);
          }}
          className="ml-1 text-white/80 hover:text-white bg-black/15 hover:bg-black/30 rounded-full w-5 h-5 flex items-center justify-center text-xs transition"
          aria-label="Dismiss Telegram banner"
          title="Close"
        >
          ✕
        </button>
      </div>

      <div className="text-[10px] font-semibold text-gray-500 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-gray-200/90 mr-2">
        240+ Cities Available
      </div>
    </aside>
  );
}
