"use client";

import Nav from "@/components/layout/nav";
import { NavbarLayout } from "@/components/layout/nav-layout";
import { ReactNode } from "react";
import Providers from "./providers";

export const dynamic = "force-static";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen w-full bg-accent/30">
        <NavbarLayout>
          <Nav />
        </NavbarLayout>
        {children}
      </div>
    </Providers>
  );
}
