"use client"; // 🔥 এই লাইনটি যোগ করা হলো যাতে সার্ভার এরর না আসে

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Users, Store, Calendar, DollarSign, Clock, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalServices: 0,
    pendingServices: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    // URL থেকে role বের করা
    params.then((p) => setRole(p.role));
  }, [params]);

  useEffect(() => {
    // অ্যাডমিন হলে স্ট্যাটস ডাটা ফেচ করা
    if (role === "admin") {
      const getStats = async () => {
        try {
          const data = await fetchWithAuth("/admin/stats");
          setStats(data);
        } catch (error) {
          console.error("Failed to fetch stats", error);
        } finally {
          setLoading(false);
        }
      };
      getStats();
    } else {
      setLoading(false);
    }
  }, [role]);

  if (isPending || loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
    { title: "Total Vendors", value: stats.totalVendors, icon: Store, color: "text-green-400" },
    { title: "Total Customers", value: stats.totalCustomers, icon: Calendar, color: "text-purple-400" },
    { title: "Total Services", value: stats.totalServices, icon: ShieldCheck, color: "text-[#d4af37]" },
    { title: "Pending Services", value: stats.pendingServices, icon: Clock, color: "text-yellow-400" },
    { title: "Total Transactions", value: stats.totalTransactions, icon: DollarSign, color: "text-emerald-400" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-[#FDFBF7] mb-2">
          {role === "admin" ? "Admin Overview" : `Welcome back, ${session?.user?.name}`}
        </h1>
        <p className="text-slate-400">
          {role === "admin" ? "Platform statistics at a glance." : `Here's what's happening with your ${role} account.`}
        </p>
      </div>

      {/* স্ট্যাটস গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#1e293b] rounded-2xl p-6 border border-[#d4af37]/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400">{stat.title}</h3>
              <div className="w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#FDFBF7]">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}