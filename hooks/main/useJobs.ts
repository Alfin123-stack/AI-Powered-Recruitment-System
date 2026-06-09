"use client";

import { useEffect, useState, useMemo } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getColor } from "@/lib/utils";
import { Job } from "@/types/jobs";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type JobWithColor = Job & { color: string };

interface UseJobsReturn {
  jobs: JobWithColor[];
  loading: boolean;
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
  filtered: JobWithColor[];
  session: Session | null;
  sessionLoading: boolean;
}

export function useJobs(): UseJobsReturn {
  const [jobs, setJobs] = useState<JobWithColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch(`${API}/api/jobs`);
        if (!res.ok) throw new Error("Gagal fetch jobs");
        const data: Job[] = await res.json();
        setJobs(data.map((j, i) => ({ ...j, color: getColor(i) })));
      } catch (err) {
        console.error("fetchJobs:", err);
      } finally {
        setLoading(false);
      }
    }

    async function checkSession() {
      const {
        data: { session: s },
      } = await supabase.auth.getSession();
      setSession(s);
      setSessionLoading(false);
    }

    fetchJobs();
    checkSession();
  }, []); // API dan getColor adalah konstanta modul, aman tanpa deps

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter((j) => {
      const matchSearch =
        j.title?.toLowerCase().includes(q) ||
        j.companies?.name?.toLowerCase().includes(q) ||
        (j.skills ?? []).some((s) => s.toLowerCase().includes(q));
      const matchFilter =
        filter === "Semua" || j.location?.includes(filter) || j.type === filter;
      return matchSearch && matchFilter;
    });
  }, [jobs, search, filter]);

  return {
    jobs,
    loading,
    search,
    setSearch,
    filter,
    setFilter,
    filtered,
    session,
    sessionLoading,
  };
}
