// proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

const isAuthRoute = (p: string) =>
  AUTH_ROUTES.some((r) => p === r || p.startsWith(r + "/"));
const isHRRoute = (p: string) => p.startsWith("/dashboard/hr");
const isCandidateRoute = (p: string) => p.startsWith("/dashboard/candidate");
const getDashboard = (role: string) =>
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

  // Ambil role dari database, bukan dari user_metadata
  let role: "hr" | "candidate" = "candidate"; // default fallback
  if (isLoggedIn && session?.user?.id) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userData?.role === "hr") {
      role = "hr";
    }
  }

  if (isLoggedIn && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL(getDashboard(role), req.url));
  }

  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && role === "hr" && isCandidateRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard/hr", req.url));
  }

  if (isLoggedIn && role === "candidate" && isHRRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard/candidate", req.url));
  }

  if (isLoggedIn && pathname === "/dashboard") {
    return NextResponse.redirect(new URL(getDashboard(role), req.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
};
