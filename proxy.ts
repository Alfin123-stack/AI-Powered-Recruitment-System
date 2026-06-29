// proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

const isAuthRoute = (p: string) =>
  AUTH_ROUTES.some((r) => p === r || p.startsWith(r + "/"));
const isHRRoute = (p: string) => p.startsWith("/dashboard/hr");
const isCandidateRoute = (p: string) => p.startsWith("/dashboard/candidate");
const getDashboard = (role: "hr" | "candidate") =>
  role === "hr" ? "/dashboard/hr" : "/dashboard/candidate";

export async function proxy(req: NextRequest) {
  let supabaseResponse = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const isLoggedIn = !!session;

  // ── 1. Belum login → redirect ke /login ──────────────────────────────────
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 2. Sudah login → ambil role dari database ────────────────────────────
  let role: "hr" | "candidate" | null = null;

  if (isLoggedIn && session?.user?.id) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userData?.role === "hr") role = "hr";
    else if (userData?.role === "candidate") role = "candidate";
    // selain itu tetap null → akan di-block di bawah
  }

  // ── 3. Sudah login tapi role null (belum setup / data tidak valid) ────────
  if (isLoggedIn && role === null && pathname.startsWith("/dashboard")) {
    // Redirect ke halaman khusus "setup akun" atau login dengan pesan error
    const url = new URL("/login", req.url);
    url.searchParams.set("error", "role_not_found");
    return NextResponse.redirect(url);
  }

  // ── 4. Sudah login + punya role → redirect dari auth pages ───────────────
  if (isLoggedIn && role !== null && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL(getDashboard(role), req.url));
  }

  // ── 5. Redirect /dashboard → dashboard sesuai role ───────────────────────
  if (isLoggedIn && role !== null && pathname === "/dashboard") {
    return NextResponse.redirect(new URL(getDashboard(role), req.url));
  }

  // ── 6. Guard cross-role: HR tidak boleh akses /dashboard/candidate ────────
  if (isLoggedIn && role === "hr" && isCandidateRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard/hr", req.url));
  }

  // ── 7. Guard cross-role: kandidat tidak boleh akses /dashboard/hr ─────────
  if (isLoggedIn && role === "candidate" && isHRRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard/candidate", req.url));
  }

  return supabaseResponse;
}

export const config = {  
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
};