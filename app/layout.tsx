import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeVerification from "@/components/AgeVerification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://callgirl4u.com"),
  title: "CallGirl4U India – #1 Adult Classified Ads & Escort Directory",
  description: "CallGirl4U is the #1 adult classifieds website in India. Browse local listings for independent call girls, massages, male escorts, and shemale dating in your city. Post your adult ad absolutely FREE!",
  keywords: "adult classifieds india, adult classified website, escorts in india, call girls india, male escorts, massages, shemale escorts, post free adult ads",
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
      <head>
        <meta name="google-site-verification" content="4q9gLbRNwfJE0crAutXcsgeVLQloYZ6L7aSihfNXfo8" />
      </head>
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
