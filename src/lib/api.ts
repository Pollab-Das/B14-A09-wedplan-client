import { authClient } from "./auth-client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// পাবলিক সার্ভিস (আগেরটা)
export async function getPublicServices(query = "") {
  try {
    const res = await fetch(`${API_URL}/services${query ? `?${query}` : ""}`, {
      next: { revalidate: 60 }, 
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

// টোকেন সহ প্রোটেক্টেড রিকোয়েস্ট
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { data: session } = await authClient.getSession();
  
  if (!session?.session?.token) {
    throw new Error("Unauthorized");
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