import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | CallGirl4U",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-gray">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Terms and Conditions</h1>
      <p>By accessing CallGirl4U, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</p>

      <h2 className="text-xl font-bold mt-8">1. Acceptance of Terms</h2>
      <p>Your use of our website constitutes your agreement to all such terms, conditions, and notices. You must be at least 18 years of age to use this site.</p>

      <h2 className="text-xl font-bold mt-8">2. Content Responsibility</h2>
      <p>Users are solely responsible for the content they post. CallGirl4U does not endorse and is not responsible for any user-generated content.</p>

      <h2 className="text-xl font-bold mt-8">3. Prohibited Conduct</h2>
      <p>You may not use our site for any illegal purposes or to post fraudulent, deceptive, or offensive material. We reserve the right to remove any content at our discretion.</p>

      <h2 className="text-xl font-bold mt-8">4. Liability Limitation</h2>
      <p>CallGirl4U is provided "as is" without any warranties. We shall not be liable for any damages arising out of your use of our website.</p>

      <h2 className="text-xl font-bold mt-8">5. Governing Law</h2>
      <p>These terms shall be governed by and construed in accordance with the laws of India.</p>
    </div>
  );
}
