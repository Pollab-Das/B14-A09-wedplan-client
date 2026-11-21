"use client";

import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Tag } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export type ServiceSummary = {
  _id?: string;
  serviceName?: string;
  category?: string;
  location?: string;
  price?: number | string | null;
  images?: unknown;
  [key: string]: unknown;
};

export function ServiceCard({ service }: { service: ServiceSummary }) {
  const router = useRouter();
  const { data: session } = useSession();
  const serviceName = service?.serviceName || "Wedding Service";
  const images = Array.isArray(service?.images)
    ? service.images.filter(
        (image): image is string => typeof image === "string" && image.trim().length > 0,
      )
    : [];
  const image = images[0] || "/wedding-hero.svg";
  const price = service?.price !== undefined && service?.price !== null ? `$${service.price}` : "Price on request";

  const handleViewDetails = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!session?.user) {
      event.preventDefault();
      router.push("/sign-in");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-[#1e293b]/40 border border-[#d4af37]/10 rounded-2xl overflow-hidden hover:border-[#d4af37]/40 transition-colors flex flex-col"
    >
      <div className="relative h-56 w-full overflow-hidden bg-[#0f172a]">
        <img
          src={image}
          alt={serviceName}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-[#0f172a]/80 backdrop-blur-md px-3 py-1 rounded-full text-[#d4af37] text-sm font-bold border border-[#d4af37]/30">
          {price}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-[#d4af37] mb-2 font-medium tracking-wide uppercase">
          <Tag className="w-3 h-3" />
          {service?.category || "Wedding Service"}
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-1 text-[#FDFBF7]">{serviceName}</h3>
        <div className="flex items-center gap-1 text-sm text-slate-400 mb-6">
          <MapPin className="w-4 h-4" />
          {service?.location || "Location on request"}
        </div>

        <div className="mt-auto">
          <Link
            href={`/services/${service?._id}`}
            onClick={handleViewDetails}
            className="block w-full text-center py-3 rounded-xl border border-[#d4af37]/30 text-[#d4af37] font-medium hover:bg-[#d4af37] hover:text-[#0f172a] transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
