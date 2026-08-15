import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeVerification from "@/components/AgeVerification";
import SecurityProvider from "@/components/SecurityProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://callgirl4u.com"),
  title: "CallGirl4U India – #1 Adult Classified Ads & Escort Directory",
  description: "CallGirl4U is the #1 adult classifieds website in India. Browse local listings for independent call girls, massages, male escorts, and shemale dating in your city. Post your adult ad absolutely FREE!",
  keywords: "adult classifieds india, adult classified website, escorts in india, call girls india, male escorts, massages, shemale escorts, post free adult ads",
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
        {/* Google Analytics 4 (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GYH19TGGCN"
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-GYH19TGGCN');
            `,
          }}
        />
        <meta name="google-site-verification" content="4q9gLbRNwfJE0crAutXcsgeVLQloYZ6L7aSihfNXfo8" />
        {/* DNS prefetch + preconnect for faster resource loading */}
        <link rel="dns-prefetch" href="https://api.whatsapp.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
        {/* Preconnect to self-origin for image optimization */}
        <link rel="preconnect" href="https://callgirl4u.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Don't block bots/crawlers — they have no localStorage
                  var ua = navigator.userAgent || '';
                  var isBot = /bot|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|crawler|spider|robot|crawling/i.test(ua);
                  if (isBot) return; // Googlebot sees full content, no age-unverified class
                  var verified = localStorage.getItem('age-verified');
                  if (!verified) {
                    document.documentElement.classList.add('age-unverified');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <SecurityProvider />
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
