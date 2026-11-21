"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({ email });

      if (error) {
        toast.error(error.message || "Failed to send reset link");
        return;
      }

      toast.success("If this email exists in our system, check your inbox for a reset link.");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-bold text-[#FDFBF7] mb-2">Forgot Password?</h1>
          <p className="text-slate-400">Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-700 bg-[#1e293b]/60 p-8"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                className="pl-10 bg-[#1e293b] border-slate-700 text-[#FDFBF7] focus-visible:ring-[#d4af37]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a] font-bold text-lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
          </Button>
        </form>

        <p className="mt-8 text-center text-slate-400">
          <Link href="/sign-in" className="inline-flex items-center gap-2 text-[#d4af37] hover:underline font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
