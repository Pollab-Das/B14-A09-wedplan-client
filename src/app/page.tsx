import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { SiteFooter } from "@/components/shared/SiteFooter"; // 🔥 ফুটার ইমপোর্ট

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <SiteNavbar />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedServices />
      </main>
      <SiteFooter /> {/* 🔥 ফুটার যুক্ত করা হলো */}
    </div>
  );
}