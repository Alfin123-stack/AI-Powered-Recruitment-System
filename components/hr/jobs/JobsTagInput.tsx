"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface JobsTagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  chipColor?: "emerald" | "green" | "blue";
}

export function JobsTagInput({
  value,
  onChange,
  placeholder,
  chipColor = "emerald",
}: JobsTagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.replace(",", "").trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "" && value.length)
      onChange(value.slice(0, -1));
  };

  const chipCls =
    chipColor === "green"
      ? "bg-green-500/10 text-green-400 border border-green-500/20"
      : chipColor === "blue"
        ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

  return (
    <div
      className="flex flex-wrap gap-[6px] bg-[#080f0b] border border-emerald-500/15 rounded-[10px] px-3 py-2 cursor-text focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/8 transition-all min-h-[42px]"
      onClick={(e) =>
        (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()
      }>
      {value.map((tag) => (
        <span
          key={tag}
          className={`inline-flex items-center gap-1 pl-[9px] pr-[6px] py-[3px] rounded-[6px] text-[11px] font-medium ${chipCls}`}>
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="flex items-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label={`remove ${tag}`}>
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => input.trim() && addTag(input)}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[160px] bg-transparent outline-none text-[0.83rem] text-[#e8f0ec] placeholder:text-[#2d4a38]"
      />
    </div>
  );
}
