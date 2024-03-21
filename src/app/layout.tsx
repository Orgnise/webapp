import "@/styles/global.css";
import "@/styles/prosemirror.css";

import { ThemeProvider } from "@/components/ui/theme-provider";
import type { Metadata } from "next";
// import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { inter, satoshi } from "@/styles/font";
import { Toaster } from "sonner";

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
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn(
          "h-screen font-sans antialiased",
          satoshi.variable,
          inter.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        <Toaster />
      </body>
    </html>
  );
}
