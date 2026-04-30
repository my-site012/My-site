import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* About Text */}
        <div className="text-sm text-gray-600 mb-6 max-w-3xl">
          <h3 className="font-bold text-gray-800 mb-2">
            Welcome to CallGirl4U – Your Verified brand for Adult Classified Ads in India.
          </h3>
          <p>
            CallGirl4U welcomes you to browse verified adult classified ads from across India.
            Find call girls, escort services, massage, and more in your city.
            Post your ad and connect with clients looking for adult services.
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

        {/* Social */}
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Follow us:</span>
          <a href="#">Youtube</a>
          <a href="#">Blog</a>
        </div>

        {/* Badges */}
        <div className="mt-4 flex gap-4 items-center">
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">DMCA PROTECTED</span>
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">RTA APPROVED</span>
        </div>
      </div>
    </footer>
  );
}
