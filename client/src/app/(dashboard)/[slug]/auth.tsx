"use client";

import LayoutLoader from "@/components/layout/loyout-loader";
import { ReactNode } from "react";
import TeamNotFound from "@/components/team/team-not-found";
import useTeam from "@/lib/swr/use-team";

export default function TeamAuth({ children }: { children: ReactNode }) {
  const { loading, error } = useTeam();

  if (loading) {
    return <LayoutLoader />;
  }

  if (error) {
    return (
      <div className="bg-background">
        <div className="max-w-3xl mx-auto">
          <TeamNotFound />
        </div>
      </div>
    );
  }

  return children;
}
