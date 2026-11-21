"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup, // 🔥 এটি ইমপোর্ট করতে হবে
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";

export function SiteNavbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-[#d4af37]/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* লোগো */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-3xl font-heading font-bold text-[#d4af37] group-hover:scale-105 transition-transform">
            VowVista
          </span>
        </Link>

        {/* ডেস্কটপ লিংক */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm hover:text-[#d4af37] transition-colors">Home</Link>
          <Link href="/browse-services" className="text-sm hover:text-[#d4af37] transition-colors">Browse Services</Link>
          <Link href="/how-it-works" className="text-sm hover:text-[#d4af37] transition-colors">How It Works</Link>
        </nav>

        {/* রাইট সাইড (লগইন/লগআউট) */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="h-10 w-24 bg-[#1e293b] animate-pulse rounded-full" />
          ) : session?.user ? (
            // লগইন করা থাকলে ড্রপডাউন
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center gap-3 outline-none cursor-pointer">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-[#d4af37] capitalize">{session.user.role}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] overflow-hidden bg-[#1e293b] flex items-center justify-center">
                    {session.user.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-[#d4af37]" />
                    )}
                  </div>
                </div>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 bg-[#1e293b] border-[#d4af37]/20 text-[#FDFBF7]">
                {/* 🔥 DropdownMenuLabel কে DropdownMenuGroup এর ভেতরে রাখা হলো */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-[#d4af37]/20" />
                
                <DropdownMenuItem 
                  onClick={() => router.push(`/dashboard/${session.user.role}`)}
                  className="cursor-pointer hover:bg-[#d4af37]/10 focus:bg-[#d4af37]/10"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => router.push(`/dashboard/${session.user.role}/profile`)}
                  className="cursor-pointer hover:bg-[#d4af37]/10 focus:bg-[#d4af37]/10"
                >
                  <Settings className="w-4 h-4 mr-2" /> Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#d4af37]/20" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-400 hover:bg-red-400/10 focus:bg-red-400/10"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // লগইন না থাকলে বাটন
            <>
              <Link href="/sign-in" className="hidden sm:block text-sm hover:text-[#d4af37] transition-colors">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-[#d4af37] text-[#0f172a] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#e6c86e] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}