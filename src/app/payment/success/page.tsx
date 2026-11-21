"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1e293b] p-12 rounded-3xl border border-[#d4af37]/30 text-center max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37] rounded-full blur-[120px] opacity-20" />
        
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 relative z-10" />
        <h1 className="text-3xl font-heading font-bold text-[#FDFBF7] mb-4 relative z-10">Payment Successful!</h1>
        <p className="text-slate-400 mb-8 relative z-10">
          Thank you for upgrading to Premium. Your account has been updated and you now have unlimited service listings.
        </p>
        
        <Link href="/dashboard/vendor">
          <Button className="w-full h-12 bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a] font-bold relative z-10">
            Go to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}