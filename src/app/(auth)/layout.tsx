"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-[#0f172a]">
      {/* বাম দিকের ইমেজ ও অ্যানিমেশন (শুধু ডেস্কটপে দেখাবে) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#1e293b]">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop" 
            alt="Wedding Background" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="relative z-20 flex flex-col justify-end p-16">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-heading text-5xl font-bold text-[#FDFBF7] mb-4"
          >
            Plan your perfect day.
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-slate-300 text-lg max-w-md"
          >
            Join thousands of couples and vendors creating magical weddings together on WedPlan.
          </motion.p>
        </div>
      </div>

      {/* ডান দিকের ফর্ম এরিয়া */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        {/* মোবাইলের জন্য লোগো */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="text-2xl font-heading font-bold text-[#d4af37]">
            WedPlan
          </Link>
        </div>
        
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}