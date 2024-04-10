"use client";

import Nav from "@/components/layout/nav";
import { NavbarLayout } from "@/components/layout/nav-layout";
import NavTabs from "@/components/layout/teams-nav-tabs";
import { Toaster } from "@/components/ui/toaster";
import useTeam from "@/lib/swr/use-team";
import { ReactNode, Suspense } from "react";
import Providers from "./providers";

export const dynamic = "force-static";

export default function Layout({ children }: { children: ReactNode }) {
  const { team: activeTeam } = useTeam();
  return (
    <Providers>
      <div className="min-h-screen w-full bg-accent/30">
        <NavbarLayout>
          <Nav />
          {activeTeam && activeTeam.role === "owner" && (
            <Suspense fallback={<div className="h-12 w-full" />}>
              <NavTabs />
            </Suspense>
          )}
        </NavbarLayout>
        {children}
        <Toaster />
      </div>
    </Providers>
  );
}
