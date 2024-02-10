"use client";

import Nav from "@/components/layout/nav";
import { NavbarLayout } from "@/components/layout/nav-layout";
import Providers from "./providers";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-static";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen w-full bg-accent/15">
        <NavbarLayout>
          <Nav />
        </NavbarLayout>
        {children}
      </div>
      <Toaster />
    </Providers>
  );
}
