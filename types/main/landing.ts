import { ReactNode } from "react";

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

/** @deprecated Gunakan `ProblemItem` */
export type Problem = ProblemItem;

// ── Step ──────────────────────────────────────────────────────────────────────

export interface StepItem {
  num: string;
  icon: ReactNode;
  title: string;
  desc: string;
}

/** @deprecated Gunakan `StepItem` */
export type Step = StepItem;

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

/** @deprecated Gunakan `FeatureItem` */
export type Feature = FeatureItem;

// ── Faq ───────────────────────────────────────────────────────────────────────

export type Faq = { q: string; a: string };

// ── Testimonial ───────────────────────────────────────────────────────────────

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

// ── Tab Card ──────────────────────────────────────────────────────────────────

export type TabCard = {
  icon: ReactNode;
  title: string;
  desc: string;
  href: string;
};

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
