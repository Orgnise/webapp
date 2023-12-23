import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulse",
  description:
    "Streamline your work with our all-in-one knowledge, doc, and project.",
  keywords:
    "Pulse, Knowledge, Doc, Project, Streamline, Work, All-in-one,Project management, Documentation, Tool, Software, Online tool",
  openGraph: {
    url: "https://pulsehq.vercel.app",
    description:
      "Streamline your work with our all-in-one knowledge, doc, and project.",
    title: "Pulse",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
