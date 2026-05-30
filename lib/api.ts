// lib/api.ts

export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiFetch = async (
  path: string,
  token: string,
  options: RequestInit = {},
) => {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Request gagal");
  }
  return res.json();
};
