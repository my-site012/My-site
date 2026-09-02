import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Support | CallGirl4U Directory",
  description: "Get in touch with CallGirl4U support for assistance, user safety questions, ad moderation inquiries, or platform feedback. 24/7 support via email.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://callgirl4u.com/contact" }
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8 text-gray-900 text-center">Contact &amp; Helpdesk</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto text-center">
        <p className="text-gray-600 mb-8 leading-relaxed">
          Have questions or need assistance with the CallGirl4U platform? Our support and moderation team is available to assist users and advertisers.
        </p>

        <div className="space-y-6 text-left">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">General Inquiries &amp; Support</h3>
            <p className="text-sm text-gray-600 mb-2">For help with listings, account access, or general platform inquiries:</p>
            <a
              href="mailto:worksunil26@gmail.com"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg shadow transition-all text-sm"
            >
              📧 Contact Support Team
            </a>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Content Moderation &amp; Safety</h3>
            <p className="text-sm text-gray-600 mb-1">
              To report suspicious profiles, policy violations, or underage content:
            </p>
            <p className="text-base font-semibold text-gray-800">
              Email: <a href="mailto:worksunil26@gmail.com" className="text-blue-600 hover:underline">worksunil26@gmail.com</a>
            </p>
          </div>

          <div className="pt-4 border-t text-center">
            <p className="text-xs text-gray-500">
              Support operating hours: 24/7. Average email response time: 2–6 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
