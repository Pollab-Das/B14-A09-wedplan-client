import { authClient } from "./auth-client";
import { Service } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getPublicServices(query = "") {
  try {
    const params = new URLSearchParams(query.replace(/^[?&]+/, ""));
    params.set("status", "approved");
    params.set("isActive", "true");

    const res = await fetch(`${API_URL}/services?${params.toString()}`, {
      next: { revalidate: 60 }, 
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return data;
    return data.filter((service: Service) =>
      (service.status === undefined || service.status === "approved") &&
      (service.isActive === undefined || String(service.isActive) === "true")
    );
  } catch {
    return [];
  }
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { data: session } = await authClient.getSession();
  
  if (!session?.session?.token) {
    throw new Error("Unauthorized: Please sign in again");
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.session.token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }

  return res.json();
}