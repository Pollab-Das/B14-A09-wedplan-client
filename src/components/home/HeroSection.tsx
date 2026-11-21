"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* 🌟 স্মুথ ডাইনামিক ব্যাকগ্রাউন্ড */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#0f172a]/95 to-[#0f172a] z-10" />
        
        {/* মাখনের মতো স্মুথ ব্রিদিং গ্লো (স্ক্রল ল্যাগ নেই) */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37] rounded-full blur-[200px] z-0" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
        {/* কন্টেন্ট আগের মতোই থাকবে */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block py-1 px-3 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] text-sm font-semibold tracking-wider mb-6">
            Your Perfect Wedding Starts Here
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          Create Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#e6c86e]">
            Dream Wedding
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-slate-muted text-lg md:text-xl max-w-2xl mx-auto mb-10"
        >
          Discover top-rated venues, photographers, caterers, and more. Plan your perfect day with
          ease on VowVista.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/browse-services"
            className="bg-[#d4af37] text-[#0f172a] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#e6c86e] transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            Explore Wedding Services
          </Link>
          <Link
            href="/sign-up?role=vendor"
            className="bg-transparent border border-[#d4af37]/50 text-[#d4af37] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#d4af37]/10 transition-all hover:scale-105"
          >
            Join as Vendor
          </Link>
        </motion.div>
      </div>
    </section>
  );
}