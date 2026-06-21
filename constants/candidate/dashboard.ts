export {
  PALETTE_COLORS as CARD_COLORS,
  STATUS_MAP,
  IV_STATUS_MAP,
  DAYS_ID,
  MONTHS_ID,
} from "../shared";

export const FILTER_OPTIONS = [
  { val: "all", label: "All" },
  { val: "applied", label: "Submitted" },
  { val: "review", label: "In Review" },
  { val: "shortlisted", label: "Shortlisted" },
  { val: "rejected", label: "Rejected" },
] as const;

export const TABS = [
  { id: "all", label: "All" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "review", label: "In Review" },
  { id: "applied", label: "Submitted" },
  { id: "rejected", label: "Rejected" },
];

export const INTERVIEW_TIPS = [
  {
    icon: "BookOpen" as const,
    title: "Research the Company",
    desc: "Learn about the company's products, mission, and culture.",
  },
  {
    icon: "Mic" as const,
    title: "Practice Your Answers",
    desc: "Prepare STAR-format answers for behavioral questions.",
  },
  {
    icon: "Target" as const,
    title: "Review the Job Description",
    desc: "Match your experience to the position's requirements.",
  },
  {
    icon: "Lightbulb" as const,
    title: "Prepare Questions",
    desc: "Have 2–3 thoughtful questions ready for your interviewer.",
  },
];