"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client"; // 🔥 authClient ইমপোর্ট করা হলো
import { uploadImageToImgBB } from "@/lib/upload";
import { toast } from "sonner";
import { Upload, User, Mail, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function ProfileSettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter(); // 🔥 UI রিফ্রেশের জন্য
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  // সেশন থেকে ইনিশিয়াল ডাটা লোড
  useEffect(() => {
    if (session?.user) {
      setFormData({ name: session.user.name });
      setImagePreview(session.user.image || null);
    }
  }, [session]);

  // ইমেজ আপলোড হ্যান্ডলার
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);

    try {
      const url = await uploadImageToImgBB(file);
      
      // 🔥 Better Auth-এর নিজস্ব মেথড দিয়ে আপডেট
      const { error } = await authClient.updateUser({ image: url });
      if (error) throw new Error(error.message);

      toast.success("Profile image updated!");
      setImagePreview(url);
      router.refresh(); // UI রিফ্রেশ
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      setImagePreview(session?.user.image || null); // এরর হলে আগের ছবিতে ফিরে যাবে
    } finally {
      setUploadingImage(false);
    }
  };

  // টেক্সট ফিল্ড আপডেট
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 Better Auth-এর নিজস্ব মেথড দিয়ে আপডেট
      const { error } = await authClient.updateUser({ name: formData.name });
      if (error) throw new Error(error.message);

      toast.success("Profile updated successfully!");
      router.refresh(); // UI রিফ্রেশ
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;
  }

  if (!session?.user) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#FDFBF7]">Profile Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account information.</p>
      </div>

      <div className="bg-[#1e293b] p-8 rounded-2xl border border-[#d4af37]/10 space-y-8">
        
        {/* প্রোফাইল ইমেজ সেকশন */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-700/50">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-[#d4af37]/30 overflow-hidden bg-[#0f172a] flex items-center justify-center">
              {uploadingImage ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
              ) : imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-500" />
              )}
            </div>
            {/* আপলোড বাটন ওভারলে */}
            <label className="absolute bottom-0 right-0 p-1.5 bg-[#d4af37] rounded-full cursor-pointer hover:bg-[#e6c86e] transition-colors shadow-lg">
              <Upload className="w-4 h-4 text-[#0f172a]" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploadingImage} />
            </label>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-[#FDFBF7]">{session.user.name}</h3>
            <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
              <Mail className="w-3.5 h-3.5" /> {session.user.email}
            </p>
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold uppercase border border-[#d4af37]/20">
              <Shield className="w-3 h-3" /> {session.user.role}
            </div>
          </div>
        </div>

        {/* ইনফো আপডেট ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#0f172a] border-[#d4af37]/20 text-[#FDFBF7] focus-visible:ring-[#d4af37] h-12"
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Email (Cannot be changed)</Label>
            <Input
              value={session.user.email}
              disabled
              className="bg-[#0f172a]/50 border-slate-700 text-slate-500 h-12 cursor-not-allowed"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full sm:w-auto px-8 h-12 bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a] font-bold"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>

      </div>
    </motion.div>
  );
}