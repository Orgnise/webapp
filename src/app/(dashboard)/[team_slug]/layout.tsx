"use client";

import { ReactNode } from "react";
import TeamAuth from "./auth";
import Providers from "./providers";

export default function TeamLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <TeamAuth>{children}</TeamAuth>;
    </Providers>
  );
}
