"use client";

import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { motion } from "framer-motion";
import { Search, CalendarCheck, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "1. Discover Services",
      description: "Browse our curated list of top-rated wedding vendors. Filter by category, location, and price to find exactly what you need for your special day.",
    },
    {
      icon: CalendarCheck,
      title: "2. Book with Ease",
      description: "Found the perfect vendor? Send a booking request with your event details. Vendors will review and respond to your request promptly.",
    },
    {
      icon: Heart,
      title: "3. Celebrate Your Day",
      description: "Once confirmed, you can relax knowing your wedding plans are in expert hands. Focus on making memories that will last a lifetime.",
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <SiteNavbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* হেডার */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-5xl md:text-6xl font-bold text-[#FDFBF7] mb-6"
            >
              How <span className="text-[#d4af37]">WedPlan</span> Works
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-400"
            >
              Planning your dream wedding should be exciting, not stressful. 
              We've simplified the process into three easy steps.
            </motion.p>
          </div>

          {/* ৩টি স্টেপের গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative">
            {/* ব্যাকগ্রাউন্ড লাইন (শুধু ডেস্কটপে) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative bg-[#1e293b] p-8 rounded-3xl border border-[#d4af37]/10 text-center z-10 hover:border-[#d4af37]/30 transition-colors"
              >
                <div className="w-24 h-24 mx-auto bg-[#0f172a] rounded-full border-4 border-[#0f172a] shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center mb-6 -mt-20 relative z-10">
                  <step.icon className="w-10 h-10 text-[#d4af37]" />
                </div>
                <h3 className="text-2xl font-bold text-[#FDFBF7] mb-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* কল টু অ্যাকশন (CTA) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] rounded-3xl p-12 text-center border border-[#d4af37]/20 relative overflow-hidden"
          >
            {/* গ্লো ইফেক্ট */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37] rounded-full blur-[120px] opacity-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d4af37] rounded-full blur-[120px] opacity-10" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#FDFBF7] mb-6">
                Ready to start planning?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join thousands of happy couples who found their perfect vendors on WedPlan.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/browse-services">
                  <Button className="bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a] font-bold h-12 px-8 rounded-full text-lg">
                    Explore Services <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" className="border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10 h-12 px-8 rounded-full text-lg">
                    Create an Account
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}