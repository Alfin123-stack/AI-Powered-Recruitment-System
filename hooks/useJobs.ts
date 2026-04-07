"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getColor } from "@/lib/utils";
import { DEMO_JOBS } from "@/lib/constants";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function useJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    // fetch jobs
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API}/api/jobs`);
        if (!res.ok) throw new Error("Gagal fetch");

        const data = await res.json();

        setJobs(
          data.map((j: any, i: number) => ({
            ...j,
            color: getColor(i),
          })),
        );
      } catch {
        setJobs(DEMO_JOBS);
      } finally {
        setLoading(false);
      }
    };

    // cek session
    const checkSession = async () => {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();

      setSession(s);
      setSessionLoading(false);
    };

    fetchJobs();
    checkSession();
  }, [API, DEMO_JOBS, getColor]);

  // filter logic dipindah ke sini
  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.companies?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (j.skills || []).some((s: string) =>
        s.toLowerCase().includes(search.toLowerCase()),
      );

    const matchFilter =
      filter === "Semua" || j.location?.includes(filter) || j.type === filter;

    return matchSearch && matchFilter;
  });

  return {
    jobs,
    loading,
    search,
    setSearch,
    filter,
    setFilter,
    filtered,
  };
}
