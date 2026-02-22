// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// Use the Inter font, standard for modern SaaS apps
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shortify | Professional SaaS URL Shortener",
  description: "A powerful SaaS platform to create branded short links, monitor click analytics, and optimize your digital reach.",
  keywords: ["URL shortener", "link management", "analytics", "SaaS"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-50 antialiased selection:bg-blue-500/30`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}