"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { Booking } from "@/lib/types";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, Calendar, MapPin, XCircle, CheckCircle, Clock, Mail, FileText, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookingsPage() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;

  if (session?.user?.role === "vendor") return <VendorBookingsView />;
  if (session?.user?.role === "customer") return <CustomerBookingsView />;
  
  return <div className="text-center py-20 text-slate-400">Unauthorized Role</div>;
}

// 🔥 VENDOR BOOKINGS VIEW
function VendorBookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await fetchWithAuth("/bookings/vendor");
      setBookings(data);
    } catch (error: any) { toast.error(error.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      await fetchWithAuth(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      toast.success(`Booking ${status}`);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status } : b));
    } catch (error: any) { toast.error(error.message); }
  };

  const getColor = (status: string) => {
    switch (status) {
      case "accepted": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "cancelled": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#FDFBF7]">Booking Requests</h1>
        <p className="text-slate-400 mt-1">Manage incoming requests for your services.</p>
      </div>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <motion.div key={booking._id} className="bg-[#1e293b] border border-[#d4af37]/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getColor(booking.status)}`}>{booking.status}</span>
                <span className="text-sm text-slate-400">Requested on {new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-300"><Mail className="w-4 h-4 text-[#d4af37]" /> <span className="text-sm">Customer: {booking.customerId}</span></div>
                <div className="flex items-center gap-2 text-slate-300"><Calendar className="w-4 h-4 text-[#d4af37]" /> <span className="text-sm">Date: {booking.eventDate}</span></div>
                <div className="flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4 text-[#d4af37]" /> <span className="text-sm">Loc: {booking.eventLocation}</span></div>
              </div>
              {booking.message && (
                <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700/50 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-slate-500 mt-1" />
                  <p className="text-sm text-slate-300 italic">"{booking.message}"</p>
                </div>
              )}
            </div>
            {booking.status === "pending" && (
              <div className="flex md:flex-col gap-2 shrink-0">
                <Button onClick={() => handleStatus(booking._id, "accepted")} className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20"><Check className="w-4 h-4 mr-2" /> Accept</Button>
                <Button onClick={() => handleStatus(booking._id, "rejected")} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"><X className="w-4 h-4 mr-2" /> Reject</Button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      {bookings.length === 0 && <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-[#d4af37]/10"><p className="text-slate-400">No booking requests yet.</p></div>}
    </div>
  );
}

// 🔥 CUSTOMER BOOKINGS VIEW
function CustomerBookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const data = await fetchWithAuth("/bookings/customer");
      setBookings(data);
    } catch (error: any) { toast.error(error.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await fetchWithAuth(`/bookings/${id}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled");
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: "cancelled" } : b));
    } catch (error: any) { toast.error(error.message); }
  };

  const getBadge = (status: string) => {
    switch (status) {
      case "accepted": return { text: "Accepted", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle };
      case "rejected": return { text: "Rejected", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle };
      case "cancelled": return { text: "Cancelled", color: "bg-slate-500/10 text-slate-400 border-slate-500/20", icon: XCircle };
      default: return { text: "Pending", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock };
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[#FDFBF7]">My Bookings</h1>
        <p className="text-slate-400 mt-1">Track the status of your requested services.</p>
      </div>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const badge = getBadge(booking.status);
          return (
            <motion.div key={booking._id} className="bg-[#1e293b] border border-[#d4af37]/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}><badge.icon className="w-3.5 h-3.5" />{badge.text}</span>
                  <span className="text-sm text-slate-400">Applied on {new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-slate-300"><Calendar className="w-4 h-4 text-[#d4af37]" /> <span className="text-sm">Date: {booking.eventDate}</span></div>
                  <div className="flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4 text-[#d4af37]" /> <span className="text-sm">Loc: {booking.eventLocation}</span></div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-6">
                <Link href={`/services/${booking.serviceId}`}><Button variant="outline" className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10">View Service</Button></Link>
                {booking.status === "pending" && <Button onClick={() => handleCancel(booking._id)} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white">Cancel</Button>}
              </div>
            </motion.div>
          );
        })}
      </div>
      {bookings.length === 0 && (
        <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-[#d4af37]/10">
          <p className="text-slate-400 mb-4">You haven't booked any services yet.</p>
          <Link href="/browse-services"><Button className="bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a]">Browse Services</Button></Link>
        </div>
      )}
    </div>
  );
}