import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AICTE Grievance360 - Smart Redressal Portal",
  description: "One Institution. One Unified View. Complete Accountability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-100 selection:text-orange-900 font-sans">
        {children}
      </body>
    </html>
  );
}
