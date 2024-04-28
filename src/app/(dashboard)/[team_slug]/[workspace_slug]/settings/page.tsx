"use client";
import { Logo } from "@/components/atom/logo";
import { Spinner } from "@/components/atom/spinner";
import { P } from "@/components/atom/typography";
import NotFoundView from "@/components/team/team-not-found";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useTeam from "@/lib/swr/use-team";
import useWorkspaces from "@/lib/swr/use-wrorkspaces";
import { useContext, useState } from "react";
import { mutate } from "swr";
import { TeamContext } from "../../providers";

export default function WorkspaceSettingsPage() {
  const {
    workspacesData: { activeWorkspace, error, loading },
  } = useContext(TeamContext);
  const { team: activeTeam } = useTeam();

  if (loading) {
    return <div>Loading...</div>;
  } else if (error || !activeWorkspace) {
    return (
      <div className="WorkspaceSettingsPage h-full w-full py-12">
        <NotFoundView item="Workspace" />
      </div>
    );
  }
  return (
    <div className="WorkspaceSettings">
      <div className="mx-auto flex max-w-screen-md flex-col gap-8 px-4">
        <WorkspaceName />
        <WorkspaceDescription />
        <WorkspaceSlug />
        <DeleteWorkspace />
      </div>
    </div>
  );
}

function WorkspaceName() {
  const { toast } = useToast();
  const {
    workspacesData: { activeWorkspace, error, loading },
  } = useContext(TeamContext);

  const { updateWorkspace } = useWorkspaces();

  return (
    <Form
      title={"Workspace Name"}
      description={"This is the name of your workspace"}
      inputAttrs={{
        name: "name",
        defaultValue: loading ? undefined : activeWorkspace?.name || "",
        placeholder: "My workspace",
        maxLength: 32,
      }}
      helpText="Max 32 characters."
      handleSubmit={(data) =>
        updateWorkspace(
          {
            name: data?.name,
          },
          activeWorkspace?.meta?.slug!,
        ).then(() => {
          toast({
            title: "Success!",
            description: "Team description updated successfully",
          });
          // mutate(`/api/teams/${activeWorkspace?.meta?.slug}/workspaces`);
        })
      }
      buttonText="Save changes"
      // disabledTooltip={
      //   checkPermissions(team.role, "UPDATE_TEAM_INFO")
      //     ? undefined
      //     : "Only the team owner can update the team name"
      // }
    />
  );
}

function WorkspaceSlug() {
  const { toast } = useToast();
  const {
    workspacesData: { activeWorkspace, error, loading },
  } = useContext(TeamContext);
  const { updateWorkspace } = useWorkspaces();
  return (
    <Form
      title={"Workspace Slug"}
      description={"This is your workspace's unique slug"}
      inputAttrs={{
        name: "slug",
        defaultValue: loading ? undefined : activeWorkspace?.meta?.slug || "",
        placeholder: "my-workspace-slug",
        maxLength: 48,
      }}
      helpText="Only lowercase letters, numbers, and dashes. Max 48 characters."
      handleSubmit={(data) =>
        updateWorkspace(
          {
            slug: data?.slug,
          },
          activeWorkspace?.meta?.slug!,
        ).then(() => {
          toast({
            title: "Success!",
            description: "Workspace slug updated successfully",
          });
          // mutate(`/api/teams/${activeWorkspace?.meta?.slug}/workspaces`);
        })
      }
      buttonText="Save changes"
      // disabledTooltip={
      //   checkPermissions(team.role, "UPDATE_TEAM_INFO")
      //     ? undefined
      //     : "Only the team owner can update the team description"
      // }
    />
  );
}

function WorkspaceDescription() {
  const { toast } = useToast();

  const {
    workspacesData: { activeWorkspace, error, loading },
  } = useContext(TeamContext);
  const { updateWorkspace } = useWorkspaces();
  return (
    <Form
      title={"Description"}
      description={"This is the description of your workspace."}
      inputAttrs={{
        name: "description",
        defaultValue: loading ? undefined : activeWorkspace?.description || "",
        placeholder: "A workspace for the engineering team.",
        maxLength: 120,
      }}
      helpText="Max 120 characters."
      handleSubmit={(data) =>
        updateWorkspace(
          {
            description: data?.description,
          },
          activeWorkspace?.meta?.slug!,
        ).then(() => {
          toast({
            title: "Success!",
            description: "Team description updated successfully",
          });
          mutate(`/api/teams/${activeWorkspace?.meta?.slug}/workspaces`);
        })
      }
      buttonText="Save changes"
      // disabledTooltip={
      //   checkPermissions(team.role, "UPDATE_TEAM_INFO")
      //     ? undefined
      //     : "Only the team owner can update the team description"
      // }
    />
  );
}

function DeleteWorkspace() {
  return (
    <div className="rounded-lg border border-destructive bg-card">
      <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium">Delete workspace</h2>
          <P className="text-muted-foreground">
            Permanently delete your workspace, and all associated collections +
            their items. This action cannot be undone - please proceed with
            caution.
          </P>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-4 rounded-b-lg border-t border-destructive bg-accent/20 p-3 sm:px-10">
        <DeleteWorkspaceModel>
          <Button variant={"destructive"} type="button">
            <p>Delete workspace</p>
          </Button>
        </DeleteWorkspaceModel>
      </div>
    </div>
  );
}

interface CerateWorkspaceModelProps {
  children: React.ReactNode;
}

function DeleteWorkspaceModel({ children }: CerateWorkspaceModelProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    workspacesData: { activeWorkspace, error, loading },
    deleteWorkspace,
  } = useContext(TeamContext);

  function handleDeleteWorkspace(e: any) {
    e.preventDefault();

    setIsDeleting(true);
    deleteWorkspace(activeWorkspace?.meta?.slug!).finally(() => {
      setIsDeleting(false);
    });
  }

  return (
    <form onSubmit={handleDeleteWorkspace}>
      <Dialog modal={true}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="border-border p-0 sm:max-w-[425px]">
          <DialogHeader className="flex flex-col  gap-4 px-8 pb-4 pt-8">
            <Logo className="h-10" />
            <DialogTitle className="text-center">Delete workspace</DialogTitle>
            <DialogDescription className="text-center">
              <P className="text-muted-foreground">
                Permanently delete your workspace, and all associated
                collections + their items.
              </P>
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col space-y-6 bg-secondary/60 px-4 py-8 text-left sm:px-8">
            <div>
              <label
                htmlFor="workspace-slug"
                className="block select-none text-sm font-medium text-muted-foreground"
              >
                Enter the workspace slug
                <span className="cursor-text select-text px-1 font-semibold text-secondary-foreground">
                  {activeWorkspace?.meta?.slug}
                </span>
                to continue:
              </label>
              <div className="relative mt-1 rounded-md ">
                <Input
                  id="workspace-slug"
                  pattern={activeWorkspace?.meta?.slug}
                  type="text"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="verification"
                className="block select-none text-sm text-muted-foreground"
              >
                To verify, type{" "}
                <span className="cursor-text select-text font-semibold text-secondary-foreground">
                  confirm delete workspace
                </span>{" "}
                below
              </label>
              <div className="relative mt-1 rounded-md ">
                <Input
                  id="verification"
                  pattern="confirm delete workspace"
                  type="text"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="group flex h-10 w-full items-center justify-center space-x-2 rounded-md border border-destructive bg-destructive px-4 text-sm text-destructive-foreground transition-all hover:bg-destructive-foreground hover:text-destructive"
            >
              {isDeleting ? <Spinner /> : <p>Confirm delete workspace</p>}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </form>
  );
}
