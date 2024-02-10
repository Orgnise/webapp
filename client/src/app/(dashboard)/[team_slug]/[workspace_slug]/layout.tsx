"use client";
import Providers from "./providers";
import { ReactNode } from "react";
import WorkspaceView from "@/components/team/workspace/workspace-view";
import { useParams, usePathname } from "next/navigation";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const param = useParams() as { team_slug: string; workspace_slug: string };
  const pathname = usePathname();
  return (
    <Providers>
      {pathname === `/${param?.team_slug}/${param?.workspace_slug}/settings` ? (
        children
      ) : (
        <WorkspaceView>{children}</WorkspaceView>
      )}
    </Providers>
  );
}
