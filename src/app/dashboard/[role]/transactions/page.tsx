"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const data = await fetchWithAuth("/admin/transactions");
        setTransactions(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#FDFBF7]">Transactions</h1>
        <p className="text-slate-400 mt-1">View all subscription payments.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>
      ) : (
        <div className="bg-[#1e293b] rounded-2xl border border-[#d4af37]/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#0f172a] border-b border-[#d4af37]/10">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-400">Transaction ID</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Vendor ID</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Amount</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Date</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="p-4 text-slate-300 text-sm font-mono truncate max-w-[150px]">{tx.stripeSessionId}</td>
                  <td className="p-4 text-slate-300 text-sm font-mono truncate max-w-[150px]">{tx.vendorId}</td>
                  <td className="p-4 text-[#d4af37] font-bold">${tx.amount}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 capitalize">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}