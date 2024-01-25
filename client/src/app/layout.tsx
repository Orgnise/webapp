import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Inter as FontSans } from "next/font/google";
import "../styles/global.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>

        <Toaster />
      </body>
    </html>
  );
}
