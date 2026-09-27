import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* About Text */}
        <div className="text-sm text-gray-600 mb-6 max-w-3xl">
          <h3 className="font-bold text-gray-800 mb-2">
            Welcome to CallGirl4U – Independent Adult Classifieds Directory in India.
          </h3>
          <p>
            CallGirl4U is a hosting platform and classifieds directory for independent consenting adult advertisers. We do not provide companionship services directly and are not an agency. All listings are generated and managed by independent advertisers. We maintain a strict zero-tolerance policy against coercion, exploitation, and any illegal services.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 text-sm text-blue-700 mb-4">
          <Link prefetch={false} href="/privacy">Privacy Policy</Link>
          <Link prefetch={false} href="/dmca">DMCA Policy</Link>
          <Link prefetch={false} href="/terms">Terms and Conditions</Link>
          <Link prefetch={false} href="/contact">Contact Us</Link>
          <Link prefetch={false} href="/forums">Adult Forums</Link>
        </div>

        {/* Contact / Inquiries Button */}
        <div className="mb-5">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-lg shadow transition-all hover:shadow-md active:scale-95"
          >
            📧 Support &amp; Inquiries
          </Link>
        </div>

        {/* Social & Copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-600 mb-5 pb-4 border-b border-gray-200">
          <div className="flex gap-4 items-center">
            <span>Follow us:</span>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Youtube</a>
          </div>
          <div className="text-xs text-gray-500">
            <p>© {new Date().getFullYear()} <strong className="text-gray-700 font-semibold">CallGirl4U.com</strong>. All Rights Reserved.</p>
          </div>
        </div>

        {/* DMCA Safe Harbor Notice */}
        <div className="mt-4 p-3 bg-gray-200 rounded-lg text-xs text-gray-600 max-w-2xl">
          <span className="font-bold text-gray-800">⚖️ DMCA Safe Harbor:</span> CallGirl4U operates under 17 U.S.C. § 512 Safe Harbor provisions.
          To report copyright infringement, contact our Designated Agent:{" "}
          <a href="mailto:worksunil26@gmail.com" className="text-blue-700 hover:underline font-medium">
            worksunil26@gmail.com
          </a>{" "}
          |{" "}
          <a href="/dmca" className="text-blue-700 hover:underline">DMCA Policy &amp; Counter-Notice</a>
        </div>

      </div>
    </footer>
  );
}
