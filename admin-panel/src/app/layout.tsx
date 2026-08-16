import type { Metadata } from "next";
import "./globals.css";
import { AdminShell } from "@/components/auth/admin-shell";

export const metadata: Metadata = {
  title: "SarthixOS Admin",
  description: "Admin panel for SarthixOS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background"><AdminShell>{children}</AdminShell></body>
    </html>
  );
}
