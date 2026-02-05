/* ==========================================================================
   Root Layout Component
   FreelanceFlow SaaS Dashboard
   ========================================================================== */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmDialogProvider } from "@/components/ui/ConfirmDialog";
import { ProjectProvider } from "@/contexts/ProjectContext";

// ==========================================================================
// Font Configuration
// ==========================================================================

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ==========================================================================
// Metadata Configuration
// ==========================================================================

export const metadata: Metadata = {
  title: "FreelanceFlow - Dashboard",
  description: "Modern SaaS dashboard for freelancers to manage clients, projects, and invoices",
  keywords: ["freelance", "dashboard", "invoices", "projects", "clients"],
};

// ==========================================================================
// Root Layout Component
// ==========================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ProjectProvider>
          <ToastProvider>
            <ConfirmDialogProvider>
              {children}
            </ConfirmDialogProvider>
          </ToastProvider>
        </ProjectProvider>
      </body>
    </html>
  );
}
