import { getPublicServices } from "@/lib/api";
import { notFound } from "next/navigation";
import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { MapPin, Tag, CheckCircle } from "lucide-react";
import { BookingForm } from "@/components/services/BookingForm";

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // API থেকে ডাটা আনছি
  const services = await getPublicServices();
  const service = services.find((s: any) => s._id === id);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <SiteNavbar />
      
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* বাম দিকের কন্টেন্ট (ইমেজ ও ডেসক্রিপশন) */}
          <div className="lg:col-span-2 space-y-8">
            {/* ইমেজ গ্যালারি */}
            <div className="rounded-2xl overflow-hidden border border-[#d4af37]/20 bg-[#1e293b]">
              <img
                src={service.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"}
                alt={service.serviceName}
                className="w-full h-[400px] object-cover"
              />
            </div>

            {/* সার্ভিস ইনফো */}
            <div className="bg-[#1e293b] p-8 rounded-2xl border border-[#d4af37]/10">
              <div className="flex items-center gap-2 text-sm text-[#d4af37] uppercase font-bold tracking-wider mb-2">
                <Tag className="w-4 h-4" /> {service.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#FDFBF7] mb-4">
                {service.serviceName}
              </h1>
              <div className="flex items-center gap-4 text-slate-400 mb-8 pb-8 border-b border-slate-700/50">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {service.location}</span>
                <span className="flex items-center gap-1 text-[#d4af37]"><CheckCircle className="w-4 h-4" /> Verified Vendor</span>
              </div>
              
              <h2 className="text-xl font-bold text-[#FDFBF7] mb-4">Description</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>
          </div>

          {/* ডান দিকের কন্টেন্ট (বুকিং ফর্ম) */}
          <div className="lg:col-span-1">
            <BookingForm service={service} />
          </div>

        </div>
      </main>
    </div>
  );
}