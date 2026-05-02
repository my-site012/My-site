"use client";

import React from "react";

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  className?: string;
  adContext?: {
    profileName: string;
    location: string;
    pageUrl: string;
  };
  children: React.ReactNode;
}

export default function WhatsAppButton({ phone, message, className, adContext, children }: WhatsAppButtonProps) {
  const handleClick = async () => {
    try {
      await fetch("/api/whatsapp-click", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adContext })
      });
    } catch (error) {
      console.error("Failed to track click");
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const encodedMsg = message ? `?text=${encodeURIComponent(message)}` : "";
    window.open(`https://wa.me/${cleanPhone}${encodedMsg}`, "_blank");
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
