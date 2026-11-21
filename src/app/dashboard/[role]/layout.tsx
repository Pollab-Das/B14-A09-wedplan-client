import { requireRole } from "@/lib/server-auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  // 🔥 সার্ভার সাইডে রোল চেক
  // যে রোলের ড্যাশবোর্ডে ঢুকছে, সে আসলেই সেই রোলের কি না চেক করা
  await requireRole([role]);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <DashboardSidebar />
      <main className="lg:pl-64 pt-24 pb-12 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}