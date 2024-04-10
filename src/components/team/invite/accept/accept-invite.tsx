import { Logo } from "@/components/atom/logo";
import { Button } from "@/components/ui/button";
import { Invite } from "@/lib/types/types";
import { useState } from "react";
import AcceptInviteModal from "./accept-invite-modal";

export default function AcceptInvitationRequest({
  invite,
}: {
  invite?: Invite;
}) {
  const [showAcceptInviteModal, setShowAcceptInviteModal] = useState(true);
  return (
    <div className="flex h-screen flex-col ">
      <div className="my-10 flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-background py-12 shadow-sm">
        <Logo className="h-10" />
        <h1 className="my-3 text-xl font-semibold text-secondary-foreground/80">
          Accept Team Invite
        </h1>
        <p className="z-10 max-w-sm text-center text-sm text-secondary-foreground/70">
          You have been invited to join
          <span className="px-0.5 font-bold text-secondary-foreground">
            {invite?.team?.name}
          </span>
          team. Please accept the invitation to continue.
        </p>
        <div className="flex flex-row gap-6">
          <Button className="mt-6 rounded-full" variant={"outline"}>
            Reject
          </Button>
          <Button
            className="mt-6 rounded-full"
            onClick={() => setShowAcceptInviteModal(true)}
          >
            Accept
          </Button>
        </div>
      </div>
      <AcceptInviteModal
        showAcceptInviteModal={showAcceptInviteModal}
        setShowAcceptInviteModal={setShowAcceptInviteModal}
      />
    </div>
  );
}
