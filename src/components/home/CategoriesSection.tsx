"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Camera, MapPin, Flower2, Utensils, Sparkles, Shirt } from "lucide-react";

const categories = [
  { name: "Photography & Videography", icon: Camera },
  { name: "Wedding Venues", icon: MapPin },
  { name: "Decoration & Florist", icon: Flower2 },
  { name: "Catering Services", icon: Utensils },
  { name: "Makeup & Styling", icon: Sparkles },
  { name: "Wedding Fashion", icon: Shirt },
];

export function CategoriesSection() {
  return (
    <section className="py-24 bg-[#0f172a] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl font-bold mb-4"
          >
            Explore by <span className="text-[#d4af37]">Category</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-muted"
          >
            Find exactly what you need for your special day.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/browse-services?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center justify-center p-6 bg-[#1e293b]/50 border border-[#d4af37]/10 rounded-2xl hover:bg-[#d4af37]/10 hover:border-[#d4af37]/50 transition-all group"
              >
                <cat.icon className="w-8 h-8 text-[#d4af37] mb-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-center font-medium group-hover:text-[#d4af37] transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
