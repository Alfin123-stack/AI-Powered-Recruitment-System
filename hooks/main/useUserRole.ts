"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type UserRole = "candidate" | "hr" | null;

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single<{ role: string }>();

      setRole(data?.role === "hr" ? "hr" : "candidate");
      setLoading(false);
    };

    void fetchRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void fetchRole();
    });
    return () => subscription.unsubscribe();
  }, []);

  return { role, loading };
}
