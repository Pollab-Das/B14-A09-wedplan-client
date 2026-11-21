"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Tag } from "lucide-react";

export function ServiceCard({ service }: { service: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-[#1e293b]/40 border border-[#d4af37]/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/40 transition-colors flex flex-col"
    >
      {/* ইমেজ */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={service.images?.[0] || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"}
          alt={service.serviceName}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-[#0f172a]/80 backdrop-blur-md px-3 py-1 rounded-full text-[#d4af37] text-sm font-bold border border-[#d4af37]/30">
          ${service.price}
        </div>
      </div>

      {/* কন্টেন্ট */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-[#d4af37] mb-2 font-medium tracking-wide uppercase">
          <Tag className="w-3 h-3" />
          {service.category}
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-1 text-[#FDFBF7]">{service.serviceName}</h3>
        <div className="flex items-center gap-1 text-sm text-slate-400 mb-6">
          <MapPin className="w-4 h-4" />
          {service.location}
        </div>

        <div className="mt-auto">
          <Link
            href={`/services/${service._id}`}
            className="block w-full text-center py-3 rounded-xl border border-[#d4af37]/30 text-[#d4af37] font-medium hover:bg-[#d4af37] hover:text-[#0f172a] transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}