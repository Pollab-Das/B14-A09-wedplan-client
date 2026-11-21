import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ArrowLeft, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found | WedPlan",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-15 bg-cover bg-center"
        style={{ backgroundImage: "url('/wedding-hero.svg')" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-xl text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 flex items-center justify-center">
          <Heart className="w-10 h-10 text-[#d4af37]" />
        </div>
        <p className="text-[#d4af37] text-sm font-bold tracking-[0.3em] uppercase mb-4">404</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#FDFBF7] mb-4">
          This page walked down the wrong aisle
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you are looking for does not exist or has moved. Let&apos;s get you back to
          planning your big day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#d4af37] text-[#0f172a] px-8 py-3 rounded-full font-semibold hover:bg-[#e6c86e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            href="/browse-services"
            className="inline-flex items-center justify-center gap-2 border border-[#d4af37]/50 text-[#d4af37] px-8 py-3 rounded-full font-semibold hover:bg-[#d4af37]/10 transition-colors"
          >
            <Search className="w-4 h-4" /> Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}
