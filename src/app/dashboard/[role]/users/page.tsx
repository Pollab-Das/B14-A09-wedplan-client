"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async (query = "") => {
    try {
      const data = await fetchWithAuth(`/admin/users${query ? `?search=${query}` : ""}`);
      setUsers(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Block/Unblock
  const handleToggleBlock = async (id: string) => {
    try {
      await fetchWithAuth(`/admin/users/${id}/block`, { method: "PATCH" });
      toast.success("User status updated");
      
      // UI আপডেট
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchUsers(search);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#FDFBF7]">Manage Users</h1>
        <p className="text-slate-400 mt-1">View and manage all registered users.</p>
      </div>

      {/* সার্চ বার */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 bg-[#1e293b] border-[#d4af37]/20 text-[#FDFBF7] focus-visible:ring-[#d4af37]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit" className="bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a]">Search</Button>
      </form>

      {/* ইউজার টেবিল */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>
      ) : (
        <div className="bg-[#1e293b] rounded-2xl border border-[#d4af37]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0f172a] border-b border-[#d4af37]/10">
                <tr>
                  <th className="p-4 text-sm font-semibold text-slate-400">Name</th>
                  <th className="p-4 text-sm font-semibold text-slate-400">Email</th>
                  <th className="p-4 text-sm font-semibold text-slate-400">Role</th>
                  <th className="p-4 text-sm font-semibold text-slate-400">Status</th>
                  <th className="p-4 text-sm font-semibold text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#0f172a]/50 transition-colors">
                    <td className="p-4 text-[#FDFBF7] font-medium">{user.name}</td>
                    <td className="p-4 text-slate-300">{user.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0f172a] text-[#d4af37] capitalize border border-[#d4af37]/20">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.isBlocked ? (
                        <span className="text-red-400 text-sm flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Blocked</span>
                      ) : (
                        <span className="text-green-400 text-sm flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Active</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        onClick={() => handleToggleBlock(user._id)}
                        variant="outline"
                        className={`text-sm ${user.isBlocked ? "border-green-500/50 text-green-400 hover:bg-green-500/10" : "border-red-500/50 text-red-400 hover:bg-red-500/10"}`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}