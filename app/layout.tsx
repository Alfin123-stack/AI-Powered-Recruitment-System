// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RecruitAI — Smarter Hiring, Powered by AI",
    template: "%s · RecruitAI",
  },
  description:
    "Platform rekrutmen berbasis AI yang menganalisis ribuan CV secara otomatis, efisien, dan akurat. Didukung oleh Google Gemini AI.",
  keywords: [
    "AI recruitment",
    "resume analyzer",
    "job matching",
    "HR automation",
    "Gemini AI",
  ],
  authors: [{ name: "RecruitAI Team" }],
  creator: "RecruitAI",
  metadataBase: new URL("https://airecruit.ai"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://airecruit.ai",
    siteName: "RecruitAI",
    title: "RecruitAI — Smarter Hiring, Powered by AI",
    description:
      "Analisis CV otomatis, job matching cerdas, dan rekrutmen lebih cepat dengan kecerdasan buatan.",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "RecruitAI" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RecruitAI — Smarter Hiring, Powered by AI",
    description: "Analisis CV otomatis dengan Google Gemini AI.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
