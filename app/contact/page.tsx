import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | CallGirl4U Support",
  description: "Get in touch with CallGirl4U support for assistance, ad inquiries, or platform feedback. 24/7 customer support via email.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://callgirl4u.com/contact" }
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8 text-gray-900 text-center">Contact Us</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto text-center">
        <p className="text-gray-600 mb-8">
          Have questions or need assistance with CallGirl4U? Our support team is here to help. 
          Please reach out to us via email and we will get back to you as soon as possible.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Site For Rent</h3>
            <a
              href="mailto:worksunil26@gmail.com"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg active:scale-95"
            >
              📧 For Rent — Contact Us
            </a>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Business Inquiries</h3>
            <p className="text-lg font-semibold text-gray-800">worksunil26@gmail.com</p>
          </div>

          <div className="pt-8 border-t">
            <p className="text-sm text-gray-500 italic">
              Available 24/7 for your protection and assistance. 
              Average response time: 2-4 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
