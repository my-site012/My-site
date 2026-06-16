import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CallGirl4U",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-gray">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Privacy Policy</h1>
      <p>Last Updated: April 18, 2026</p>
      <p>Welcome to CallGirl4U. We value your privacy and are committed to protecting your personal information. This policy outlines how we handle data on our platform.</p>
      
      <h2 className="text-xl font-bold mt-8">1. Information Collection</h2>
      <p>We do not collect personal information from casual browsers. If you create an account or post an ad, we may collect email addresses and contact information necessary for service delivery.</p>

      <h2 className="text-xl font-bold mt-8">2. Data Usage</h2>
      <p>Your information is used solely to manage your account and display your ads. We do not sell or share your personal data with third parties for marketing purposes.</p>

      <h2 className="text-xl font-bold mt-8">3. Cookies</h2>
      <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic.</p>

      <h2 className="text-xl font-bold mt-8">4. Security</h2>
      <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>

      <h2 className="text-xl font-bold mt-8">5. Changes to This Policy</h2>
      <p>We may update this policy from time to time. We encourage you to review this page periodically for any changes.</p>
    </div>
  );
}
