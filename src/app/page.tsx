import Link from "next/link";
import {
  ShieldCheck,
  BadgeDollarSign,
  CalendarCheck,
  HeartHandshake,
  Search,
  MessageSquareHeart,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { SiteFooter } from "@/components/shared/SiteFooter";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Verified Vendors",
    description: "Every service is reviewed before it goes live, so you can plan with confidence.",
  },
  {
    icon: BadgeDollarSign,
    title: "Clear Pricing",
    description: "Compare real prices upfront and find a vendor that fits your budget.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description: "Send your event details in minutes and track every request in one place.",
  },
  {
    icon: HeartHandshake,
    title: "Made for Your Day",
    description: "From intimate ceremonies to grand celebrations, discover vendors who fit your vision.",
  },
];

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse by category, location, and budget to shortlist your favourites.",
  },
  {
    icon: MessageSquareHeart,
    title: "Connect",
    description: "Request a booking with your date and details, then hear back from the vendor.",
  },
  {
    icon: Sparkles,
    title: "Celebrate",
    description: "Confirm your team and enjoy the day you have been dreaming about.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      <SiteNavbar />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedServices />

        <section className="py-24 bg-[#0f172a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block text-[#d4af37] text-sm font-bold uppercase tracking-[0.25em] mb-3">
                The WedPlan Difference
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Why Choose <span className="text-[#d4af37]">WedPlan</span>
              </h2>
              <p className="text-slate-muted max-w-2xl mx-auto">
                Planning a wedding should feel joyful, not overwhelming. We bring the right people
                and the right details together so you can focus on the moments that matter.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {reasons.map((reason) => (
                <div
                  key={reason.title}
                  className="bg-[#1e293b]/50 border border-[#d4af37]/10 rounded-2xl p-8 hover:border-[#d4af37]/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mb-6">
                    <reason.icon className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#FDFBF7] mb-3">{reason.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#1e293b]/30 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 bg-cover bg-center"
            style={{ backgroundImage: "url('/wedding-hero.svg')" }}
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block text-[#d4af37] text-sm font-bold uppercase tracking-[0.25em] mb-3">
                Three Simple Steps
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                From First Search to <span className="text-[#d4af37]">I Do</span>
              </h2>
              <p className="text-slate-muted max-w-2xl mx-auto">
                A clear path to the wedding you imagined, with every detail in your hands.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="bg-[#0f172a]/70 border border-[#d4af37]/10 rounded-2xl p-8 hover:border-[#d4af37]/40 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-[#d4af37]" />
                    </div>
                    <span className="font-heading text-3xl text-[#d4af37]/40 font-bold">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#FDFBF7] mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-[#d4af37] font-semibold hover:text-[#e6c86e] transition-colors"
              >
                See how it works <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
