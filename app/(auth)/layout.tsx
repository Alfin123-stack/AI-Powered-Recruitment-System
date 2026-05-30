// app/(auth)/layout.tsx
import type { Metadata } from "next";
import { AuthLeftPanel, AuthRightPanel } from "@/components/auth/layout";

export const metadata: Metadata = {
  title: "Autentikasi · RecruitAI",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#0a0f0d] font-poppins">
      <AuthLeftPanel />
      <AuthRightPanel>{children}</AuthRightPanel>
    </div>
  );
}
