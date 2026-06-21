import { SecurityBadge } from "@/types/auth/auth";
import {
  Lock,
  ShieldCheck,
  DatabaseZap,
  BrainCircuit,
  Target,
  Zap,
} from "lucide-react";

export const DEFAULT_BADGES: SecurityBadge[] = [
  {
    icon: Lock,
    label: "SSL Encrypted",
    iconColor: "#0F6E56",
  },
  {
    icon: ShieldCheck,
    label: "PDPA Compliant",
    iconColor: "#185FA5",
  },
  {
    icon: DatabaseZap,
    label: "Secure Data",
    iconColor: "#534AB7",
  },
];

export const FEATURES = [
  {
    icon: BrainCircuit,
    label: "AI-powered CV analysis in 30 seconds",
    sub: "Automatic skill extraction, scoring, and recommendations",
  },
  {
    icon: Target,
    label: "Automatic job matching based on your profile",
    sub: "Match with hundreds of relevant job openings",
  },
  {
    icon: Zap,
    label: "10× faster recruitment for HR teams",
    sub: "Rank candidates, shortlist, and update statuses",
  },
];

export const STATS = [
  { value: "5,000+", label: "CVs Analyzed" },
  { value: "200+", label: "Companies" },
  { value: "98%", label: "AI Accuracy" },
];

export const STEP_META = [
  { title: "Basic Information", sub: "Full name & email address" },
  { title: "Account Security", sub: "Create a strong password" },
  { title: "Choose Your Role", sub: "Are you a candidate or HR?" },
] as const;

export const TOTAL_STEPS = 3;