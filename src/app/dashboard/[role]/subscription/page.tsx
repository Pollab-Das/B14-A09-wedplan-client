"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/api";
import { toast } from "sonner";
import { Check, Loader2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const isPremium = session?.user?.subscriptionPlan === "premium";

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { url } = await fetchWithAuth("/payments/create-checkout-session", {
        method: "POST",
      });
      
      // Stripe Checkout পেজে রিডাইরেক্ট
      if (url) {
        window.location.href = url;
        return;
      }

      throw new Error("Checkout URL was not returned. Please try again.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment could not be started");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-[#FDFBF7] mb-2">Subscription Plans</h1>
        <p className="text-slate-400">Choose the plan that fits your business needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        
        {/* Free Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 relative"
        >
          <h2 className="text-2xl font-bold text-[#FDFBF7] mb-2">Free Plan</h2>
          <p className="text-slate-400 mb-6">Perfect for getting started.</p>
          <div className="text-4xl font-bold text-[#FDFBF7] mb-8">$0<span className="text-lg text-slate-400 font-normal">/month</span></div>
          
          <ul className="space-y-4 mb-8">
            {["Maximum 3 Active Services", "Basic Vendor Dashboard", "Booking Request Management"].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <Check className="w-5 h-5 text-slate-500" /> {feature}
              </li>
            ))}
          </ul>
          
          <Button disabled className="w-full bg-slate-700 text-slate-400">
            {isPremium ? "Downgrade (Contact Support)" : "Current Plan"}
          </Button>
        </motion.div>

        {/* Premium Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-b from-[#d4af37]/10 to-[#1e293b] p-8 rounded-2xl border-2 border-[#d4af37] relative overflow-hidden"
        >
          {/* Popular Badge */}
          <div className="absolute top-4 right-4 bg-[#d4af37] text-[#0f172a] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3" /> PREMIUM
          </div>

          <h2 className="text-2xl font-bold text-[#FDFBF7] mb-2">Premium Plan</h2>
          <p className="text-slate-400 mb-6">For serious wedding professionals.</p>
          <div className="text-4xl font-bold text-[#d4af37] mb-8">$5<span className="text-lg text-slate-400 font-normal">/month</span></div>
          
          <ul className="space-y-4 mb-8">
            {["Unlimited Active Services", "Premium Vendor Badge", "All Free Plan Features"].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-[#FDFBF7]">
                <Check className="w-5 h-5 text-[#d4af37]" /> {feature}
              </li>
            ))}
          </ul>
          
          <Button 
            onClick={handleUpgrade}
            disabled={loading || isPremium}
            className="w-full bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a] font-bold h-12"
          >
            {loading ? <Loader2 className="animate-spin" /> : isPremium ? "Active Subscription" : "Upgrade to Premium"}
          </Button>
        </motion.div>

      </div>
    </div>
  );
}