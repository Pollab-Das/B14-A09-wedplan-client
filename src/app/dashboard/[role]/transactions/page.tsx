"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const data = await fetchWithAuth("/admin/transactions");
        setTransactions(data);
      } catch (error: any) { toast.error(error.message); } 
      finally { setLoading(false); }
    };
    fetchTx();
  }, []);

  const filteredTx = transactions.filter(tx => filter === "all" || tx.status === filter);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Transactions</h1>
      
      {/* 🔥 স্ট্যাটাস ফিল্টার */}
      <div className="flex gap-2">
        {["all", "success", "pending", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${filter === status ? "bg-[#d4af37] text-[#0f172a]" : "bg-card text-slate-400 border border-border hover:text-foreground"}`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div> : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-400">Transaction ID</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Vendor ID</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Plan</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Amount</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Date</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTx.map((tx) => (
                <tr key={tx._id}>
                  <td className="p-4 text-slate-500 text-sm font-mono truncate max-w-[150px]">{tx.stripeSessionId}</td>
                  <td className="p-4 text-slate-500 text-sm font-mono truncate max-w-[150px]">{tx.vendorId}</td>
                  <td className="p-4 text-foreground text-sm capitalize">{tx.plan ?? tx.subscriptionPlan ?? tx.planType ?? "—"}</td>
                  <td className="p-4 text-[#d4af37] font-bold">${tx.amount}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                      tx.status === 'success' ? 'bg-green-500/10 text-green-500' : 
                      tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                      'bg-red-500/10 text-red-500'
                    }`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTx.length === 0 && <div className="text-center py-10 text-slate-500">No transactions found for this filter.</div>}
        </div>
      )}
    </div>
  );
}