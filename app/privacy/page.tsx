import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CallGirl4U Platform",
  description: "CallGirl4U Privacy Policy. Detailed information on user data handling, cookie usage, privacy protection, and safety protocols for our classifieds platform.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://callgirl4u.com/privacy" }
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-gray">
      <h1 className="text-3xl font-black mb-4 text-gray-900">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: January 1, 2026 | Last Reviewed: September 2026</p>
      
      <p className="text-gray-700 leading-relaxed">
        CallGirl4U (&quot;Platform&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects the privacy rights of our users. This Privacy Policy details how information is collected, stored, processed, and safeguarded when visiting or advertising on our platform.
      </p>
      
      <h2 className="text-xl font-bold mt-8 text-gray-900">1. Age Requirement &amp; Scope</h2>
      <p className="text-gray-700 leading-relaxed">
        This platform is strictly designated for consenting adults aged 18 and older. We do not knowingly collect or solicit personal data from anyone under the age of 18. If we obtain knowledge that a user is under 18, all associated data and listings will be deleted immediately.
      </p>

      <h2 className="text-xl font-bold mt-8 text-gray-900">2. Information We Collect</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong>Browsing / Non-Personal Data:</strong> We collect non-personally identifiable technical information such as browser type, operating system, and anonymized referral metrics to ensure uptime and platform security.</li>
        <li><strong>Advertiser Submitted Data:</strong> When users submit a classified listing, we collect the details provided voluntarily (such as advertising title, general city location, phone/WhatsApp contact information, and uploaded profile photos).</li>
        <li><strong>Server Security Logs:</strong> Temporary security logs (IP addresses and timestamps) are kept to protect against denial-of-service attacks, automated scrapers, and malicious bot activities.</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 text-gray-900">3. Cookies and Local Storage</h2>
      <p className="text-gray-700 leading-relaxed">
        We utilize local storage and functional cookies exclusively for vital website operations, such as remembering your age verification confirmation and user session states. We do not sell tracking cookies or share behavioral advertising data with third parties.
      </p>

      <h2 className="text-xl font-bold mt-8 text-gray-900">4. User Content &amp; Public Visibility</h2>
      <p className="text-gray-700 leading-relaxed">
        Any information, contact details, or images submitted in a public advertisement will be displayed publicly on the platform. Advertisers are advised to only share public business contact channels and refrain from uploading sensitive personal documents.
      </p>

      <h2 className="text-xl font-bold mt-8 text-gray-900">5. Data Removal &amp; Privacy Requests</h2>
      <p className="text-gray-700 leading-relaxed">
        Advertisers have the right to edit, modify, or permanently delete their published listings at any time. If you wish to request the immediate removal of an advertisement or associated contact information, please email our support team at <a href="mailto:worksunil26@gmail.com" className="text-blue-600 underline">worksunil26@gmail.com</a> with the listing URL.
      </p>

      <h2 className="text-xl font-bold mt-8 text-gray-900">6. Security &amp; Data Protection</h2>
      <p className="text-gray-700 leading-relaxed">
        We employ HTTPS encryption, Web Application Firewalls (WAF), and access control mechanisms to safeguard platform data. While no system is impenetrable, we maintain continuous safeguards to protect against unauthorized data tampering.
      </p>
    </div>
  );
}
