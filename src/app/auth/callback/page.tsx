import { redirect } from "next/navigation";
import { getSession } from "@/lib/server-auth";

export default async function AuthCallbackPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in?error=session");
  }

  const role = session.user.role;

  if (role === "admin") redirect("/dashboard/admin");
  if (role === "vendor") redirect("/dashboard/vendor");
  redirect("/dashboard/customer");
}
