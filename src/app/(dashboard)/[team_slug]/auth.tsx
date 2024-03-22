"use client";

import { ReactNode, useContext } from "react";

import LayoutLoader from "@/components/layout/loyout-loader";
import NotFoundView from "@/components/team/team-not-found";
import { TeamContext } from "./providers";

export default function TeamAuth({ children }: { children: ReactNode }) {
  let {
    teamData: { loading, error },
  } = useContext(TeamContext);

  if (loading) {
    return <LayoutLoader />;
  }

  if (error) {
    return (
      <div className="bg-background">
        <div className="mx-auto max-w-3xl">
          <NotFoundView item="Team" />
        </div>
      </div>
    );
  }

  return children;
}
