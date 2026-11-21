"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { uploadImageToImgBB } from "@/lib/upload";
import { toast } from "sonner";
import { Upload, X, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const CATEGORIES = ["Photography & Videography", "Wedding Venues", "Decoration & Florist", "Catering Services", "Makeup & Styling", "Wedding Fashion"];

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({ serviceName: "", category: "", description: "", price: "", location: "" });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await fetchWithAuth(`/services/${id}`);
        setFormData({ serviceName: data.serviceName, category: data.category, description: data.description, price: data.price.toString(), location: data.location });
        setImages(data.images || []);
      } catch (error: any) { toast.error(error.message); router.push("/dashboard/vendor/services"); } 
      finally { setLoading(false); }
    };
    fetchService();
  }, [id, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImageToImgBB(file);
      setImages((prev) => [...prev, url]);
    } catch (error: any) { toast.error(error.message); } 
    finally { setUploadingImage(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchWithAuth(`/services/${id}`, { method: "PATCH", body: JSON.stringify({ ...formData, price: Number(formData.price), images }) });
      toast.success("Service updated successfully!");
      router.push("/dashboard/vendor/services");
    } catch (error: any) { toast.error(error.message); } 
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard/vendor/services" className="flex items-center text-slate-400 hover:text-foreground mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Back to My Services</Link>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Edit Service</h1>
      
      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border border-border space-y-6">
        <div className="space-y-2">
          <Label>Service Name</Label>
          <Input required value={formData.serviceName} onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })} className="bg-background border-border text-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:border-[#d4af37]">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Price ($)</Label>
            <Input required type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="bg-background border-border text-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="bg-background border-border text-foreground" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <textarea required rows={5} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-md border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:border-[#d4af37]" />
        </div>
        <div className="space-y-4">
          <Label>Service Images</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                <img src={url} alt="Service" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"><X className="w-3 h-3" /></button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-[#d4af37] bg-background flex flex-col items-center justify-center cursor-pointer">
              {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" /> : <><Upload className="w-6 h-6 text-[#d4af37] mb-2" /><span className="text-xs text-slate-500">Upload</span></>}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
        </div>
        <Button type="submit" disabled={saving || uploadingImage} className="w-full h-12 bg-[#d4af37] text-[#0f172a] font-bold">
          {saving ? <Loader2 className="animate-spin" /> : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}