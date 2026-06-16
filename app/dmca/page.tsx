import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Policy | CallGirl4U",
  robots: { index: false, follow: true },
};

export default function DMCAPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 prose prose-gray">
      <h1 className="text-3xl font-black mb-8 text-gray-900">DMCA Policy</h1>
      <p>CallGirl4U respects the intellectual property rights of others. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please follow our DMCA notice procedure.</p>

      <h2 className="text-xl font-bold mt-8">Notice of Infringement</h2>
      <p>To file a notice, please provide our Copyright Agent with the following information:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>A physical or electronic signature of the copyright owner or their authorized agent.</li>
        <li>Identification of the copyrighted work claimed to have been infringed.</li>
        <li>Identification of the material that is claimed to be infringing and where it is located on our site.</li>
        <li>Your contact information (address, phone number, and email).</li>
        <li>A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner.</li>
        <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner.</li>
      </ul>

      <p className="mt-8">Send notices to: <strong>dmca@escortservicegbroad.com</strong></p>
    </div>
  );
}
