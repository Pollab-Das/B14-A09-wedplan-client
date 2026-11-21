import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-center max-w-md px-6">
        <ShieldAlert className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h1 className="text-3xl font-heading font-bold text-[#FDFBF7] mb-4">Access Denied</h1>
        <p className="text-slate-400 mb-8">
          You do not have permission to access this page. Please sign in with the correct role.
        </p>
        <Link
          href="/"
          className="bg-[#d4af37] text-[#0f172a] px-8 py-3 rounded-full font-bold hover:bg-[#e6c86e] transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}