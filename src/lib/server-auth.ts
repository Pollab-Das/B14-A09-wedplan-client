import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await getSession();
  
  if (!session) {
    redirect("/sign-in");
  }
  
  // 🔥 সেশন থেকে role বের করুন
  const userRole = session.user.role as string;

  if (!allowedRoles.includes(userRole)) {
    redirect("/unauthorized");
  }
  
  return session;
}