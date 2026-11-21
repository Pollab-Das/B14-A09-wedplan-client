"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Service } from "@/lib/types";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, Trash2, Search, Plus, MapPin, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ServicesPage() {
  const { data: session, isPending } = useSession();
  if (isPending) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;
  if (session?.user?.role === "vendor") return <VendorServicesView />;
  if (session?.user?.role === "admin") return <AdminServicesView />;
  return <div className="text-center py-20">Unauthorized Role</div>;
}

function VendorServicesView() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const data = await fetchWithAuth("/services/vendor");
      setServices(data);
    } catch (error: any) { toast.error(error.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  // 🔥 Active/Deactive টগল
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await fetchWithAuth(`/services/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      toast.success("Service status updated");
      setServices((prev) => prev.map((s) => s._id === id ? { ...s, isActive: !currentStatus } : s));
    } catch (error: any) { toast.error(error.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await fetchWithAuth(`/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (error: any) { toast.error(error.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-3xl font-bold text-foreground">My Services</h1>
        <Link href="/dashboard/vendor/services/add">
          <Button className="bg-[#d4af37] text-[#0f172a]"><Plus className="w-4 h-4 mr-2" /> Add Service</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
            <img src={service.images[0]} alt={service.serviceName} className="h-40 w-full object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-foreground">{service.serviceName}</h3>
              <p className="text-sm text-[#d4af37]">{service.category}</p>
              <div className="flex items-center gap-4 text-sm text-slate-400 mt-2 mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {service.location}</span>
                <span className="font-bold text-foreground">${service.price}</span>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className={`text-xs font-bold capitalize px-2 py-1 rounded-full ${
                  service.status === 'approved' ? 'bg-green-500/10 text-green-500' : 
                  service.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}>{service.status}</span>
                
                <div className="flex items-center gap-2">
                  {/* 🔥 Active/Deactive টগল বাটন */}
                  <button 
                    onClick={() => handleToggleActive(service._id, service.isActive)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${service.isActive ? 'bg-green-500' : 'bg-slate-600'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${service.isActive ? 'left-5' : 'left-0.5'}`} />
                  </button>
                  
                  {/* 🔥 Edit এবং Delete বাটন */}
                  <Link href={`/dashboard/vendor/services/edit/${service._id}`}>
                    <Button size="sm" variant="outline" className="border-[#d4af37]/30 text-[#d4af37] h-8 px-2"><Edit className="w-4 h-4" /></Button>
                  </Link>
                  <Button size="sm" onClick={() => handleDelete(service._id)} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 h-8 px-2"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// AdminServicesView আগের মতোই থাকবে, শুধু ডার্ক/লাইট থিমের ক্লাসগুলো ঠিক করে দেব।
function AdminServicesView() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchServices = async (nextStatus = statusFilter) => {
    try {
      const query = nextStatus !== "all" ? `?status=${nextStatus}` : "";
      const data = await fetchWithAuth(`/admin/services${query}`);
      setServices(Array.isArray(data) ? data : []);
    } 
    catch (error: any) { toast.error(error.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      await fetchWithAuth(`/services/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success(`Service ${status}`);
      setServices((prev) => prev.map((s) => s._id === id ? { ...s, status } : s));
    } catch (error: any) { toast.error(error.message); }
  };

  const filtered = services.filter(
    (s) =>
      s.serviceName.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "all" || s.status === statusFilter)
  );

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Manage Services</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <Input placeholder="Search services..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); fetchServices(e.target.value); }}
          className="h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <div key={service._id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
            <img src={service.images[0]} alt={service.serviceName} className="h-40 w-full object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-foreground">{service.serviceName}</h3>
              <p className="text-sm text-slate-400 mb-4">{service.category} • ${service.price}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className={`text-xs font-bold capitalize px-2 py-1 rounded-full ${service.status === 'approved' ? 'bg-green-500/10 text-green-500' : service.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{service.status}</span>
                <div className="flex gap-2">
                  {service.status !== "approved" && <Button size="sm" onClick={() => handleStatusUpdate(service._id, "approved")} className="bg-green-500/10 text-green-500 h-8 px-2"><CheckCircle className="w-4 h-4" /></Button>}
                  {service.status !== "rejected" && <Button size="sm" onClick={() => handleStatusUpdate(service._id, "rejected")} className="bg-red-500/10 text-red-500 h-8 px-2"><XCircle className="w-4 h-4" /></Button>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}