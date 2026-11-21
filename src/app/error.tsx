"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Heart, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/wedding-hero.svg')" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-xl text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 flex items-center justify-center">
          <Heart className="w-10 h-10 text-[#d4af37]" />
        </div>
        <p className="text-[#d4af37] text-sm font-bold tracking-[0.3em] uppercase mb-4">Oops</p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#FDFBF7] mb-4">
          Something went wrong
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          We could not load this part of your planning journey. Please try again, or head back to
          the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={retry}
            className="inline-flex items-center justify-center gap-2 bg-[#d4af37] text-[#0f172a] px-8 py-3 rounded-full font-semibold hover:bg-[#e6c86e] transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-[#d4af37]/50 text-[#d4af37] px-8 py-3 rounded-full font-semibold hover:bg-[#d4af37]/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
