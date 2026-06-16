import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | CallGirl4U",
  robots: { index: false, follow: true },
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
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Email Support</h3>
            <p className="text-2xl font-bold text-red-600">support@escortservicegbroad.com</p>
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
