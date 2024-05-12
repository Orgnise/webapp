"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";

export default function NavLink({
  segment,
  children,
}: {
  segment: string | null;
  children: ReactNode;
}) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const { team_slug, workspace_slug } = useParams() as {
    team_slug?: string;
    workspace_slug: string;
  };

  const href = `${team_slug ? `/${team_slug}` : ""}${workspace_slug ? `/${workspace_slug}` : ""}/settings${
    segment ? `/${segment}` : ""
  }`;

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        "rounded-md p-2.5 text-sm transition-all duration-75 hover:bg-accent ",
        {
          "bg-secondary font-semibold text-secondary-foreground":
            selectedLayoutSegment === segment,
        },
      )}
    >
      {children}
    </Link>
  );
}
