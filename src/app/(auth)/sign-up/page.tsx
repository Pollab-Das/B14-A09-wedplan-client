"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, User, Mail, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const router = useRouter();
  const { role: roleParam } = use(searchParams);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [role, setRole] = useState<"customer" | "vendor">(
    roleParam === "vendor" ? "vendor" : "customer"
  );
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.password.length < 6 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password)
    ) {
      toast.error("Password must be at least 6 characters with one uppercase and one lowercase letter.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const { error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: imageUrl || undefined,
        role: role,
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
        return;
      }

      toast.success("Account created successfully!");
      router.push(role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/callback",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign up failed");
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="mb-8 text-center lg:text-left">
        <h1 className="font-heading text-4xl font-bold text-[#FDFBF7] mb-2">Create an Account</h1>
        <p className="text-slate-400">Join WedPlan to start planning your dream wedding.</p>
      </div>

      {/* Google Sign Up বাটন */}
      <Button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={googleLoading}
        className="w-full h-12 mb-6 bg-white hover:bg-gray-100 text-gray-800 font-semibold flex items-center justify-center gap-3"
      >
        {googleLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </>
        )}
      </Button>

      {/* ডিভাইডার */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#0f172a] px-4 text-slate-500">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* রোল সিলেকশন */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`p-4 rounded-xl border text-center transition-all ${
              role === "customer"
                ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                : "border-slate-700 text-slate-400 hover:border-slate-500"
            }`}
          >
            <span className="block font-bold">Customer</span>
            <span className="text-xs opacity-80">I&apos;m planning a wedding</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("vendor")}
            className={`p-4 rounded-xl border text-center transition-all ${
              role === "vendor"
                ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                : "border-slate-700 text-slate-400 hover:border-slate-500"
            }`}
          >
            <span className="block font-bold">Vendor</span>
            <span className="text-xs opacity-80">I provide services</span>
          </button>
        </div>

        {/* প্রোফাইল ইমেজ */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#1e293b] border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-slate-500" />
            )}
          </div>
          <Label htmlFor="image" className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#1e293b] hover:bg-[#1e293b]/80 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
            <Upload className="w-4 h-4" />
            Upload Profile Photo
          </Label>
          <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        {/* নাম */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-300">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <Input
              id="name"
              placeholder="John Doe"
              required
              className="pl-10 bg-[#1e293b] border-slate-700 text-[#FDFBF7] focus-visible:ring-[#d4af37]"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        {/* ইমেইল */}
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* পাসওয়ার্ড */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <Input
              id="password"
              type="password"
              placeholder="Min 6 chars, 1 uppercase, 1 lowercase"
              required
              minLength={6}
              title="At least 6 characters with one uppercase and one lowercase letter"
              className="pl-10 bg-[#1e293b] border-slate-700 text-[#FDFBF7] focus-visible:ring-[#d4af37]"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a] font-bold text-lg">
          {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
        </Button>
      </form>

      <p className="mt-8 text-center text-slate-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[#d4af37] hover:underline font-semibold">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}