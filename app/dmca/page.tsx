import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Copyright Policy & Takedown | CallGirl4U India",
  description: "DMCA Policy, Safe Harbor Notice, Counter-Notice procedure and Designated Copyright Agent for CallGirl4U. Report copyright infringement or request content removal.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://callgirl4u.com/dmca" }
};

export default function DMCAPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-10">
        <h1 className="text-3xl font-black mb-3 text-gray-900">DMCA Copyright Policy</h1>
        <p className="text-gray-600 text-sm">
          CallGirl4U.com operates as a <strong>user-generated content hosting platform</strong> and
          classifieds directory. We qualify for the DMCA Safe Harbor provisions under{" "}
          <strong>17 U.S.C. § 512(c)</strong> as a service provider. We take copyright infringement
          seriously and respond promptly to valid takedown requests.
        </p>
      </div>

      {/* Safe Harbor Notice */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">⚖️ Safe Harbor Statement</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          CallGirl4U.com is a hosting intermediary that stores user-submitted content. We do not
          create, edit, or control the listings published on this platform. In accordance with the
          Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512, we have implemented a
          takedown policy and designated a Copyright Agent to receive infringement notices.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed">
          Upon receiving a valid DMCA notice, we will expeditiously remove or disable access to the
          claimed infringing material. We also maintain a repeat-infringer policy.
        </p>
      </section>

      {/* Designated Agent */}
      <section className="mb-10 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📬 Designated Copyright Agent</h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Service:</strong> CallGirl4U India</p>
          <p><strong>Website:</strong> https://callgirl4u.com</p>
          <p><strong>Email:</strong> <a href="mailto:worksunil26@gmail.com" className="text-blue-600 hover:underline">worksunil26@gmail.com</a></p>
          <p className="mt-3 text-xs text-gray-500">
            Please use the subject line: <em>DMCA Takedown Request – [URL of infringing content]</em>
          </p>
        </div>
      </section>

      {/* Filing a Notice */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">📝 How to File a DMCA Takedown Notice</h2>
        <p className="text-gray-700 text-sm mb-4">
          To submit a valid DMCA notice under 17 U.S.C. § 512(c)(3), your written notice must include:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-700">
          <li>A physical or electronic signature of the person authorized to act on behalf of the copyright owner.</li>
          <li>Identification of the copyrighted work claimed to have been infringed (or, if multiple works, a representative list).</li>
          <li>Identification of the material claimed to be infringing with sufficient detail to locate it on our platform (exact URL preferred).</li>
          <li>Your contact information: name, address, telephone number, and email address.</li>
          <li>A statement that you have a <strong>good faith belief</strong> that the use of the material is not authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement that the information in the notification is accurate, and <strong>under penalty of perjury</strong>, that you are authorized to act on behalf of the copyright owner.</li>
        </ol>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          ⚠️ <strong>Warning:</strong> Filing a false DMCA claim may expose you to liability under 17 U.S.C. § 512(f) for damages, attorney fees, and other costs.
        </div>
      </section>

      {/* Counter Notice */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">↩️ Counter-Notice Procedure</h2>
        <p className="text-gray-700 text-sm mb-4">
          If you believe your content was removed due to a mistake or misidentification, you may file a
          Counter-Notice under 17 U.S.C. § 512(g)(3). Your counter-notice must include:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-sm text-gray-700">
          <li>Your physical or electronic signature.</li>
          <li>Identification of the material that was removed and the location where it appeared before removal.</li>
          <li>A statement under penalty of perjury that you have a good faith belief the material was removed as a result of mistake or misidentification.</li>
          <li>Your name, address, and telephone number.</li>
          <li>A statement consenting to jurisdiction of the federal district court in your district.</li>
        </ol>
        <p className="text-sm text-gray-600 mt-4">
          Send counter-notices to: <a href="mailto:worksunil26@gmail.com" className="text-blue-600 hover:underline">worksunil26@gmail.com</a>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Upon receiving a valid counter-notice, we will restore the removed content within 10–14 business
          days unless the original complainant files a court action.
        </p>
      </section>

      {/* Repeat Infringer Policy */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">🔁 Repeat Infringer Policy</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          In appropriate circumstances, CallGirl4U will terminate the accounts of users who are repeat
          copyright infringers. We track takedown requests and reserve the right to disable accounts
          associated with repeated infringement.
        </p>
      </section>

      {/* Contact */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-sm text-blue-900">
        <strong>Contact for DMCA matters only:</strong>{" "}
        <a href="mailto:worksunil26@gmail.com" className="underline font-bold">
          worksunil26@gmail.com
        </a>
        <br />
        <span className="text-xs text-blue-600 mt-1 block">
          Last updated: July 2026 | Policy version 2.0
        </span>
      </div>
    </div>
  );
}
