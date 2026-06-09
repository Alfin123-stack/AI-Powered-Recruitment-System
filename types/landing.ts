import { ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Step = {
  num: string;
  title: string;
  desc: string;
  icon: ReactNode;
};

export type Feature = {
  icon: ReactNode;
  title: string;
  badge: string;
  desc: string;
  bullets: string[];
  color: string;
  href: string;
};

export type Problem = {
  icon: ReactNode;
  title: string;
  stat: string;
  statLabel: string;
  desc: string;
};

export type Faq = { q: string; a: string };

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  color: string;
  rating: number;
  tag: string;
};

export type TabCard = {
  icon: ReactNode;
  title: string;
  desc: string;
  href: string;
};


// ── Shared ────────────────────────────────────────────────────────────────────

export interface WithClassName {
  className?: string;
}

// ── FadeIn ────────────────────────────────────────────────────────────────────

export interface FadeInProps extends WithClassName {
  children: ReactNode;
  delay?: number;
  y?: number;
}

// ── Tag ───────────────────────────────────────────────────────────────────────

export interface TagProps extends WithClassName {
  children: ReactNode;
}

// ── Card ──────────────────────────────────────────────────────────────────────

export interface CardProps extends WithClassName {
  children: ReactNode;
}

// ── Problem Card ──────────────────────────────────────────────────────────────

export interface ProblemItem {
  icon: ReactNode;
  title: string;
  stat: string;
  statLabel: string;
  desc: string;
}

// ── Step ──────────────────────────────────────────────────────────────────────

export interface StepItem {
  num: string;
  icon: ReactNode;
  title: string;
  desc: string;
}

// ── Feature ───────────────────────────────────────────────────────────────────

export interface FeatureItem {
  icon: ReactNode;
  badge: string;
  title: string;
  desc: string;
  bullets: string[];
  href: string;
  color: string;
}

// ── Visual Step ───────────────────────────────────────────────────────────────

export interface VisualStepItem {
  num: string;
  title: string;
  desc: string;
  img: string;
  alt: string;
  reverse: boolean;
  color: string;
}

// ── For Who Cards ─────────────────────────────────────────────────────────────

export interface ForWhoCardItem {
  icon: ReactNode;
  title: string;
  desc: string;
  href: string;
}

// ── Mission Card ──────────────────────────────────────────────────────────────

export type MissionCardItem =
  | {
      img: string;
      imgAlt: string;
      overlayColor: string;
      borderColor: string;
      iconBg: string;
      icon: ReactNode;
      titleColor: string;
      title: string;
      desc: string;
      isValues?: false;
      values?: never;
    }
  | {
      img: string;
      imgAlt: string;
      overlayColor: string;
      borderColor: string;
      iconBg: string;
      icon: ReactNode;
      titleColor: string;
      title: string;
      desc?: never;
      isValues: true;
      values: string[];
    };
