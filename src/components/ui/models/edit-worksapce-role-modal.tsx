import { Logo } from "@/components/atom/logo";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Modal } from "@/components/ui/model";
import { useToast } from "@/components/ui/use-toast";
import { WorkspaceRole } from "@/lib/constants/workspace-role";
import useTeam from "@/lib/swr/use-team";
import useWorkspaces from "@/lib/swr/use-workspaces";
import { WorkspaceMemberProps } from "@/lib/types/types";
import { useParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { mutate } from "swr";

function EditWorkspaceRoleModal({
  showEditRoleModal,
  setShowEditRoleModal,
  user,
  role,
}: {
  showEditRoleModal: boolean;
  setShowEditRoleModal: Dispatch<SetStateAction<boolean>>;
  user: WorkspaceMemberProps;
  role: WorkspaceRole;
}) {
  const { workspace_slug } = useParams() as { workspace_slug: string };
  const [editing, setEditing] = useState(false);
  const { team } = useTeam();
  const { workspaces } = useWorkspaces();
  const workspace = workspaces?.find((w) => w?.meta?.slug === workspace_slug);
  const { _id, name, email } = user;
  const { toast } = useToast();

  return (
    <Modal showModal={showEditRoleModal} setShowModal={setShowEditRoleModal}>
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
        <Logo className="h-10" />
        <h3 className="text-lg font-medium">Change Member Role</h3>
        <p className="text-center text-sm text-secondary-foreground/70">
          This will change{" "}
          <b className="text-secondary-foreground">{name || email}</b>
          &apos;s role in{" "}
          <b className="text-secondary-foreground">{workspace?.name}</b> to{" "}
          <b className="text-secondary-foreground">{role}</b>. Are you sure you
          want to continue?
        </p>
      </div>

      <div className="flex flex-col space-y-4 bg-accent px-4 py-8 text-left sm:px-16">
        <div className="flex items-center space-x-3 rounded-md border border-border bg-background p-3">
          <Avatar user={user} />
          <div className="flex flex-col">
            <h3 className="text-sm font-medium">{name || email}</h3>
            <p className="text-xs text-secondary-foreground/70">{email}</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditing(true);
            fetch(`/api/teams/${team?.meta?.slug}/${workspace_slug}/users`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: _id,
                role,
              }),
            }).then(async (res) => {
              if (res.status === 200) {
                await mutate(
                  `/api/teams/${team?.meta?.slug}/${workspace_slug}/users`,
                );
                setShowEditRoleModal(false);
                toast({
                  description: `Successfully changed ${name || email}'s role to ${role}.`,
                });
              } else {
                const { error } = await res.json();
                toast({
                  description: error.message,
                  variant: "destructive",
                });
              }
              setEditing(false);
            });
          }}
        >
          {editing ? (
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

export function useEditWorkspaceModal({
  user,
  role,
}: {
  user: WorkspaceMemberProps;
  role: WorkspaceRole;
}) {
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);

  const EditWorkspaceRoleModalCallback = useCallback(() => {
    return (
      <EditWorkspaceRoleModal
        showEditRoleModal={showEditRoleModal}
        setShowEditRoleModal={setShowEditRoleModal}
        user={user}
        role={role}
      />
    );
  }, [setShowEditRoleModal, showEditRoleModal, user, role]);

  return useMemo(
    () => ({
      setShowEditRoleModal,
      EditWorkspaceMembersRoleModal: EditWorkspaceRoleModalCallback,
    }),
    [setShowEditRoleModal, EditWorkspaceRoleModalCallback],
  );
}
