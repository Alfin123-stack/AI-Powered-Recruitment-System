"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { DashboardUser } from "@/types/dashboard";
import { Company } from "@/types/company";

export function useDashboardInit() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [token, setToken] = useState<string>("");
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasCompany, setHasCompany] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

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
      });

      if (role === "hr") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/companies/me`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );

          if (res.ok) {
            const companyData = (await res.json()) as Company | null;
            if (companyData) {
              setCompany(companyData);
              setHasCompany(true);
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
