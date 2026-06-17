export const FILTERS_JOB = [
  "Semua",
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
] as const;

export const TYPE_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "Full-time": {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/25",
  },
  Remote: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/25",
  },
  Contract: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/25",
  },
  "Part-time": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/25",
  },
};

export const DEFAULT_TYPE_STYLE = {
  bg: "bg-white/5",
  text: "text-[#7a9585]",
  border: "border-white/10",
};
