"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/upload";
import { useSession } from "@/lib/auth-client";
import { Service } from "@/lib/types";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  });

  // ইমেজ আপলোড (ImgBB)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadImageToImgBB(file);
      setImages((prev) => [...prev, url]);
      toast.success("Image uploaded");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // ইমেজ রিমুভ
  const removeImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  // ফর্ম সাবমিট
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (session?.user?.subscriptionPlan !== "premium") {
        const existing = await fetchWithAuth("/services/vendor");
        const activeCount = Array.isArray(existing)
          ? (existing as Service[]).filter((service) => service.isActive).length
          : 0;

        if (activeCount >= 3) {
          toast.error("Free plan allows up to 3 active services. Upgrade to Premium to add more.");
          router.push("/dashboard/vendor/subscription");
          return;
        }
      }

      await fetchWithAuth("/services", {
        method: "POST",
        body: JSON.stringify({ ...formData, price: Number(formData.price), images, status: "pending" }),
      });

      toast.success("Service added successfully! Awaiting admin approval.");
      router.push("/dashboard/vendor/services");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#FDFBF7]">Add New Service</h1>
        <p className="text-slate-400 mt-1">Fill in the details to publish a new service.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#1e293b] p-8 rounded-2xl border border-[#d4af37]/10">
        
        {/* সার্ভিসের নাম */}
        <div className="space-y-2">
          <Label className="text-slate-300">Service Name</Label>
          <Input required placeholder="e.g. Premium Wedding Photography" className="bg-[#0f172a] border-[#d4af37]/20 text-[#FDFBF7] focus-visible:ring-[#d4af37]" value={formData.serviceName} onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })} />
        </div>

        {/* ক্যাটাগরি */}
        <div className="space-y-2">
          <Label className="text-slate-300">Category</Label>
          <select required className="w-full h-10 rounded-md border border-[#d4af37]/20 bg-[#0f172a] px-3 text-sm text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#d4af37]" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* প্রাইস এবং লোকেশন */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Price ($)</Label>
            <Input required type="number" min="1" placeholder="500" className="bg-[#0f172a] border-[#d4af37]/20 text-[#FDFBF7] focus-visible:ring-[#d4af37]" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Location</Label>
            <Input required placeholder="New York, NY" className="bg-[#0f172a] border-[#d4af37]/20 text-[#FDFBF7] focus-visible:ring-[#d4af37]" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>
        </div>

        {/* ডেসক্রিপশন */}
        <div className="space-y-2">
          <Label className="text-slate-300">Description</Label>
          <textarea required rows={5} className="w-full rounded-md border border-[#d4af37]/20 bg-[#0f172a] p-3 text-sm text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#d4af37]" placeholder="Describe your service in detail..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>

        {/* ইমেজ আপলোড */}
        <div className="space-y-4">
          <Label className="text-slate-300">Service Images</Label>
          <p className="text-xs text-slate-500">JPG, PNG, WEBP or GIF only, up to 5MB each.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#d4af37]/20">
                <img src={url} alt="Service" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(url)} className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {/* আপলোড বাটন */}
            <label className="aspect-square rounded-xl border-2 border-dashed border-[#d4af37]/30 hover:border-[#d4af37] bg-[#0f172a] flex flex-col items-center justify-center cursor-pointer transition-colors">
              {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" /> : (
                <>
                  <Upload className="w-6 h-6 text-[#d4af37] mb-2" />
                  <span className="text-xs text-slate-400">Upload</span>
                </>
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
        </div>

        <Button type="submit" disabled={loading || uploadingImage} className="w-full h-12 bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a] font-bold text-lg">
          {loading ? <Loader2 className="animate-spin" /> : "Publish Service"}
        </Button>
      </form>
    </motion.div>
  );
}