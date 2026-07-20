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
        <div className="flex flex-wrap gap-4 text-sm text-blue-600 mb-4">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/dmca">DMCA Policy</Link>
          <Link href="/terms">Terms and Conditions</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/forums">Adult Forums</Link>
        </div>

        {/* For Rent Button */}
        <div className="mb-5">
          <a
            href="mailto:worksunil26@gmail.com"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-lg shadow transition-all hover:shadow-md active:scale-95"
          >
            📧 Site For Rent
          </a>
        </div>

        {/* Social */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Follow us:</span>
          <a href="#">Youtube</a>
          <Link href="/blog">Blog</Link>
        </div>

        {/* DMCA Safe Harbor Notice */}
        <div className="mt-4 p-3 bg-gray-200 rounded-lg text-xs text-gray-600 max-w-2xl">
          <span className="font-bold text-gray-800">⚖️ DMCA Safe Harbor:</span> CallGirl4U operates under 17 U.S.C. § 512 Safe Harbor provisions.
          To report copyright infringement, contact our Designated Agent:{" "}
          <a href="mailto:worksunil26@gmail.com" className="text-blue-600 hover:underline font-medium">
            worksunil26@gmail.com
          </a>{" "}
          |{" "}
          <a href="/dmca" className="text-blue-600 hover:underline">DMCA Policy &amp; Counter-Notice</a>
        </div>

        {/* Partner Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Partner Directories
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-blue-600">
            <a href="https://kokasite.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">KokaSite</a>
            <a href="https://kokasite.com/massage/andhra-pradesh/vuyyuru" target="_blank" rel="noopener noreferrer" className="hover:underline">Vuyyuru Massage</a>
            <a href="https://kokasite.com/call-girls/assam/rangia" target="_blank" rel="noopener noreferrer" className="hover:underline">Rangia Call Girls</a>
            <a href="https://kokasite.com/massage/gujarat/narmada" target="_blank" rel="noopener noreferrer" className="hover:underline">Narmada Massage</a>
            <a href="https://kokasite.com/call-girls/uttar-pradesh/deoria" target="_blank" rel="noopener noreferrer" className="hover:underline">Deoria Call Girls</a>
            <a href="https://kokasite.com/call-girls/rajasthan/sojat" target="_blank" rel="noopener noreferrer" className="hover:underline">Sojat Call Girls</a>
            <a href="https://kokasite.com/call-girls/delhi-ncr/vikas-puri" target="_blank" rel="noopener noreferrer" className="hover:underline">Vikas Puri Call Girls</a>
            <a href="https://kokasite.com/massage/jharkhand/giridih" target="_blank" rel="noopener noreferrer" className="hover:underline">Giridih Massage</a>
            <a href="https://kokasite.com/massage/kerala/taliparamba" target="_blank" rel="noopener noreferrer" className="hover:underline">Taliparamba Massage</a>
            <a href="https://kokasite.com/massage/telangana/kompally" target="_blank" rel="noopener noreferrer" className="hover:underline">Kompally Massage</a>
            <a href="https://kokasite.com/call-girls/punjab/muktsar" target="_blank" rel="noopener noreferrer" className="hover:underline">Muktsar Call Girls</a>
            <a href="https://kokasite.com/call-girls/delhi-ncr/preet-vihar" target="_blank" rel="noopener noreferrer" className="hover:underline">Preet Vihar Call Girls</a>
            <a href="https://kokasite.com/call-girls/bihar/darbhanga" target="_blank" rel="noopener noreferrer" className="hover:underline">Darbhanga Call Girls</a>
            <a href="https://kokasite.com/call-girls/uttar-pradesh" target="_blank" rel="noopener noreferrer" className="hover:underline">Uttar Pradesh Call Girls</a>
            <a href="https://kokasite.com/massage/delhi-ncr/moti-bagh" target="_blank" rel="noopener noreferrer" className="hover:underline">Moti Bagh Massage</a>
            <a href="https://kokasite.com/call-girls/uttar-pradesh/ujhani" target="_blank" rel="noopener noreferrer" className="hover:underline">Ujhani Call Girls</a>
            <a href="https://kokasite.com/call-girls/andhra-pradesh/patparganj" target="_blank" rel="noopener noreferrer" className="hover:underline">Patparganj Call Girls</a>
            <a href="https://kokasite.com/call-girls/delhi-ncr/uttam-nagar" target="_blank" rel="noopener noreferrer" className="hover:underline">Uttam Nagar Call Girls</a>
            <a href="https://kokasite.com/call-girls/uttar-pradesh/saharanpur" target="_blank" rel="noopener noreferrer" className="hover:underline">Saharanpur Call Girls</a>
            <a href="https://kokasite.com/call-girls/madhya-pradesh/katni" target="_blank" rel="noopener noreferrer" className="hover:underline">Katni Call Girls</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
