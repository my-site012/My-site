"use client";

import React from "react";

interface WhatsAppButtonProps {
  phone: string;
  className?: string;
  children: React.ReactNode;
}

export default function WhatsAppButton({ phone, className, children }: WhatsAppButtonProps) {
  const handleClick = async () => {
    try {
      // Track click in KV
      await fetch("/api/whatsapp-click", { method: "POST" });
    } catch (error) {
      console.error("Failed to track click");
    }
    
    // Redirect to WhatsApp
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank");
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
