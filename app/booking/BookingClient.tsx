"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface BookingClientProps {
  locations: Record<string, string[]>;
  states: string[];
  popularCities: string[];
}

export default function BookingClient({
  locations,
  states,
  popularCities,
}: BookingClientProps) {
  // Navigation / Tab state
  const [activeTab, setActiveTab] = useState<"book" | "track">("book");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<"Incall" | "Outcall">("Incall");
  const [duration, setDuration] = useState("2 Hours");
  const [category, setCategory] = useState("Call Girls");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("Immediate / Right Now");
  const [notes, setNotes] = useState("");

  // Step 2 Fields
  const [utr, setUtr] = useState("");
  const [upiSender, setUpiSender] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Step 3 / Result
  const [generatedToken, setGeneratedToken] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Track existing token
  const [trackTokenInput, setTrackTokenInput] = useState("");
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedBooking, setTrackedBooking] = useState<any>(null);
  const [trackError, setTrackError] = useState("");

  // Cities for selected state or all filtered
  const availableCities = useMemo(() => {
    if (selectedState && locations[selectedState]) {
      return locations[selectedState];
    }
    // Return all cities if no state selected
    const all: string[] = [];
    Object.values(locations).forEach((cityList) => {
      all.push(...cityList);
    });
    return Array.from(new Set(all));
  }, [selectedState, locations]);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return availableCities.slice(0, 40);
    const query = citySearch.toLowerCase();
    return availableCities
      .filter((c) => c.toLowerCase().includes(query))
      .slice(0, 50);
  }, [availableCities, citySearch]);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedCity("");
    setCitySearch("");
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    // Auto-detect state if not selected
    if (!selectedState) {
      for (const [st, cities] of Object.entries(locations)) {
        if (cities.includes(cityName)) {
          setSelectedState(st);
          break;
        }
      }
    }
  };

  const handleQuickCitySelect = (cityName: string) => {
    handleCitySelect(cityName);
  };

  const copyToClipboard = (text: string, type: "upi" | "token") => {
    navigator.clipboard.writeText(text);
    if (type === "upi") {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    setErrorMessage("");
    if (!name.trim()) {
      setErrorMessage("Please enter your full name (अपना नाम दर्ज करें).");
      return false;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number (मान्य 10 अंकों का मोबाइल नंबर दर्ज करें).");
      return false;
    }
    if (!selectedCity) {
      setErrorMessage("Please select your location / city (कृपया अपना शहर चुनें).");
      return false;
    }
    return true;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Step 2 Submission & Token Generation
  const handleSubmitBooking = async () => {
    setErrorMessage("");
    setSubmitting(true);

    try {
      const payload = {
        name,
        phone,
        serviceType,
        duration,
        category,
        state: selectedState,
        city: selectedCity,
        address,
        date,
        timeSlot,
        advanceAmount: 1000,
        utr,
        upiSender,
        notes,
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process booking");
      }

      setGeneratedToken(data.token);
      setConfirmedBooking(data.booking);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Track Token Handler
  const handleTrackToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError("");
    setTrackedBooking(null);

    if (!trackTokenInput.trim()) {
      setTrackError("Please enter your Token Number (e.g. BK-123456)");
      return;
    }

    setTrackingLoading(true);
    try {
      const res = await fetch(`/api/booking?token=${encodeURIComponent(trackTokenInput.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Booking not found for this token number");
      }
      setTrackedBooking(data.booking);
    } catch (err: any) {
      setTrackError(err.message || "Token not found. Please double check the number.");
    } finally {
      setTrackingLoading(false);
    }
  };

  // Build WhatsApp pre-filled text
  const getWhatsAppMessage = (tokenVal: string, bookingObj?: any) => {
    const b = bookingObj || confirmedBooking;
    const utrStr = b?.utr ? `\nPayment UTR: ${b.utr}` : "";
    return `Hello CallGirl4U Team,
I have booked an appointment online.
*Token Number:* ${tokenVal}
*Name:* ${b?.name || name}
*Phone:* ${b?.phone || phone}
*City:* ${b?.city || selectedCity}
*Service:* ${b?.serviceType || serviceType}
*Duration:* ${b?.duration || duration}
*Date & Slot:* ${b?.date || date} (${b?.timeSlot || timeSlot})
*Advance Paid:* ₹1,000${utrStr}

Please confirm and dispatch!`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-8 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Top Header & Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-600 hover:text-red-600 flex items-center gap-1 transition"
          >
            ← Back to Home
          </Link>
          <div className="flex bg-gray-200 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab("book");
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "book"
                  ? "bg-red-600 text-white shadow"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              📅 New Booking
            </button>
            <button
              onClick={() => {
                setActiveTab("track");
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === "track"
                  ? "bg-red-600 text-white shadow"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              🔍 Track Token
            </button>
          </div>
        </div>

        {/* TRACK TOKEN TAB */}
        {activeTab === "track" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 mb-12">
            <div className="text-center max-w-lg mx-auto mb-8">
              <span className="text-4xl mb-3 inline-block">🎟️</span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Check Booking Status
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Enter your Token Number below to verify your appointment details and payment status.
              </p>
            </div>

            <form onSubmit={handleTrackToken} className="max-w-md mx-auto mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackTokenInput}
                  onChange={(e) => setTrackTokenInput(e.target.value.toUpperCase())}
                  placeholder="Enter Token (e.g. BK-783921)"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none text-base font-bold uppercase tracking-wider"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
                >
                  {trackingLoading ? "Checking..." : "Track"}
                </button>
              </div>
              {trackError && (
                <p className="text-red-600 text-xs font-semibold mt-2 text-center">
                  ⚠️ {trackError}
                </p>
              )}
            </form>

            {/* Tracked Result Display */}
            {trackedBooking && (
              <div className="border-2 border-dashed border-red-300 bg-red-50/40 rounded-2xl p-6 max-w-xl mx-auto animate-fadeIn">
                <div className="flex items-center justify-between pb-4 border-b border-red-200 mb-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-500 font-bold block">
                      Token Number
                    </span>
                    <span className="text-2xl font-black text-red-600 font-mono tracking-wider">
                      {trackedBooking.token}
                    </span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                    ● {trackedBooking.status || "Active"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                  <div>
                    <span className="text-gray-500 text-xs block">Client Name</span>
                    <span className="font-bold text-gray-900">{trackedBooking.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Phone</span>
                    <span className="font-bold text-gray-900">{trackedBooking.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Service & Mode</span>
                    <span className="font-bold text-gray-900">
                      {trackedBooking.serviceType} • {trackedBooking.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Duration</span>
                    <span className="font-bold text-gray-900">{trackedBooking.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Location</span>
                    <span className="font-bold text-gray-900">
                      {trackedBooking.city} {trackedBooking.state ? `(${trackedBooking.state})` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block">Advance Paid</span>
                    <span className="font-bold text-emerald-700">₹{trackedBooking.advanceAmount}</span>
                  </div>
                  {trackedBooking.utr && (
                    <div className="col-span-2">
                      <span className="text-gray-500 text-xs block">Payment UTR / Ref</span>
                      <span className="font-mono text-xs font-bold text-gray-800 bg-white px-2 py-1 rounded border">
                        {trackedBooking.utr}
                      </span>
                    </div>
                  )}
                </div>

                <a
                  href={`https://wa.me/919232504628?text=${encodeURIComponent(
                    getWhatsAppMessage(trackedBooking.token, trackedBooking)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow transition text-sm"
                >
                  <span>💬</span> Contact Support with this Token
                </a>
              </div>
            )}
          </div>
        )}

        {/* BOOKING FLOW TAB */}
        {activeTab === "book" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12">
            {/* Top Banner & Title */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 text-white p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-2">
                  🔒 100% Confidential &amp; Verified Booking
                </span>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
                  Book Your Appointment Online
                </h1>
                <p className="text-white/90 text-xs sm:text-sm max-w-xl mx-auto">
                  Instant confirmation token, verified companion profiles, and seamless advance booking.
                </p>
              </div>

              {/* Decorative background shapes */}
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-8">
              <div className="flex items-center justify-between max-w-xl mx-auto relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-0"></div>
                <div
                  className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 transition-all duration-500 -z-0"
                  style={{
                    width: step === 1 ? "15%" : step === 2 ? "60%" : "100%",
                  }}
                ></div>

                {/* Step 1 Indicator */}
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition shadow-sm ${
                      step >= 1 ? "bg-red-600 text-white ring-4 ring-red-100" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 mt-1">Details</span>
                </div>

                {/* Step 2 Indicator */}
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition shadow-sm ${
                      step >= 2 ? "bg-red-600 text-white ring-4 ring-red-100" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 mt-1">QR Payment</span>
                </div>

                {/* Step 3 Indicator */}
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition shadow-sm ${
                      step === 3 ? "bg-emerald-600 text-white ring-4 ring-emerald-100" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    ✓
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 mt-1">Token Pass</span>
                </div>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mx-6 sm:mx-8 mt-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-r-xl flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="text-sm font-semibold text-red-800">{errorMessage}</div>
              </div>
            )}

            {/* ─────────────────────────────────────────────
                STEP 1: DETAILS FORM
            ─────────────────────────────────────────────── */}
            {step === 1 && (
              <form onSubmit={handleProceedToPayment} className="p-6 sm:p-10 space-y-8">
                {/* 1. Client Identity */}
                <div>
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">1</span>
                    Client Information (क्लाइंट की जानकारी)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Client Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Phone Number (WhatsApp / Calling) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                          placeholder="9876543210"
                          className="w-full pl-16 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition text-sm font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Service Category & Incall/Outcall */}
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">2</span>
                    Service Type &amp; Mode (सर्विस का प्रकार)
                  </h2>

                  {/* Category Selection */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Select Category
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {[
                        { label: "Call Girls", icon: "💃" },
                        { label: "Relaxing Massage", icon: "💆" },
                        { label: "Call Boys", icon: "🕺" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setCategory(item.label)}
                          className={`p-3 rounded-xl border text-center transition font-bold text-xs sm:text-sm flex flex-col items-center gap-1 cursor-pointer ${
                            category === item.label
                              ? "bg-red-50 border-red-600 text-red-700 shadow-sm"
                              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Incall / Outcall Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Service Mode (Incall or Outcall) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {/* Incall Card */}
                      <button
                        type="button"
                        onClick={() => setServiceType("Incall")}
                        className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                          serviceType === "Incall"
                            ? "border-red-600 bg-red-50/50 shadow-md ring-2 ring-red-100"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                            serviceType === "Incall" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          🏨
                        </div>
                        <div>
                          <div className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                            <span>Incall Service</span>
                            {serviceType === "Incall" && <span className="text-red-600 text-xs">● Selected</span>}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                            Visit companion’s verified private hotel or apartment.
                          </p>
                        </div>
                      </button>

                      {/* Outcall Card */}
                      <button
                        type="button"
                        onClick={() => setServiceType("Outcall")}
                        className={`p-4 rounded-2xl border-2 text-left transition flex items-start gap-3 cursor-pointer ${
                          serviceType === "Outcall"
                            ? "border-red-600 bg-red-50/50 shadow-md ring-2 ring-red-100"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                            serviceType === "Outcall" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          🚗
                        </div>
                        <div>
                          <div className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                            <span>Outcall Service</span>
                            {serviceType === "Outcall" && <span className="text-red-600 text-xs">● Selected</span>}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                            Companion visits your hotel room, home, or resort.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Duration / Kitne time ke liye */}
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">3</span>
                    Duration Required (कितने समय के लिए चाहिए) <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-xs text-gray-500 mb-3">Choose the duration you need the appointment for:</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { time: "1 Hour", desc: "Short Session", tag: "" },
                      { time: "2 Hours", desc: "Standard Relax", tag: "Most Popular" },
                      { time: "3 Hours", desc: "Extended Fun", tag: "" },
                      { time: "Half Night (4-6 Hours)", desc: "Evening to Midnight", tag: "" },
                      { time: "Full Night (8-10 Hours)", desc: "Complete Overnight", tag: "Best Value" },
                      { time: "Weekend / 24 Hours", desc: "Travel & Tours", tag: "VIP" },
                    ].map((item) => (
                      <button
                        key={item.time}
                        type="button"
                        onClick={() => setDuration(item.time)}
                        className={`p-3 rounded-xl border text-left transition relative cursor-pointer ${
                          duration === item.time
                            ? "bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-200"
                            : "bg-white border-gray-200 text-gray-800 hover:border-gray-300"
                        }`}
                      >
                        {item.tag && (
                          <span
                            className={`absolute top-2 right-2 text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                              duration === item.time
                                ? "bg-white text-red-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.tag}
                          </span>
                        )}
                        <div className="font-extrabold text-sm sm:text-base">{item.time}</div>
                        <div
                          className={`text-[11px] mt-0.5 ${
                            duration === item.time ? "text-red-100" : "text-gray-400"
                          }`}
                        >
                          {item.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Location Picker (From website locations) */}
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">4</span>
                    Choose Location (लोकेशन चुनें) <span className="text-red-500">*</span>
                  </h2>
                  <p className="text-xs text-gray-500 mb-3">
                    Select any city available across India:
                  </p>

                  {/* Popular quick-select city pills */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                      Popular Cities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {popularCities.slice(0, 14).map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleQuickCitySelect(city)}
                          className={`text-xs px-3 py-1.5 rounded-full font-bold transition border cursor-pointer ${
                            selectedCity.toLowerCase() === city.toLowerCase()
                              ? "bg-red-600 text-white border-red-600 shadow-sm"
                              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* State and City Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Select State (राज्य)
                      </label>
                      <select
                        value={selectedState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-600 outline-none text-sm font-semibold"
                      >
                        <option value="">-- All States of India --</option>
                        {states.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Select City (शहर) <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          placeholder="Type to filter city..."
                          className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-red-600"
                        />
                        <select
                          required
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-600 outline-none text-sm font-semibold"
                        >
                          <option value="">-- Choose City --</option>
                          {filteredCities.map((ct) => (
                            <option key={ct} value={ct}>
                              {ct}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Address / Hotel Details */}
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {serviceType === "Outcall"
                        ? "Your Complete Address / Hotel & Room Number"
                        : "Preferred Area / Landmark / Hotel Preference"}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={
                        serviceType === "Outcall"
                          ? "e.g. Room 402, Radisson Hotel, Airport Road"
                          : "e.g. Near City Center, 4-Star Hotel, or specific area"
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-600 outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                {/* 5. Date & Time Slot */}
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">5</span>
                    Appointment Schedule (तारीख और समय)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-600 outline-none text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Preferred Time Slot
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-600 outline-none text-sm font-semibold"
                      >
                        <option value="Immediate / Right Now">⚡ Immediate / ASAP (Within 30-45 mins)</option>
                        <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                        <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                        <option value="Night (08:00 PM - 12:00 AM)">Night (08:00 PM - 12:00 AM)</option>
                        <option value="Late Night (12:00 AM - 04:00 AM)">Late Night (12:00 AM - 04:00 AM)</option>
                        <option value="Tomorrow Morning / Flexible">Flexible / Call to Coordinate</option>
                      </select>
                    </div>
                  </div>

                  {/* Special Notes */}
                  <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Special Requests / Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific preference regarding appearance, attire, discretion, or instructions..."
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-600 outline-none text-sm font-medium"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Step 1 Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>Continue to Payment &amp; QR Code (₹1,000 Advance)</span>
                    <span className="text-xl">→</span>
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    🔒 Advance amount of ₹1,000 is 100% adjusted into your final service bill.
                  </p>
                </div>
              </form>
            )}

            {/* ─────────────────────────────────────────────
                STEP 2: QR PAYMENT & TOKEN GENERATION
            ─────────────────────────────────────────────── */}
            {step === 2 && (
              <div className="p-6 sm:p-10">
                {/* Summary bar */}
                <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500">Booking for: </span>
                    <strong className="text-gray-900">{name}</strong> ({phone})
                  </div>
                  <div>
                    <span className="text-gray-500">Service: </span>
                    <strong className="text-red-700">
                      {serviceType} • {selectedCity} • {duration}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Edit Details ✎
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Left Column: QR Code Display */}
                  <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-3xl border border-gray-200 shadow-inner">
                    <span className="text-xs font-black tracking-widest uppercase text-gray-500 mb-1">
                      ACCEPTED HERE
                    </span>
                    <h3 className="text-lg font-black text-gray-900 mb-3">Scan &amp; Pay ₹1,000</h3>

                    {/* QR Code Container */}
                    <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-white p-3 rounded-2xl shadow-md border-2 border-gray-100 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/images/payment-qr.png"
                        alt="Payment QR Code - Pay ₹1,000"
                        width={280}
                        height={280}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </div>

                    {/* Amount & UPI Details */}
                    <div className="mt-4 w-full max-w-xs">
                      <div className="text-2xl font-black text-gray-900 mb-1">Pay ₹1,000</div>
                      <div className="text-xs text-gray-500 font-medium mb-3">
                        Advance Booking Token Amount
                      </div>

                      {/* UPI ID Box with Copy Button */}
                      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                        <span className="text-xs font-mono font-bold text-gray-800 truncate mr-2">
                          sharmajii01@fam
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("sharmajii01@fam", "upi")}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-lg transition whitespace-nowrap active:scale-95"
                        >
                          {copiedUpi ? "✓ Copied!" : "📋 Copy"}
                        </button>
                      </div>

                      {/* Mobile Deep Link: Open UPI Apps */}
                      <a
                        href="upi://pay?pa=sharmajii01@fam&pn=CallGirl4U&am=1000&cu=INR&tn=BookingAdvance"
                        className="mt-3 inline-flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow transition active:scale-95 sm:hidden"
                      >
                        <span>📱</span> Pay with UPI App (GPay / PhonePe / Paytm)
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Payment Verification Form */}
                  <div className="space-y-6">
                    <div>
                      <div className="inline-block bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full mb-2 border border-amber-200">
                        ⚡ Quick Verification
                      </div>
                      <h3 className="text-xl font-black text-gray-900">
                        Enter Payment Details to Get Your Token
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        After scanning the QR code and completing your ₹1,000 payment, please enter your 12-digit UPI Reference / UTR Number below to instantly receive your official booking token.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          12-Digit UPI Ref / UTR / Transaction ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={utr}
                          maxLength={16}
                          onChange={(e) => setUtr(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
                          placeholder="e.g. 423891028371"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none text-base font-mono font-bold uppercase transition"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">
                          Tip: Found in your Google Pay, PhonePe, or Paytm payment receipt under &quot;UPI Ref No.&quot; or &quot;UTR&quot;.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Your UPI Name or Account Handle (Optional)
                        </label>
                        <input
                          type="text"
                          value={upiSender}
                          onChange={(e) => setUpiSender(e.target.value)}
                          placeholder="e.g. Rahul Sharma or yourname@oksbi"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-600 outline-none text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800 leading-relaxed">
                      💡 <strong>Note:</strong> Once you submit, our system will generate your <strong>Unique Token Number</strong>. You can present this token to your assigned companion or support team for immediate dispatch.
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleSubmitBooking}
                        disabled={submitting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <span className="animate-spin text-xl">⏳</span>
                            <span>Verifying &amp; Generating Token...</span>
                          </>
                        ) : (
                          <>
                            <span>I Have Paid — Generate My Token 🎟️</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition"
                      >
                        ← Back to Edit Booking Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────
                STEP 3: TOKEN SLIP & APPOINTMENT CONFIRMATION
            ─────────────────────────────────────────────── */}
            {step === 3 && confirmedBooking && (
              <div className="p-6 sm:p-10 animate-fadeIn">
                {/* Celebratory Banner */}
                <div className="text-center max-w-lg mx-auto mb-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm ring-8 ring-emerald-50">
                    ✓
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    Booking Submitted Successfully!
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Your appointment request has been recorded. Here is your official booking pass:
                  </p>
                </div>

                {/* Printable Token Pass */}
                <div
                  id="printable-booking-slip"
                  className="max-w-xl mx-auto bg-gradient-to-b from-white to-gray-50 border-2 border-red-600 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8"
                >
                  {/* Decorative notch cuts on sides */}
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r-2 border-red-600"></div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l-2 border-red-600"></div>

                  {/* Header of the Pass */}
                  <div className="flex items-center justify-between border-b-2 border-dashed border-gray-200 pb-5 mb-5">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-100 px-2 py-0.5 rounded">
                        Official Pass
                      </span>
                      <h3 className="text-lg font-black text-gray-900 mt-1">CallGirl4U Directory</h3>
                    </div>
                    <div className="text-right">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider block">
                        ● Token Active
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">
                        {new Date(confirmedBooking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* PROMINENT TOKEN NUMBER BOX */}
                  <div className="bg-red-600 text-white rounded-2xl p-5 text-center shadow-lg mb-6 relative">
                    <span className="text-[11px] font-bold tracking-widest uppercase text-red-200 block">
                      Your Unique Booking Token
                    </span>
                    <div className="text-3xl sm:text-5xl font-black font-mono tracking-widest my-1 select-all">
                      {generatedToken}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generatedToken, "token")}
                      className="mt-1 bg-white text-red-700 hover:bg-red-50 text-xs font-black px-4 py-1.5 rounded-full shadow-sm transition active:scale-95 inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedToken ? "✓ Token Copied!" : "📋 Copy Token Number"}
                    </button>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs sm:text-sm py-2 border-b border-gray-200">
                    <div>
                      <span className="text-gray-400 text-[11px] block">Client Name</span>
                      <span className="font-extrabold text-gray-900">{confirmedBooking.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Client Mobile</span>
                      <span className="font-extrabold text-gray-900">{confirmedBooking.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Service &amp; Mode</span>
                      <span className="font-extrabold text-gray-900">
                        {confirmedBooking.serviceType} ({confirmedBooking.category})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Duration</span>
                      <span className="font-extrabold text-gray-900">{confirmedBooking.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Location</span>
                      <span className="font-extrabold text-red-700">
                        {confirmedBooking.city}, {confirmedBooking.state}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Schedule</span>
                      <span className="font-extrabold text-gray-900">
                        {confirmedBooking.date} • {confirmedBooking.timeSlot}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Advance Amount Paid</span>
                      <span className="font-extrabold text-emerald-700">₹{confirmedBooking.advanceAmount}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[11px] block">Payment Ref / UTR</span>
                      <span className="font-mono font-bold text-gray-800">
                        {confirmedBooking.utr || "Pending Submission"}
                      </span>
                    </div>
                    {confirmedBooking.address && (
                      <div className="col-span-2">
                        <span className="text-gray-400 text-[11px] block">Address / Landmark</span>
                        <span className="font-medium text-gray-700">{confirmedBooking.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Notice Footer */}
                  <div className="mt-4 text-[10px] text-gray-400 text-center leading-relaxed">
                    Please keep this token safe. Our representative will verify this Token on call/WhatsApp before dispatching the service.
                  </div>
                </div>

                {/* Instant Actions */}
                <div className="max-w-xl mx-auto space-y-3">
                  {/* WhatsApp Support Share Button */}
                  <a
                    href={`https://wa.me/919232504628?text=${encodeURIComponent(
                      getWhatsAppMessage(generatedToken, confirmedBooking)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-base active:scale-[0.99]"
                  >
                    <span className="text-xl">💬</span>
                    <span>Send Token to Support on WhatsApp for Instant Dispatch</span>
                  </a>

                  {/* Print / Save Receipt Button */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow"
                    >
                      <span>🖨️</span> Print / Save Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setName("");
                        setPhone("");
                        setAddress("");
                        setUtr("");
                        setUpiSender("");
                        setNotes("");
                        setConfirmedBooking(null);
                        setGeneratedToken("");
                      }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-gray-200"
                    >
                      <span>🔄</span> Book Another Appointment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trust Badges / Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-2xl mb-1 inline-block">🛡️</span>
            <div className="font-extrabold text-sm text-gray-900">Discreet &amp; Private</div>
            <p className="text-xs text-gray-500 mt-1">Your privacy and data are completely protected.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-2xl mb-1 inline-block">⚡</span>
            <div className="font-extrabold text-sm text-gray-900">Instant Token System</div>
            <p className="text-xs text-gray-500 mt-1">Auto-generated token ensures zero wait time.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-2xl mb-1 inline-block">💯</span>
            <div className="font-extrabold text-sm text-gray-900">100% Genuine Profiles</div>
            <p className="text-xs text-gray-500 mt-1">Directly connects you with verified companions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
