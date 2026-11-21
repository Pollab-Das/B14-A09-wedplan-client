"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Calendar, Heart, Settings, 
  PlusCircle, List, CreditCard, Users, Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const menuItems = {
  vendor: [
    { name: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { name: "My Services", href: "/dashboard/vendor/services", icon: List },
    { name: "Add Service", href: "/dashboard/vendor/services/add", icon: PlusCircle },
    { name: "Booking Requests", href: "/dashboard/vendor/bookings", icon: Calendar },
    { name: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
    { name: "Profile Settings", href: "/dashboard/vendor/profile", icon: Settings },
  ],
  customer: [
    { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "My Bookings", href: "/dashboard/customer/bookings", icon: Heart },
    { name: "Profile Settings", href: "/dashboard/customer/profile", icon: Settings },
  ],
  admin: [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Manage Services", href: "/dashboard/admin/services", icon: List },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
  ],
};

function SidebarContent() {
  const pathname = usePathname();
  const { data: session } = useSession();
  if (!session?.user?.role) return null;

  const role = session.user.role as "vendor" | "customer" | "admin";
  const currentMenu = menuItems[role] || [];

  return (
    <div className="h-full flex flex-col py-6">
      <div className="px-6 mb-8 mt-16 lg:mt-0">
        <h2 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest">
          {role} Dashboard
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {currentMenu.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30"
                    : "text-slate-400 hover:bg-[#1e293b] hover:text-[#FDFBF7]"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
}

export function DashboardSidebar() {
  return (
    <>
      {/* ডেস্কটপ সাইডবার */}
      <aside className="w-64 h-screen fixed left-0 top-0 border-r border-[#d4af37]/20 bg-[#0f172a] hidden lg:flex pt-24 z-40">
        <SidebarContent />
      </aside>

      {/* মোবাইল সাইডবার (Sheet) */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Sheet>
          <SheetTrigger 
            className="p-2 bg-[#1e293b] rounded-lg border border-[#d4af37]/30 text-[#d4af37]"
          >
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#0f172a] border-r border-[#d4af37]/20 p-0 w-64">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}