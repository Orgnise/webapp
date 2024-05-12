"use client";
import { Logo } from "@/components/atom/logo";
import { Spinner } from "@/components/atom/spinner";
import { P } from "@/components/atom/typography";
import TeamPermissionView from "@/components/molecule/team-permisson-view";
import NotFoundView from "@/components/team/team-not-found";
import UploadLogo from "@/components/team/upload-logo";
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
import { checkPermissions } from "@/lib/constants/team-role";
import useTeam from "@/lib/swr/use-team";
import { useState } from "react";
import { mutate } from "swr";
import TeamSettingsLoading from "./loading";

export default function TeamSettingsPage() {
  const { activeTeam, loading, error } = useTeam();

  if (loading) {
    return <TeamSettingsLoading />;
  } else if (error || !activeTeam) {
    return (
      <div className="TeamSettingsPage h-full w-full py-12">
        <NotFoundView item="Team" />
      </div>
    );
  }
  return (
    <div className="TeamSettingsPage">
      <div className="mx-auto  grid max-w-screen-md flex-col gap-8 px-4 ">
        <TeamName />
        <TeamSlug />
        <TeamDescription />
        <UploadLogo />
        <DeleteTeam />
      </div>
    </div>
  );
}

function TeamName() {
  const { activeTeam, error, loading, updateTeamAsync } = useTeam();

  const { toast } = useToast();

  return (
    <Form
      title={"Name"}
      description={"This is the name of your team on Orgnise"}
      inputAttrs={{
        name: "name",
        defaultValue: loading ? undefined : activeTeam?.name || "",
        placeholder: "Acme Inc.",
        maxLength: 32,
      }}
      helpText="Max 32 characters."
      handleSubmit={(data) =>
        updateTeamAsync(
          {
            name: data?.name,
          },
          activeTeam!.meta.slug,
        ).then(() => {
          toast({
            title: "Success!",
            description: "Team name updated successfully",
          });
          mutate(`/api/teams`);
        })
      }
      buttonText="Save changes"
      disabledTooltip={
        checkPermissions(activeTeam?.role, "UPDATE_TEAM_INFO")
          ? undefined
          : "Only the team owner can update the team name"
      }
    />
  );
}

function TeamSlug() {
  const { activeTeam, error, loading, updateTeamAsync } = useTeam();
  const { toast } = useToast();

  return (
    <Form
      title={"Slug"}
      description={"This is your team's unique slug on Orgnise"}
      inputAttrs={{
        name: "slug",
        defaultValue: loading ? undefined : activeTeam?.meta?.slug || "",
        placeholder: "acme-inc",
        maxLength: 48,
      }}
      helpText="Max 48 characters."
      handleSubmit={(data) =>
        updateTeamAsync(
          {
            slug: data?.slug,
          },
          activeTeam!.meta.slug,
        ).then(() => {
          toast({
            title: "Success!",
            description: "Team slug updated successfully",
          });
          mutate(`/api/teams`);
        })
      }
      buttonText="Save changes"
      disabledTooltip={
        checkPermissions(activeTeam?.role, "UPDATE_TEAM_INFO")
          ? undefined
          : "Only the team owner can update the team slug"
      }
    />
  );
}

function TeamDescription() {
  const { activeTeam, error, loading, updateTeamAsync } = useTeam();
  const { toast } = useToast();

  return (
    <Form
      title={"Description"}
      description={"This is the description of your team on Orgnise"}
      inputAttrs={{
        name: "description",
        defaultValue: loading ? undefined : activeTeam?.description || "",
        placeholder: "Acme Inc. is a software company...",
        maxLength: 120,
      }}
      helpText="Max 120 characters."
      handleSubmit={(data) =>
        updateTeamAsync(
          {
            description: data?.description,
          },
          activeTeam!.meta.slug,
        ).then(() => {
          toast({
            title: "Success!",
            description: "Team description updated successfully",
          });
          mutate(`/api/teams`);
        })
      }
      buttonText="Save changes"
      disabledTooltip={
        checkPermissions(activeTeam?.role, "UPDATE_TEAM_INFO")
          ? undefined
          : "Only the team owner can update the team description"
      }
    />
  );
}

function DeleteTeam() {
  return (
    <TeamPermissionView
      permission={"DELETE_TEAM"}
      unAuthorized={
        <div className="rounded-lg  border border-info bg-card dark:border-border">
          <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
            <div className="flex flex-col space-y-3">
              <h2 className="text-xl font-medium">Delete team</h2>
              <P className="text-muted-foreground">
                Not authorized to delete this team
              </P>
            </div>
          </div>
          <div className="flex items-center  space-x-4 rounded-b-lg border-t border-info bg-info p-3 sm:px-10">
            <p className="text-sm text-info-foreground">
              You do not have permission to delete this activeTeam?. Only the
              team owner can delete the activeTeam?.
            </p>
          </div>
        </div>
      }
    >
      <div className="rounded-lg border border-destructive bg-card">
        <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
          <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-medium">Delete team</h2>
            <P className="text-muted-foreground">
              Permanently delete your team, and all associated collections +
              their items. This action cannot be undone - please proceed with
              caution.
            </P>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 rounded-b-lg border-t border-destructive bg-accent/20 p-3 sm:px-10">
          <DeleteWorkspaceModel>
            <Button variant={"destructive"} type="button">
              <p>Delete team</p>
            </Button>
          </DeleteWorkspaceModel>
        </div>
      </div>
    </TeamPermissionView>
  );
}

interface CerateWorkspaceModelProps {
  children: React.ReactNode;
}

function DeleteWorkspaceModel({ children }: CerateWorkspaceModelProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { activeTeam, error, loading, deleteTeamAsync } = useTeam();

  function handleDeleteTeam(e: any) {
    e.preventDefault();

    setIsDeleting(true);
    deleteTeamAsync(activeTeam?.meta?.slug!).finally(() => {
      setIsDeleting(false);
    });
  }

  return (
    <form onSubmit={handleDeleteTeam}>
      <Dialog modal={true}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="border-border p-0 sm:max-w-[425px]">
          <DialogHeader className="flex flex-col  gap-4 px-8 pb-4 pt-8">
            <Logo className="h-10" />
            <DialogTitle className="text-center">Delete team</DialogTitle>
            <DialogDescription className="text-center">
              <P className="text-muted-foreground">
                Permanently delete your team, and all associated collections +
                their pages.
              </P>
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col space-y-6 bg-secondary/60 px-4 py-8 text-left sm:px-8">
            <div>
              <label
                htmlFor="team-slug"
                className="block select-none text-sm font-medium text-muted-foreground"
              >
                Enter the team slug
                <span className="cursor-text select-text px-1 font-semibold text-secondary-foreground">
                  {activeTeam?.meta?.slug}
                </span>
                to continue:
              </label>
              <div className="relative mt-1 rounded-md ">
                <Input
                  id="team-slug"
                  pattern={activeTeam?.meta?.slug}
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
                  confirm delete team
                </span>{" "}
                below
              </label>
              <div className="relative mt-1 rounded-md ">
                <Input
                  id="verification"
                  pattern="confirm delete team"
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
              {isDeleting ? <Spinner /> : <p>Confirm delete team</p>}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </form>
  );
}
