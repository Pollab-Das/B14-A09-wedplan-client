"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "X (Twitter)", href: "https://x.com/" },
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!value || !value.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're on the list! Wedding inspiration is on its way.");
    setEmail("");
  };

  return (
    <footer className="bg-[#0a0f1c] border-t border-[#d4af37]/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-heading font-bold text-[#d4af37]">WedPlan</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Discover top-rated wedding venues, photographers, and vendors. We make planning your
              perfect day effortless and unforgettable.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-[#d4af37] transition-colors text-sm"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[#FDFBF7] font-bold mb-4 uppercase tracking-wider text-sm">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-slate-400 hover:text-[#d4af37] text-sm transition-colors">Home</Link></li>
              <li><Link href="/browse-services" className="text-slate-400 hover:text-[#d4af37] text-sm transition-colors">Browse Services</Link></li>
              <li><Link href="/how-it-works" className="text-slate-400 hover:text-[#d4af37] text-sm transition-colors">How It Works</Link></li>
              <li><Link href="/sign-up?role=vendor" className="text-slate-400 hover:text-[#d4af37] text-sm transition-colors">Become a Vendor</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#FDFBF7] font-bold mb-4 uppercase tracking-wider text-sm">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin className="w-5 h-5 text-[#d4af37] shrink-0" />
                <span>123 Wedding Lane,<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-5 h-5 text-[#d4af37] shrink-0" />
                <a href="tel:+8801741735802" className="hover:text-[#d4af37] transition-colors">
                  +88017417-35802
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-5 h-5 text-[#d4af37] shrink-0" />
                <a
                  href="mailto:pollabdasprince@gmail.com"
                  className="hover:text-[#d4af37] transition-colors"
                >
                  pollabdasprince@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#FDFBF7] font-bold mb-4 uppercase tracking-wider text-sm">
              Newsletter
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Get the latest wedding trends and vendor offers directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="bg-[#1e293b] border border-[#d4af37]/20 rounded-lg px-3 py-2 text-sm text-[#FDFBF7] w-full focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                className="bg-[#d4af37] text-[#0f172a] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e6c86e] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {currentYear} WedPlan. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/how-it-works" className="text-slate-500 hover:text-[#d4af37] text-sm transition-colors">
              How It Works
            </Link>
            <Link href="/browse-services" className="text-slate-500 hover:text-[#d4af37] text-sm transition-colors">
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
