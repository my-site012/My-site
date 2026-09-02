import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions of Use | CallGirl4U Directory",
  description: "Terms and Conditions for CallGirl4U adult classifieds directory. User guidelines, advertiser rules, content moderation, and legal disclaimers.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://callgirl4u.com/terms" }
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-gray">
      <h1 className="text-3xl font-black mb-4 text-gray-900">Terms and Conditions of Use</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: September 2026</p>

      <p className="text-gray-700 leading-relaxed">
        Please review these Terms and Conditions carefully prior to accessing or publishing advertisements on CallGirl4U (&quot;Platform&quot;). By browsing or using this platform, you affirm that you understand and agree to comply with all provisions stated herein.
      </p>

      <h2 className="text-xl font-bold mt-8 text-gray-900">1. Age Requirement &amp; Mandatory 18+ Verification</h2>
      <p className="text-gray-700 leading-relaxed">
        You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to browse, access, or post advertisements on this website. Access by minors is strictly forbidden.
      </p>

      <h2 className="text-xl font-bold mt-8 text-gray-900">2. Platform Role &amp; Intermediary Disclaimer</h2>
      <p className="text-gray-700 leading-relaxed">
        CallGirl4U operates solely as an online classifieds directory and hosting intermediary. We do not operate an escort agency, organize bookings, participate in companion agreements, or process financial payments on behalf of advertisers. Any contact, arrangements, or transactions are exclusively between independent advertisers and consenting adults.
      </p>

      <h2 className="text-xl font-bold mt-8 text-gray-900">3. Strict Zero-Tolerance Policy &amp; Prohibited Content</h2>
      <p className="text-gray-700 leading-relaxed">
        The following content and activities are strictly prohibited on this platform. Any violation will lead to permanent deletion of listings and immediate banning:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        <li>Any underage content, child exploitation, or involvement of minors (zero tolerance).</li>
        <li>Human trafficking, forced labor, coercion, or non-consensual exploitation.</li>
        <li>Financial fraud, online prepayment scams, extortion, or deceptive impersonation.</li>
        <li>Publication of third-party private personal data, contact details, or copyrighted media without explicit legal authorization.</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 text-gray-900">4. Advertiser Obligations &amp; Representations</h2>
      <p className="text-gray-700 leading-relaxed">
        Advertisers posting on this directory explicitly certify that they are at least 18 years of age, own the rights to the photos/media submitted, and are legally authorized to publish their contact advertisements in compliance with all relevant local and national regulations.
      </p>

      <h2 className="text-xl font-bold mt-8 text-gray-900">5. Limitation of Liability</h2>
      <p className="text-gray-700 leading-relaxed">
        CallGirl4U provides the directory on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. We disclaim liability for any direct or indirect dispute, loss, injury, or damages arising out of interactions between users and independent advertisers.
      </p>

      <h2 className="text-xl font-bold mt-8 text-gray-900">6. Reporting and Inquiries</h2>
      <p className="text-gray-700 leading-relaxed">
        For questions regarding these terms or to report prohibited behavior, contact our compliance team at <a href="mailto:worksunil26@gmail.com" className="text-blue-600 underline">worksunil26@gmail.com</a>.
      </p>
    </div>
  );
}
