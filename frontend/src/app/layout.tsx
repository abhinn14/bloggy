import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AppProvider } from "@/context/AppContext";
import React from "react";

export const metadata: Metadata = {
  title: "TechBloggy",
  description: "Share blogs related to Tech!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
            <Navbar />
            {children}
        </AppProvider>
      </body>
    </html>
  );
}
