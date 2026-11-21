import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react"; // 🔥 ব্র্যান্ড আইকন বাদ দেওয়া হলো

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0f1c] border-t border-[#d4af37]/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* ব্র্যান্ড ও ডেসক্রিপশন */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-heading font-bold text-[#d4af37]">
                VowVista
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Discover top-rated wedding venues, photographers, and vendors. 
              We make planning your perfect day effortless and unforgettable.
            </p>
            {/* সোশ্যাল লিংক (টেক্সট আকারে) */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                Facebook
              </a>
              <a href="#" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                Instagram
              </a>
              <a href="#" className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm">
                Twitter
              </a>
            </div>
          </div>

          {/* কুইক লিংক */}
          <div>
            <h3 className="text-[#FDFBF7] font-bold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-400 hover:text-[#d4af37] text-sm transition-colors">Home</Link></li>
              <li><Link href="/browse-services" className="text-slate-400 hover:text-[#d4af37] text-sm transition-colors">Browse Services</Link></li>
              <li><Link href="/how-it-works" className="text-slate-400 hover:text-[#d4af37] text-sm transition-colors">How It Works</Link></li>
              <li><Link href="/sign-up" className="text-slate-400 hover:text-[#d4af37] text-sm transition-colors">Become a Vendor</Link></li>
            </ul>
          </div>

          {/* কন্টাক্ট ইনফো */}
          <div>
            <h3 className="text-[#FDFBF7] font-bold mb-4 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 text-[#d4af37] shrink-0" />
                <span>123 Wedding Lane,<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-5 h-5 text-[#d4af37] shrink-0" />
                <span>+88017417-35802</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-5 h-5 text-[#d4af37] shrink-0" />
                <span>pollabdasprince@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* নিউজলেটার */}
          <div>
            <h3 className="text-[#FDFBF7] font-bold mb-4 uppercase tracking-wider text-sm">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">
              Get the latest wedding trends and vendor offers directly to your inbox.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-[#1e293b] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-[#FDFBF7] w-full focus:outline-none focus:border-[#d4af37]"
              />
              <button type="submit" className="bg-[#d4af37] text-[#0f172a] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e6c86e] transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* কপিরাইট */}
        <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} VowVista. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-slate-500 hover:text-[#d4af37] text-sm transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-slate-500 hover:text-[#d4af37] text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}