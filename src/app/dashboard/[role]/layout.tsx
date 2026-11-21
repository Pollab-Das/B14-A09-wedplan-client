import { requireRole } from "@/lib/server-auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { SiteNavbar } from "@/components/shared/SiteNavbar";
import { SiteFooter } from "@/components/shared/SiteFooter";

export default async function DashboardLayout({ children, params }: { children: React.ReactNode; params: Promise<{ role: string }> }) {
  const { role } = await params;
  await requireRole([role]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNavbar />
      <div className="flex-1 flex relative">
        <DashboardSidebar />
        <main className="w-full lg:pl-64 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto min-h-[calc(100vh-16rem)]">
            {children}
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}