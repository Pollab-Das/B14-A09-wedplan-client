"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Users, Store, Calendar, DollarSign, Clock, ShieldCheck, Loader2, Heart, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage({ params }: { params: Promise<{ role: string }> }) {
  const { data: session } = useSession();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});

  useEffect(() => { params.then(p => setRole(p.role)); }, [params]);

  useEffect(() => {
    if (!role) return;
    const fetchStats = async () => {
      try {
        if (role === "admin") {
          const data = await fetchWithAuth("/admin/stats");
          setStats(data);
        } else if (role === "vendor") {
          // ভেন্ডরের স্ট্যাটস (আমরা সার্ভিস এবং বুকিং ফেচ করে ক্যালকুলেট করব)
          const services = await fetchWithAuth("/services/vendor");
          const bookings = await fetchWithAuth("/bookings/vendor");
          setStats({
            totalServices: services.length,
            activeServices: services.filter((s: any) => s.status === "approved" && s.isActive).length,
            pendingBookings: bookings.filter((b: any) => b.status === "pending").length,
            acceptedBookings: bookings.filter((b: any) => b.status === "accepted").length,
            subscriptionPlan: session?.user?.subscriptionPlan || "free"
          });
        } else if (role === "customer") {
          // কাস্টমারের স্ট্যাটস
          const bookings = await fetchWithAuth("/bookings/customer");
          setStats({
            totalBookings: bookings.length,
            pendingBookings: bookings.filter((b: any) => b.status === "pending").length,
            acceptedBookings: bookings.filter((b: any) => b.status === "accepted").length,
            rejectedBookings: bookings.filter((b: any) => b.status === "rejected").length
          });
        }
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    };
    fetchStats();
  }, [role, session]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" /></div>;

  const renderStats = () => {
    if (role === "admin") {
      const cards = [
        { title: "Total Users", value: stats.totalUsers || 0, icon: Users, color: "text-blue-400" },
        { title: "Total Vendors", value: stats.totalVendors || 0, icon: Store, color: "text-green-400" },
        { title: "Total Customers", value: stats.totalCustomers || 0, icon: Calendar, color: "text-purple-400" },
        { title: "Total Services", value: stats.totalServices || 0, icon: ShieldCheck, color: "text-[#d4af37]" },
        { title: "Pending Services", value: stats.pendingServices || 0, icon: Clock, color: "text-yellow-400" },
        { title: "Total Transactions", value: stats.totalTransactions || 0, icon: DollarSign, color: "text-emerald-400" },
      ];
      return cards.map((stat, idx) => <StatCard key={stat.title} stat={stat} idx={idx} />);
    } 
    if (role === "vendor") {
      const cards = [
        { title: "Total Services", value: stats.totalServices || 0, icon: Store, color: "text-blue-400" },
        { title: "Active Services", value: stats.activeServices || 0, icon: CheckCircle, color: "text-green-400" },
        { title: "Pending Bookings", value: stats.pendingBookings || 0, icon: Clock, color: "text-yellow-400" },
        { title: "Accepted Bookings", value: stats.acceptedBookings || 0, icon: Calendar, color: "text-[#d4af37]" },
      ];
      return cards.map((stat, idx) => <StatCard key={stat.title} stat={stat} idx={idx} />);
    }
    if (role === "customer") {
      const cards = [
        { title: "Total Bookings", value: stats.totalBookings || 0, icon: Heart, color: "text-blue-400" },
        { title: "Pending", value: stats.pendingBookings || 0, icon: Clock, color: "text-yellow-400" },
        { title: "Accepted", value: stats.acceptedBookings || 0, icon: CheckCircle, color: "text-green-400" },
        { title: "Rejected", value: stats.rejectedBookings || 0, icon: XCircle, color: "text-red-400" },
      ];
      return cards.map((stat, idx) => <StatCard key={stat.title} stat={stat} idx={idx} />);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
          {role === "admin" ? "Admin Overview" : `Welcome back, ${session?.user?.name}`}
        </h1>
        <p className="text-slate-500">Here's what's happening with your {role} account.</p>
      </div>

      {/* সাবস্ক্রিপশন প্ল্যান (শুধু ভেন্ডরের জন্য) */}
      {role === "vendor" && (
        <div className="mb-8 bg-gradient-to-r from-[#1e293b] to-[#0f172a] p-6 rounded-2xl border border-[#d4af37]/30 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              Current Subscription Plan 
              <span className="px-2 py-0.5 bg-[#d4af37]/20 text-[#d4af37] text-xs font-bold rounded-full uppercase">
                {stats.subscriptionPlan}
              </span>
            </h3>
            <p className="text-slate-400 text-sm mt-1">Free plan allows up to 3 active wedding services.</p>
          </div>
          {stats.subscriptionPlan === "free" && (
            <a href="/dashboard/vendor/subscription" className="bg-[#d4af37] text-[#0f172a] px-6 py-2 rounded-xl font-bold hover:bg-[#e6c86e]">Upgrade to Premium</a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStats()}
      </div>
    </div>
  );
}

// রিইউজেবল স্ট্যাট কার্ড
function StatCard({ stat, idx }: { stat: any, idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
          <stat.icon className={`w-5 h-5 ${stat.color}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
    </motion.div>
  );
}