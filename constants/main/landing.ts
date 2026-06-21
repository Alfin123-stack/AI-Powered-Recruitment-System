import { Faq, Feature, Problem, Step, Testimonial } from "@/types/main/landing";
import {
  Upload,
  Brain,
  BarChart3,
  Target,
  Briefcase,
  Users,
  Building2,
  Clock,
  Scale,
  XCircle,
} from "lucide-react";
import { createElement } from "react";

export const STATS = [
  { value: 5000, suffix: "+", label: "CVs Analyzed", color: "#10b981" },
  { value: 98, suffix: "%", label: "Skill Extraction Accuracy", color: "#06b6d4" },
  { value: 30, suffix: " sec", label: "Average Analysis Time", color: "#f59e0b" },
  { value: 200, suffix: "+", label: "Registered Companies", color: "#8b5cf6" },
];

export const STEPS: Step[] = [
  {
    num: "01",
    icon: createElement(Upload, { size: 20 }),
    title: "Upload Your CV",
    desc: "Upload your CV as a PDF file. The system reads and processes the document automatically — no manual form filling required.",
  },
  {
    num: "02",
    icon: createElement(Brain, { size: 20 }),
    title: "AI Analyzes Your CV",
    desc: "Our AI model extracts skills, experience, and education, then evaluates compatibility with automated screening standards in seconds.",
  },
  {
    num: "03",
    icon: createElement(BarChart3, { size: 20 }),
    title: "Get Your Score & Analysis",
    desc: "The system provides a Resume Score, ATS Score, and Overall Rating with per-category breakdowns that are easy to act on.",
  },
  {
    num: "04",
    icon: createElement(Target, { size: 20 }),
    title: "Find Your Best Job Matches",
    desc: "Skills detected from your CV are automatically used to suggest the most relevant job openings — directly from the Job Matches page.",
  },
];

export const FEATURES: Feature[] = [
  {
    icon: createElement(Brain, { size: 24 }),
    title: "AI-Powered CV Analysis",
    badge: "Smart Analysis",
    color: "#10b981",
    href: "/analyze",
    desc: "Upload a PDF CV and get an in-depth analysis — skill extraction, score evaluation, and concrete improvement recommendations per section.",
    bullets: [
      "Resume Score + ATS Score + Overall Rating",
      "Score breakdown per category (Experience, Education, etc.)",
      "Specific improvement recommendations per CV section",
    ],
  },
  {
    icon: createElement(Briefcase, { size: 24 }),
    title: "Automatic Job Matching",
    badge: "Smart Matching",
    color: "#06b6d4",
    href: "/jobs",
    desc: "Skills detected from your CV are immediately used to match the most relevant job openings — no re-entering information needed.",
    bullets: [
      "Skills automatically detected from your CV",
      "Job suggestions based on your current profile",
      "Browse all active listings in the Jobs directory",
    ],
  },
  {
    icon: createElement(Users, { size: 24 }),
    title: "Recruiter Dashboard",
    badge: "For HR",
    color: "#f59e0b",
    href: "/dashboard/hr",
    desc: "A comprehensive dashboard for HR teams — view all applicants, compare candidate scores, and update statuses in real-time.",
    bullets: [
      "Automatic candidate ranking based on AI scores",
      "Easily shortlist, review, or reject candidates",
      "View original CVs and skill details for each candidate",
    ],
  },
  {
    icon: createElement(Building2, { size: 24 }),
    title: "Company Directory",
    badge: "Company Directory",
    color: "#8b5cf6",
    href: "/company",
    desc: "Candidates can browse companies that are actively hiring, view open positions, and apply directly to available roles.",
    bullets: [
      "Filter companies by city and industry",
      "View active job listings per company",
      "Follow companies you're interested in",
    ],
  },
];

export const PROBLEMS: Problem[] = [
  {
    icon: createElement(Clock, { size: 28 }),
    title: "Manual Screening Takes Too Long",
    stat: "73%",
    statLabel: "HR professionals spend more than 6 hours a day just reading CVs",
    desc: "On average, recruiters spend only 7 seconds per CV. Our AI processes and scores CVs in seconds with a consistency that manual review simply can't match.",
  },
  {
    icon: createElement(Scale, { size: 28 }),
    title: "Subjective and Inconsistent Evaluation",
    stat: "62%",
    statLabel: "Hiring decisions are influenced by unconscious subjective bias",
    desc: "Human judgment is prone to bias. Our system delivers objective, consistent scores based on actual CV content — not first impressions.",
  },
  {
    icon: createElement(XCircle, { size: 28 }),
    title: "CVs Failing the Initial Screening",
    stat: "75%",
    statLabel: "High-quality CVs are rejected by automated systems before an HR ever reads them",
    desc: "Many qualified candidates are eliminated at the first stage. Our ATS Score feature detects issues before you submit, giving you time to fix them.",
  },
];

export const FAQS: Faq[] = [
  {
    q: "What is the CV Analysis feature and how does it work?",
    a: "The CV Analysis feature processes PDF files using an AI model. The system reads the document, identifies skills, experience, and education, then generates a Resume Score (content quality), ATS Score (compatibility with automated screening systems), and Overall Rating along with specific improvement recommendations.",
  },
  {
    q: "Is my CV analysis result saved?",
    a: "Yes, if you're logged in. Your analysis results — including scores, detected skills, and recommendations — are saved to your account and can be accessed at any time. If you're not logged in, the analysis still runs but won't be saved for future sessions.",
  },
  {
    q: "How does Job Matching work after CV analysis?",
    a: "Once analysis is complete, skills detected from your CV are displayed as tags on the results page. You can click 'View Job Matches' to see the most relevant openings based on those skills, or browse all available listings.",
  },
  {
    q: "Is my CV data safe and protected?",
    a: "Your CV is processed locally on your device before being sent for analysis. The original file is stored with multi-layered security so your data is only accessible by your own account.",
  },
  {
    q: "What's the difference between a Candidate and HR account?",
    a: "Candidate accounts can analyze CVs, view job matches, save listings, and track application statuses. HR accounts get access to the recruitment dashboard: viewing all applicants, comparing candidate scores, and updating candidate statuses.",
  },
  {
    q: "Is this platform free to use?",
    a: "CV analysis is available for free to candidates. Simply create an account and upload your CV to get your score and recommendations. For HR team recruitment features, customizable plans are available to fit your company's needs.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I had already applied to 20+ companies without passing the initial screening at all. After using RecruitAI, my ATS Score improved significantly — and I finally landed my first interview within 2 weeks.",
    name: "Rizky Aditya",
    role: "Fresh Graduate",
    company: "Computer Science, Universitas Brawijaya",
    avatar: "RA",
    color: "#10b981",
    rating: 5,
    tag: "Candidate",
  },
  {
    quote:
      "As an HR at a small startup, we don't have time to read 200+ CVs one by one. RecruitAI's dashboard instantly ranks candidates by score — a shortlisting process that used to take 3 days now takes 2 hours.",
    name: "Dinda Maharani",
    role: "HR Manager",
    company: "Inovasi Digital Nusantara",
    avatar: "DM",
    color: "#06b6d4",
    rating: 5,
    tag: "Recruiter",
  },
  {
    quote:
      "The recommendations are very specific — not just 'improve your summary' but actual example sentences I could use. After 3 days of CV revisions, my match score for a Frontend Engineer position improved significantly.",
    name: "Fajar Nugroho",
    role: "Frontend Developer",
    company: "2 years experience, actively job hunting",
    avatar: "FN",
    color: "#8b5cf6",
    rating: 5,
    tag: "Candidate",
  },
  {
    quote:
      "Being able to view candidates' original CVs directly from the dashboard is incredibly helpful — no need to open new tabs or download files one by one. Combining AI scores with direct CV access makes shortlisting decisions far more confident.",
    name: "Budi Santoso",
    role: "Talent Acquisition Lead",
    company: "GoTech Indonesia",
    avatar: "BS",
    color: "#f59e0b",
    rating: 5,
    tag: "Recruiter",
  },
  {
    quote:
      "The most useful part is the automatic job matching after uploading my CV — my skills were matched instantly and the listings that appeared were genuinely relevant. No more manual filtering.",
    name: "Sari Wulandari",
    role: "UI/UX Designer",
    company: "Freelance portfolio, 3 years experience",
    avatar: "SW",
    color: "#ec4899",
    rating: 5,
    tag: "Candidate",
  },
  {
    quote:
      "Candidate rankings based on scores are sorted automatically. Our team can focus only on the best candidates and stop wasting time on those who clearly don't meet the qualifications.",
    name: "Andika Pratama",
    role: "Head of People",
    company: "Fintek Maju",
    avatar: "AP",
    color: "#ef4444",
    rating: 5,
    tag: "Recruiter",
  },
];