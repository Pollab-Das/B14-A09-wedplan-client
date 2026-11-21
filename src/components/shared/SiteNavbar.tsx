"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Settings, User, Sun, Moon, Heart } from "lucide-react";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function SiteNavbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border animate-[navbar-in_0.6s_ease-out_both]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center text-[#0f172a]">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <span className="text-2xl font-heading font-bold text-[#d4af37]">WedPlan</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm hover:text-[#d4af37] transition-colors">Home</Link>
          <Link href="/browse-services" className="text-sm hover:text-[#d4af37] transition-colors">Browse Services</Link>
          <Link href="/how-it-works" className="text-sm hover:text-[#d4af37] transition-colors">How It Works</Link>
        </nav>

        <div className="flex items-center gap-4">
          {mounted && (
            <button 
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} 
              className="p-2 rounded-full bg-card text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
            >
              {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {!mounted || isPending ? (
            <div className="h-10 w-24 bg-card animate-pulse rounded-full" />
          ) : session?.user ? (
            <DropdownMenu>
              {/* 🔥 DropdownMenuTrigger-এ nativeButton={false} যোগ করা হলো */}
              <DropdownMenuTrigger nativeButton={false} render={
                <div className="flex items-center gap-3 outline-none cursor-pointer">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-[#d4af37] capitalize">{session.user.role}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] overflow-hidden bg-card flex items-center justify-center">
                    {session.user.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-[#d4af37]" />
                    )}
                  </div>
                </div>
              } />
              
              <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/${session.user.role}`)} className="cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/${session.user.role}/profile`)} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" /> Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-400">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/sign-in" className="hidden sm:block text-sm hover:text-[#d4af37]">Sign In</Link>
              <Link href="/sign-up" className="bg-[#d4af37] text-[#0f172a] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#e6c86e]">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}