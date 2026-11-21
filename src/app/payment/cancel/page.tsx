"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1e293b] p-12 rounded-3xl border border-red-500/30 text-center max-w-md w-full"
      >
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-heading font-bold text-[#FDFBF7] mb-4">Payment Cancelled</h1>
        <p className="text-slate-400 mb-8">
          Your payment was cancelled. You can try again anytime from your subscription page.
        </p>
        
        <Link href="/dashboard/vendor/subscription">
          <Button variant="outline" className="w-full h-12 border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10">
            Back to Subscription
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}