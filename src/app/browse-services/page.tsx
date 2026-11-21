"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { ServiceCard, type ServiceSummary } from "@/components/home/ServiceCard";
import { getPublicServices } from "@/lib/api";
import { Search, Filter, ArrowUpDown, MapPin } from "lucide-react";

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

function BrowseServicesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const sort = searchParams.get("sort") ?? "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  useEffect(() => {
    let active = true;

    const fetchServices = async () => {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (category) query.set("category", category);
      if (location) query.set("location", location);
      if (sort) query.set("sort", sort);
      query.set("status", "approved");
      query.set("isActive", "true");

      const data = await getPublicServices(query.toString());
      if (active) {
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    };

    fetchServices();
    return () => {
      active = false;
    };
  }, [search, category, location, sort]);

  return (
    <>
      <div className="bg-card p-4 rounded-2xl border border-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(event) => updateFilter("search", event.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="relative w-full">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <select
            value={category}
            onChange={(event) => updateFilter("category", event.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm appearance-none focus:outline-none focus:border-[#d4af37]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(event) => updateFilter("location", event.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="relative w-full">
          <ArrowUpDown className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <select
            value={sort}
            onChange={(event) => updateFilter("sort", event.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm appearance-none focus:outline-none focus:border-[#d4af37]"
          >
            <option value="">Newest First</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-80 bg-card rounded-2xl border border-border" />
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-2xl border border-border">
          <p className="text-slate-500">No services found. Try a different category or location.</p>
        </div>
      )}
    </>
  );
}

export default function BrowseServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
            Browse <span className="text-[#d4af37]">Wedding Services</span>
          </h1>
          <p className="text-slate-500">Discover top-rated vendors for your special day.</p>
        </div>

        <Suspense fallback={<div className="h-80 bg-card rounded-2xl border border-border animate-pulse" />}>
          <BrowseServicesContent />
        </Suspense>
      </main>
    </div>
  );
}
