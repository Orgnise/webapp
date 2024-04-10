import { Logo } from "@/components/atom/logo";
import { Spinner } from "@/components/atom/spinner";
import { Modal } from "@/components/ui/model";
import useTeam from "@/lib/swr/use-team";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export default function AcceptInviteModal({
  showAcceptInviteModal,
  setShowAcceptInviteModal,
}: {
  showAcceptInviteModal: boolean;
  setShowAcceptInviteModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { team_slug } = useParams() as { team_slug: string };
  const [accepting, setAccepting] = useState(false);
  const { error } = useTeam();

  return (
    <Modal
      showModal={showAcceptInviteModal}
      setShowModal={setShowAcceptInviteModal}
      preventDefaultClose
    >
      {error?.status === 409 ? (
        <>
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
            <Logo className="h-20" />
            <h3 className="text-lg font-medium">Team Invitation</h3>
            <p className="text-center text-sm text-secondary-foreground/70">
              You&apos;ve been invited to join and collaborate on the{" "}
              <span className="font-mono text-purple-600">
                {team_slug || "......"}
              </span>{" "}
              team on {process.env.NEXT_PUBLIC_APP_NAME}
            </p>
          </div>
          <div className="flex flex-col space-y-6 bg-accent/50 px-4 py-8 text-left sm:px-16">
            <button
              onClick={() => {
                setAccepting(true);
                fetch(`/api/teams/${team_slug}/invites/accept`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                }).then(async (res: Response) => {
                  if (!res.ok) {
                    toast.error("Failed to accept invite. Please try again.");
                    setAccepting(false);
                    return;
                  }
                  await Promise.all([
                    mutate("/api/teams"),
                    mutate(`/api/teams/${team_slug}`),
                  ]);
                  setShowAcceptInviteModal(false);
                  toast.success("You now are a part of this team!");
                });
              }}
              disabled={accepting}
              className={`${
                accepting
                  ? "cursor-not-allowed border-border bg-gray-100 text-gray-400"
                  : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-gray-700"
              } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
            >
              {accepting ? <Spinner /> : <p>Accept invite</p>}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
            <Logo />
            <h3 className="text-lg font-medium">Team Invitation Expired</h3>
            <p className="text-center text-sm text-secondary-foreground/70">
              This invite has expired or is no longer valid.
            </p>
          </div>
          <div className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16">
            <Link
              href="/"
              className="flex h-10 w-full items-center justify-center rounded-md border border-black bg-black text-sm text-white transition-all hover:bg-white hover:text-black focus:outline-none"
            >
              Back to dashboard
            </Link>
          </div>
        </>
      )}
    </Modal>
  );
}
