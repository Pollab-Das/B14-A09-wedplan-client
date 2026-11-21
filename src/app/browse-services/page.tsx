import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { ServiceCard } from "@/components/home/ServiceCard";
import { getPublicServices } from "@/lib/api";

export default async function BrowseServicesPage() {
  // সব Approved এবং Active সার্ভিস ফেচ করা হচ্ছে
  const services = await getPublicServices();

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <SiteNavbar />
      
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#FDFBF7] mb-4">
            Browse <span className="text-[#d4af37]">Services</span>
          </h1>
          <p className="text-slate-400">Discover the perfect vendors for your special day.</p>
        </div>

        {/* সার্ভিস গ্রিড */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service: any) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-[#d4af37]/10">
            <p className="text-slate-400 mb-4">No services available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}