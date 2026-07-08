import { Toaster } from "sonner";

import { Footer } from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />

      {/* Global toast notifications untuk halaman di luar dashboard
          (landing, login, register, dll) */}
      <Toaster
        richColors
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#0a0f0c",
            border: "1px solid rgba(16,185,129,0.15)",
            color: "#e8f0ec",
          },
        }}
      />
    </>
  );
}