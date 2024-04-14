import { Logo } from "@/components/atom/logo";
import { Spinner } from "@/components/atom/spinner";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { APP_DOMAIN } from "@/lib/constants/constants";
import useTeam from "@/lib/swr/use-team";
import { Team } from "@/lib/types/types";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function InviteViaLink({ team }: { team?: Team }) {
  const [resetLinkStatus, setResetLinkStatus] = useState<
    "IDLE" | "LOADING" | "SUCCESS"
  >();

  const { team: activeTeam, updateTeamAsync } = useTeam();
  const inviteLink = useMemo(() => {
    return `${APP_DOMAIN}/invites/${team?.inviteCode}`;
  }, [team?.inviteCode]);

  function resetLink() {
    setResetLinkStatus("LOADING");
    updateTeamAsync({ ...team!, inviteCode: "" }, team?.meta?.slug ?? "")
      .then((data) => {
        toast.success("Invite link reset successfully.");
        setResetLinkStatus("SUCCESS");
      })
      .catch((error) => {
        toast.error("Failed to reset invite link.");
        setResetLinkStatus("IDLE");
      });
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
        <Logo className="h-10" />
        <h3 className="text-lg font-medium">Invite Link</h3>
        <p className="text-center text-sm text-muted-foreground/90">
          Allow other people to join your Team through the link below.
        </p>
      </div>

      <div className="flex w-full flex-col space-y-4 overflow-hidden bg-accent px-4 py-8 text-left sm:px-8">
        <div className="flex items-center justify-between gap-1.5 rounded-md border border-border bg-card px-3 py-1.5">
          <p className="scrollbar-hide overflow-scroll  whitespace-nowrap font-mono text-xs text-muted-foreground">
            {inviteLink}
          </p>
          <CopyButton value={inviteLink} className="rounded-md" />
        </div>
        <Button disabled={resetLinkStatus === "LOADING"} onClick={resetLink}>
          {resetLinkStatus === "LOADING" ? (
            <Spinner className="h-6" />
          ) : (
            "Reset Invite Link"
          )}
        </Button>
      </div>
    </div>
  );
}
