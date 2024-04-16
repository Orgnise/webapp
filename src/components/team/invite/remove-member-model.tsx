import { Logo } from "@/components/atom/logo";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Modal } from "@/components/ui/model";
import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/fetcher";
import useTeam from "@/lib/swr/use-team";
import { UserProps } from "@/lib/types/types";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";

import { mutate } from "swr";

export default function RemoveTeamMemberModal({
  showRemoveTeammateModal,
  setShowRemoveTeammateModal,
  user,
  invite,
}: {
  showRemoveTeammateModal: boolean;
  setShowRemoveTeammateModal: Dispatch<SetStateAction<boolean>>;
  user: UserProps;
  invite?: boolean;
}) {
  // const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const { team } = useTeam();
  const { name: workspaceName } = team;
  const { data: session } = useSession();
  const { _id, name, email } = user;
  const { toast } = useToast();

  const handleRemoveTeammate = async () => {
    setRemoving(true);
    fetcher(
      `/api/teams/${team?.meta?.slug}/${
        invite
          ? `invites?email=${encodeURIComponent(email)}`
          : `users?userId=${user._id}`
      }`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      },
    )
      .then(async (res) => {
        await mutate(
          `/api/teams/${team?.meta?.slug}/${invite ? "invites" : "users"}`,
        );
        if (session?.user?.email === email) {
          await mutate("/api/teams");
          // router.push("/");
        } else {
          setShowRemoveTeammateModal(false);
        }

        toast({
          description:
            session?.user?.email === email
              ? "You have left the Team!"
              : invite
                ? "Successfully revoked invitation!"
                : "Successfully removed teammate!",
        });
        setRemoving(false);
      })
      .catch((error) => {
        console.error(error);
        toast({
          description:
            error?.message ??
            "Something went wrong. Please try again in some time.",
          variant: "destructive",
        });
        setRemoving(false);
      });
  };

  return (
    <Modal
      showModal={showRemoveTeammateModal}
      setShowModal={setShowRemoveTeammateModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
        <Logo className="h-10" />

        <h3 className="text-lg font-medium">
          {invite
            ? "Revoke Invitation"
            : session?.user?.email === email
              ? "Leave Workspace"
              : "Remove Team member"}
        </h3>
        <p className="text-center text-sm text-secondary-foreground/70">
          {invite
            ? "This will revoke "
            : session?.user?.email === email
              ? "You're about to leave "
              : "This will remove "}
          <span className="font-semibold ">
            {session?.user?.email === email ? workspaceName : name || email}
          </span>
          {invite
            ? "'s invitation to join your team. "
            : session?.user?.email === email
              ? ". You will lose all access to this team. "
              : " from your team. "}
          Are you sure you want to continue?
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-accent px-4 py-8 text-left sm:px-16">
        <div className="flex items-center space-x-3 rounded-md border border-border bg-background p-3">
          <Avatar user={user} />
          <div className="scrollbar-hide flex flex-col overflow-scroll">
            <h3 className="text-sm font-medium">{name || email}</h3>
            <p className="text-xs text-secondary-foreground/70">{email}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleRemoveTeammate}>
          {removing ? (
            <>
              <LoadingSpinner />
            </>
          ) : (
            <>Confirm</>
          )}
        </Button>
      </div>
    </Modal>
  );
}
