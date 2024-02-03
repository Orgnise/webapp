"use client";

import { ReactNode, useContext } from "react";

import LayoutLoader from "@/components/layout/loyout-loader";
import { TeamContext } from "./providers";
import TeamNotFound from "@/components/team/team-not-found";

export default function TeamAuth({ children }: { children: ReactNode }) {
  let { teamData: { loading, error } } = useContext(TeamContext);


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
