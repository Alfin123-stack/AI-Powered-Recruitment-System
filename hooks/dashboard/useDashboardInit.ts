"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { DashboardUser } from "@/types/dashboard";
import { Company } from "@/types/main/company";

export function useDashboardInit() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [token, setToken] = useState<string>("");
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      // ── Pastikan session yang dipakai masih fresh ────────────────────
      // getSession() cuma baca dari local storage, token bisa saja sudah
      // expired kalau tab dibiarkan lama tanpa ada request apa pun yang
      // memicu auto-refresh dari Supabase client.
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const expiresAt = session.expires_at ?? 0;
        const nowInSeconds = Math.floor(Date.now() / 1000);
        // Refresh kalau sudah expired atau akan expired dalam 60 detik ke depan
        if (expiresAt - nowInSeconds < 60) {
          const { data: refreshed, error: refreshError } =
            await supabase.auth.refreshSession();
          if (!refreshError && refreshed.session) {
            session = refreshed.session;
          }
        }
      }

      if (!session) {
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("role, full_name")
        .eq("id", session.user.id)
        .single<{ role: string; full_name: string }>();

      const role: "candidate" | "hr" =
        userData?.role === "hr" ? "hr" : "candidate";

      const accessToken = session.access_token;
      setToken(accessToken);
      setUser({
        id: session.user.id,
        email: session.user.email ?? "",
        full_name:
          userData?.full_name ??
          (session.user.user_metadata?.full_name as string | undefined) ??
          session.user.email ??
          "User",
        role,
        // Ambil dari user_metadata session, sama seperti navbar
        avatar_url:
          (session.user.user_metadata?.avatar_url as string | undefined) ??
          (session.user.user_metadata?.picture as string | undefined) ??
          null,
      });

      if (role === "hr") {
        const cacheKey = `company_setup_done_${session.user.id}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached === "1") {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/companies/me`,
              { headers: { Authorization: `Bearer ${accessToken}` } },
            );
            if (res.ok) {
              const companyData = (await res.json()) as Company | null;
              if (companyData && companyData.id) {
                setCompany(companyData);
              }
            }
          } catch {
            // Abaikan error, tetap anggap sudah punya company
          }
          setHasCompany(true);
          setLoading(false);
          return;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/companies/me`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );

          if (res.ok) {
            const companyData = (await res.json()) as Company | null;
            if (companyData && companyData.id) {
              setCompany(companyData);
              setHasCompany(true);
              localStorage.setItem(cacheKey, "1");
            } else {
              setHasCompany(false);
            }
          } else {
            setHasCompany(false);
          }
        } catch {
          setHasCompany(false);
        }
      } else {
        setHasCompany(true);
      }

      setLoading(false);
    };

    void init();

    // ── Dengar perubahan auth state (termasuk auto token refresh) ─────
    // Supabase client otomatis refresh token di background selama tab
    // terbuka. Listener ini memastikan state `token` di React selalu
    // ikut ter-update setiap kali itu terjadi, supaya request berikutnya
    // (misalnya update status candidate) selalu pakai token yang fresh.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (newSession?.access_token) {
        setToken(newSession.access_token);
      }
      if (event === "SIGNED_OUT") {
        setToken("");
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    token,
    company,
    setCompany,
    loading,
    hasCompany,
    setHasCompany,
  };
}