"use client";

import { ReactNode } from "react";

import LayoutLoader from "@/components/layout/loyout-loader";
import AcceptInvitationRequest from "@/components/team/invite/accept/accept-invite";
import NotFoundView from "@/components/team/team-not-found";
import useTeam from "@/lib/swr/use-team";
import { Invite } from "@/lib/types/types";

export default function TeamAuth({ children }: { children: ReactNode }) {
  const { loading, error } = useTeam();

  if (loading) {
    return <LayoutLoader />;
  } else if (error?.status === 409 && error?.invite) {
    const { invite } = error as { invite?: Invite };
    // Pending team invite
    return (
      <div className="container mx-auto bg-card lg:max-w-3xl">
        <AcceptInvitationRequest invite={invite} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto bg-card lg:max-w-3xl">
        <NotFoundView item="Team" />
      </div>
    );
  }

  return children;
}
