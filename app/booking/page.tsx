import { Metadata } from "next";
import BookingClient from "./BookingClient";
import { locations, getAllStates, POPULAR_CITIES } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "Online Booking & Appointment Token | CallGirl4U India",
  description: "Book verified companion & massage services online across India. Select location, incall or outcall, duration, scan UPI QR code for advance payment, and receive your instant booking token.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://callgirl4u.com/booking" }
};

export default function BookingPage() {
  const states = getAllStates();
  return (
    <BookingClient
      locations={locations}
      states={states}
      popularCities={POPULAR_CITIES}
    />
  );
}
