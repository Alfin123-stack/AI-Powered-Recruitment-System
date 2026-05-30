// app/profile/loading.tsx
// ─────────────────────────────────────────────
// Next.js secara otomatis tampilkan file ini
// saat page.tsx (Server Component) sedang fetch data.
//
// Alur:
//   Browser request /profile
//     → Next.js langsung render loading.tsx (instant)
//     → Server fetch session + data (SSR berjalan)
//     → Setelah selesai, replace dengan ProfileShell
//
// Ini adalah "Route Segment Loading UI" bawaan Next.js App Router.
// Berbeda dengan Suspense fallback — ini untuk level route/page.
// ─────────────────────────────────────────────

import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";

export default function ProfileLoading() {
  return <ProfileSkeleton />;
}
