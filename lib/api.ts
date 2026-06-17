// lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Canonical — dipindahkan dari shared/lib/api.ts ke sini.
// shared/lib/api.ts dihapus.
// ─────────────────────────────────────────────────────────────────────────────

export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/** Alias — beberapa file lama mengimpor API_BASE_URL dari sini. */
export { API as API_BASE_URL };

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
