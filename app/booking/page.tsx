import { Suspense } from "react";
import { Metadata } from "next";
import BookingClient from "./BookingClient";
import { locations, getAllStates, POPULAR_CITIES, getAllWebsiteCities } from "@/lib/data/locations";
import { getValue } from "@/lib/kv";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Online Booking & Appointment Token | CallGirl4U India",
  description: "Book verified companion & massage services online across India. Select location, incall or outcall, duration, scan UPI QR code for advance payment, and receive your instant booking token.",
  robots: { index: false, follow: false },
};

export default async function BookingPage() {
  const states = getAllStates();
  const allCities = getAllWebsiteCities();

  const defaultPrice = await getValue("booking_advance_price");
  const defaultQr = await getValue("booking_qr_image");
  const defaultUpi = await getValue("booking_upi_id");

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-gray-400">Loading booking...</div>}>
      <BookingClient
        locations={locations}
        states={states}
        popularCities={POPULAR_CITIES}
        allWebsiteCities={allCities}
        defaultAdvancePrice={Number(defaultPrice) || 1000}
        defaultQrImage={defaultQr || "/images/payment-qr.png"}
        defaultUpiId={defaultUpi || "sharmajii01@fam"}
      />
    </Suspense>
  );
}
