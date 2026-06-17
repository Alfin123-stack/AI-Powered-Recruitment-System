import { useState, useEffect, useRef } from "react";
import { JobMeta } from "@/types/candidates";

export function useCandidatesJobFilterDropdown({
  jobMetas,
  activeJob,
  totalCount,
  onSelect,
}: {
  jobMetas: JobMeta[];
  activeJob: string;
  totalCount: number;
  onSelect: (job: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = jobMetas.filter((j) =>
    j.label.toLowerCase().includes(search.toLowerCase()),
  );
  const activeJobMeta = jobMetas.find((j) => j.key === activeJob);
  const activeColor = activeJobMeta?.color ?? "#10b981";
  const activeLabel =
    activeJob === "all"
      ? "All Positions"
      : (activeJobMeta?.label ?? "All Positions");
  const activeCount =
    activeJob === "all" ? totalCount : (activeJobMeta?.count ?? 0);

  const toggleOpen = () => setOpen((v) => !v);

  const handleSelect = (job: string) => {
    onSelect(job);
    setOpen(false);
    setSearch("");
  };

  return {
    open,
    search,
    setSearch,
    ref,
    inputRef,
    filtered,
    activeColor,
    activeLabel,
    activeCount,
    toggleOpen,
    handleSelect,
  };
}
