import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeVerification from "@/components/AgeVerification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://callgirl4u.com"),
  title: "Call Girls | Book Your Dream Girl 24/7 | Callgirl4U - No Advance Payment Free Delivery",
  description: "Are you looking for CALL GIRLS and escort service? Callgirl4U Adult classifieds ads, independent call girls across India. The largest call girls ads selection in India. Book verified call girls 24/7, cash payment, quick delivery.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  verification: {
    google: "SpyQGiO6Xnof3s0pzxahMK-knEv_WfhUsQcp5MXVWh0",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AgeVerification />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
