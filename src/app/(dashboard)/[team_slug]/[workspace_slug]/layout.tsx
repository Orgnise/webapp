"use client";
import WorkspaceView from "@/components/team/workspace/workspace-view";
import { useParams, usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const param = useParams() as { team_slug: string; workspace_slug: string };
  const pathname = usePathname();
  return pathname?.includes(
    `/${param?.team_slug}/${param?.workspace_slug}/settings`,
  ) ? (
    children
  ) : (
    <WorkspaceView>{children}</WorkspaceView>
  );
}
