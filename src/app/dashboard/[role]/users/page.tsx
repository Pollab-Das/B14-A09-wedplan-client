"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Search, ShieldAlert, ShieldCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async (nextSearch = search, nextRole = roleFilter) => {
    try {
      const params = new URLSearchParams();
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextRole !== "all") params.set("role", nextRole);
      const query = params.toString();
      const data = await fetchWithAuth(`/admin/users${query ? `?${query}` : ""}`);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error: any) { toast.error(error.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter((user) => roleFilter === "all" || user.role === roleFilter);

  const handleToggleBlock = async (id: string) => {
    try {
      await fetchWithAuth(`/admin/users/${id}/block`, { method: "PATCH" });
      toast.success("User status updated");
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (error: any) { toast.error(error.message); }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Manage Users</h1>
      
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={(e) => { e.preventDefault(); fetchUsers(search, roleFilter); }} className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input placeholder="Search by name or email..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button type="submit" className="bg-[#d4af37] text-[#0f172a]">Search</Button>
        </form>
        <select
          aria-label="Filter by role"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); fetchUsers(search, e.target.value); }}
          className="h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div> : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-400">Name</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Email</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Role</th>
                <th className="p-4 text-sm font-semibold text-slate-400">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-background/50">
                  <td className="p-4 text-foreground font-medium">{user.name}</td>
                  <td className="p-4 text-slate-500">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-background text-[#d4af37] capitalize border border-border">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.isBlocked ? <span className="text-red-500 text-sm flex items-center gap-1"><ShieldAlert className="w-4 h-4"/> Blocked</span> : <span className="text-green-500 text-sm flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Active</span>}
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" onClick={() => handleToggleBlock(user._id)} className={user.isBlocked ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
                      {user.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔥 View User Details মডাল */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> <span className="capitalize">{selectedUser.role}</span></p>
              <p><strong>Status:</strong> {selectedUser.isBlocked ? "Blocked" : "Active"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}