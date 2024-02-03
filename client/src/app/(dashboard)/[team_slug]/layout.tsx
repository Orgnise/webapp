"use client";

import Providers from "./providers";
import { ReactNode } from "react";
import TeamAuth from "./auth";

export default function TeamLayout({ children }: { children: ReactNode }) {
  return <Providers>
    <TeamAuth>
      {children}
    </TeamAuth>;
  </Providers>
}