"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Service } from "@/lib/types";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, Trash2, Search, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ServicesPage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;

  if (session?.user?.role === "vendor") return <VendorServicesView />;
  if (session?.user?.role === "admin") return <AdminServicesView />;
  
  return <div className="text-center py-20 text-slate-400">Unauthorized Role</div>;
}

// 🔥 VENDOR VIEW
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await fetchWithAuth(`/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      fetchServices();
    } catch (error: any) { toast.error(error.message); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#FDFBF7]">My Services</h1>
          <p className="text-slate-400 mt-1">Manage your listings.</p>
        </div>
        <Link href="/dashboard/vendor/services/add">
          <Button className="bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a]">
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-[#1e293b] border border-[#d4af37]/10 rounded-2xl overflow-hidden flex flex-col">
            <img src={service.images[0]} alt={service.serviceName} className="h-40 w-full object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-[#FDFBF7]">{service.serviceName}</h3>
              <p className="text-sm text-[#d4af37]">{service.category}</p>
              <div className="flex items-center gap-4 text-sm text-slate-400 mt-2 mb-4">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {service.location}</span>
                <span className="font-bold text-[#FDFBF7]">${service.price}</span>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className={`text-xs font-bold capitalize px-2 py-1 rounded-full ${
                  service.status === 'approved' ? 'bg-green-500/10 text-green-400' : 
                  service.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>{service.status}</span>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(service._id)} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 h-8 px-2">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {services.length === 0 && <div className="text-center py-20 text-slate-400">No services added yet.</div>}
    </div>
  );
}

// 🔥 ADMIN VIEW
function AdminServicesView() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchServices = async () => {
    try {
      const data = await fetchWithAuth("/admin/services");
      setServices(data);
    } catch (error: any) { toast.error(error.message); } 
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetchWithAuth(`/services/${id}`, { method: "DELETE" });
      toast.success("Service deleted");
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (error: any) { toast.error(error.message); }
  };

  const filtered = services.filter(s => s.serviceName.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#FDFBF7]">Manage Services</h1>
        <p className="text-slate-400 mt-1">Review and approve vendor services.</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
        <Input placeholder="Search services..." className="pl-9 bg-[#1e293b] border-[#d4af37]/20 text-[#FDFBF7]" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <div key={service._id} className="bg-[#1e293b] rounded-2xl border border-[#d4af37]/10 overflow-hidden flex flex-col">
            <img src={service.images[0]} alt={service.serviceName} className="h-40 w-full object-cover" />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-[#FDFBF7]">{service.serviceName}</h3>
              <p className="text-sm text-slate-400 mb-4">{service.category} • ${service.price}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className={`text-xs font-bold capitalize px-2 py-1 rounded-full ${
                  service.status === 'approved' ? 'bg-green-500/10 text-green-400' : 
                  service.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>{service.status}</span>
                <div className="flex gap-2">
                  {service.status !== "approved" && (
                    <Button size="sm" onClick={() => handleStatusUpdate(service._id, "approved")} className="bg-green-500/10 text-green-500 hover:bg-green-500/20 h-8 px-2">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  {service.status !== "rejected" && (
                    <Button size="sm" onClick={() => handleStatusUpdate(service._id, "rejected")} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 h-8 px-2">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" onClick={() => handleDelete(service._id)} className="bg-slate-700 text-slate-300 hover:bg-red-500/20 hover:text-red-500 h-8 px-2">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}