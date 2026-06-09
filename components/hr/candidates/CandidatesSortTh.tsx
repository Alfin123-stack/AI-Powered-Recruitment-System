"use client";

import { SortDir } from "@/types/candidates";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export function CandidatesSortTh({
  label,
  sortKey: key,
  currentKey,
  dir,
  onSort,
}: {
  label: string;
  sortKey: string;
  currentKey: string;
  dir: SortDir;
  onSort: (k: string) => void;
}) {
  const active = currentKey === key;
  return (
    <th
      className="text-left px-4 py-[11px] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
      style={{ color: active ? "#10b981" : "#7a9585" }}
      onClick={() => onSort(key)}>
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          dir === "asc" ? (
            <ArrowUp size={10} />
          ) : (
            <ArrowDown size={10} />
          )
        ) : (
          <ArrowUpDown size={9} className="opacity-30" />
        )}
      </div>
    </th>
  );
}
