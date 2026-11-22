"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { toast } from "sonner";
import { Calendar, MapPin, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Booking } from "@/lib/types";

export function BookingForm({ service }: { service: any }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventDate: "",
    eventLocation: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ১. ইউজার লগইন না থাকলে রিডাইরেক্ট
    if (!session?.user) {
      toast.error("Please sign in to book this service.");
      router.push("/sign-in");
      return;
    }

    // ২. ভেন্ডর বা অ্যাডমিন বুক করতে পারবে না
    if (session.user.role === "vendor" || session.user.role === "admin") {
      toast.error("Only customers can book services.");
      return;
    }

    // ৩. নিজের সার্ভিস বুক করা যাবে না (যদি ভেন্ডর হয়)
    if (session.user.id === service.vendorId) {
      toast.error("You cannot book your own service.");
      return;
    }

    setLoading(true);
    try {
      const existing = await fetchWithAuth("/bookings/customer");
      const bookings: Booking[] = Array.isArray(existing) ? existing : [];
      const requestedDate = formData.eventDate.slice(0, 10);
      const hasDuplicate = bookings.some(
        (booking) =>
          booking.serviceId === service._id &&
          String(booking.eventDate).slice(0, 10) === requestedDate &&
          (booking.status === "pending" || booking.status === "accepted")
      );

      if (hasDuplicate) {
        toast.error("You already have an active booking for this service on that date.");
        return;
      }

      await fetchWithAuth("/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId: service._id,
          ...formData,
        }),
      });

      toast.success("Booking request submitted successfully!");
      router.push("/dashboard/customer/bookings");
    } catch (error: any) {
      const message = error?.message || "";
      if (/already|duplicate|exist/i.test(message)) {
        toast.error("You already have an active booking for this service on that date.");
      } else {
        toast.error(message || "Unable to submit booking request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-[#d4af37]/20 sticky top-32">
      <div className="mb-6 pb-6 border-b border-slate-700/50">
        <span className="text-sm text-slate-400">Starting from</span>
        <h3 className="text-3xl font-bold text-[#d4af37]">${service.price}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ইভেন্ট ডেট */}
        <div className="space-y-2">
          <Label className="text-slate-300">Event Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]} // আজকের আগের তারিখ সিলেক্ট করা যাবে না
              className="pl-9 bg-[#0f172a] border-[#d4af37]/20 text-[#FDFBF7] focus-visible:ring-[#d4af37]"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
          </div>
        </div>

        {/* ইভেন্ট লোকেশন */}
        <div className="space-y-2">
          <Label className="text-slate-300">Event Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              required
              placeholder="Venue address"
              className="pl-9 bg-[#0f172a] border-[#d4af37]/20 text-[#FDFBF7] focus-visible:ring-[#d4af37]"
              value={formData.eventLocation}
              onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
            />
          </div>
        </div>

        {/*--->মেসেজ<----*/}
        <div className="space-y-2">
          <Label className="text-slate-300">Message to Vendor (Optional)</Label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <textarea
              rows={3}
              placeholder="Any special requirements?"
              className="w-full pl-9 pt-3 rounded-md border border-[#d4af37]/20 bg-[#0f172a] text-sm text-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[#d4af37] hover:bg-[#e6c86e] text-[#0f172a] font-bold text-lg mt-4"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Request Booking"}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-4">
        You won't be charged yet. The vendor will review your request.
      </p>
    </div>
  );
}