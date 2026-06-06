const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function fetchWithToken<T>(
  path: string,
  token: string,
): Promise<T | null> {
  if (!token) return null;
  try {
    const res = await fetch(`${API}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}
