"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, Clock3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

type VerificationState = "verifying" | "premium" | "pending" | "unverified";

function VerifyingFallback() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] p-12 rounded-3xl border border-[#d4af37]/30 text-center max-w-md w-full">
        <Loader2 className="w-16 h-16 text-[#d4af37] mx-auto mb-6 animate-spin" />
        <h1 className="text-2xl font-heading font-bold text-[#FDFBF7]">Verifying your payment…</h1>
      </div>
    </div>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? searchParams.get("sessionId");
  const [state, setState] = useState<VerificationState>("verifying");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      setState("verifying");

      if (!sessionId) {
        setState("unverified");
        return;
      }

      try {
        const { data } = await authClient.getSession();
        if (cancelled) return;
        setState(data?.user?.subscriptionPlan === "premium" ? "premium" : "pending");
      } catch {
        if (!cancelled) setState("pending");
      }
    };

    verify();
    return () => { cancelled = true; };
  }, [sessionId, attempt]);

  const display = {
    verifying: {
      icon: <Loader2 className="w-20 h-20 text-[#d4af37] mx-auto mb-6 relative z-10 animate-spin" />,
      title: "Verifying your payment…",
      message: "Please wait while we confirm your subscription with our servers.",
    },
    premium: {
      icon: <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 relative z-10" />,
      title: "Payment Successful!",
      message: "Premium is active on your account. You now have unlimited service listings.",
    },
    pending: {
      icon: <Clock3 className="w-20 h-20 text-[#d4af37] mx-auto mb-6 relative z-10" />,
      title: "Payment received — verification pending",
      message: "Premium is not active yet. We are confirming the payment with our servers; please check again shortly.",
    },
    unverified: {
      icon: <AlertCircle className="w-20 h-20 text-[#d4af37] mx-auto mb-6 relative z-10" />,
      title: "Verification required",
      message: "We couldn't find a payment session to verify. If you completed a payment, please check your subscription status.",
    },
  }[state];

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1e293b] p-12 rounded-3xl border border-[#d4af37]/30 text-center max-w-md w-full relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37] rounded-full blur-[120px] opacity-20" />
        
        {display.icon}
        <h1 className="text-3xl font-heading font-bold text-[#FDFBF7] mb-4 relative z-10">{display.title}</h1>
        <p className="text-slate-400 mb-8 relative z-10">{display.message}</p>
        
        {(state === "pending" || state === "unverified") && (
          <Button
            variant="outline"
            onClick={() => setAttempt((value) => value + 1)}
            className="w-full h-12 mb-3 border-[#d4af37]/30 text-[#d4af37] font-bold relative z-10"
          >
            Check again
          </Button>
        )}

        <Link href="/dashboard/vendor">
          <Button className="w-full h-12 bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a] font-bold relative z-10">
            Go to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<VerifyingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
