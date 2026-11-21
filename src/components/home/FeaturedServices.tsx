import Link from "next/link";
import { getPublicServices } from "@/lib/api";
import { motion } from "framer-motion"; // UI-তে অ্যানিমেশনের জন্য

// নোট: Server Component-এ direct motion ব্যবহার করা যায় না, তাই আমরা কার্ডগুলোকে আলাদা ক্লায়েন্ট কম্পোনেন্ট বানাবো
import { ServiceCard } from "./ServiceCard";

export async function FeaturedServices() {
  // API থেকে ডাটা আনছি (সর্বোচ্চ ৬টি)
  const services = await getPublicServices("limit=6");

  return (
    <section className="py-24 bg-[#0f172a]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="text-[#d4af37]">Services</span>
            </h2>
            <p className="text-slate-muted">Handpicked vendors to make your day perfect.</p>
          </div>
          <Link 
            href="/browse-services"
            className="mt-4 md:mt-0 text-[#d4af37] hover:text-[#e6c86e] font-medium flex items-center gap-2"
          >
            View All Services &rarr;
          </Link>
        </div>

        {/* সার্ভিস গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
        
        {/* Empty State */}
        {services.length === 0 && (
          <div className="text-center py-20 text-slate-muted">
            No services available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}