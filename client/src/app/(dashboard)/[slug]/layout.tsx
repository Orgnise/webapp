import { ReactNode } from "react";
import TeamAuth from "./auth";

export default function TeamLayout({ children }: { children: ReactNode }) {
  return <TeamAuth>{children}</TeamAuth>;
}
