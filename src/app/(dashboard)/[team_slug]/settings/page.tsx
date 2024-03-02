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
import { Input } from "@/components/ui/input";
import useTeams from "@/lib/swr/use-teams";
import { hasValue } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function TeamSettingsPage() {
  const { teams, error, loading } = useTeams();
  const { team_slug } = (useParams() as { team_slug?: string }) ?? {};
  const activeTeam = useMemo(
    () => teams?.find((w) => w?.meta?.slug === team_slug),
    [teams, team_slug],
  );

  if (loading) {
    return <div>Loading...</div>;
  } else if (error || !activeTeam) {
    return (
      <div className="TeamSettingsPage h-full w-full py-12">
        <NotFoundView item="Team" />
      </div>
    );
  }
  return (
    <div className="WorkspaceSettings">
      <div className="flex h-28 border-b border-border bg-background lg:h-36">
        <div className="mx-auto flex w-full max-w-screen-xl items-center gap-4 px-2.5 ">
          <h1 className="prose-2xl">Settings</h1>
        </div>
      </div>
      <div className="mx-auto flex max-w-screen-md flex-col gap-8 px-4 py-10">
        <WorkspaceName />
        <WorkspaceSlug />
        <DeleteWorkspace />
      </div>
    </div>
  );
}

function WorkspaceName() {
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { teams, error, loading, updateTeamAsync } = useTeams();
  const { team_slug } = (useParams() as { team_slug?: string }) ?? {};
  const activeTeam = useMemo(
    () => teams?.find((w) => w?.meta?.slug === team_slug),
    [teams, team_slug],
  );

  function handleUpdateWorkspace(e: any) {
    e.preventDefault();
    const name = e.target.name.value;
    if (!activeTeam || name === activeTeam!.name) {
      return;
    }
    console.log("name", name, activeTeam?.name);
    setIsLoading(true);
    updateTeamAsync(
      {
        ...activeTeam!,
        name,
      },
      activeTeam.meta.slug,
    ).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <form
      onSubmit={handleUpdateWorkspace}
      className="rounded-lg border border-border bg-card"
    >
      <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium">Team Name</h2>
          <p className="text-sm text-muted-foreground">
            This is the name of your project on Dub.co.
          </p>
        </div>
        <Input
          placeholder="My team"
          minLength={3}
          maxLength={32}
          name="name"
          required
          defaultValue={activeTeam!.name}
          onChange={(e) => {
            setEnableSubmit(
              hasValue(e.target.value) && e.target.value !== activeTeam!.name,
            );
          }}
        />
      </div>
      <div className="flex items-center justify-between space-x-4 rounded-b-lg border-t border-border bg-accent/20 p-3 sm:px-10">
        <P className="text-sm text-muted-foreground">Max 32 characters.</P>
        <div className="shrink-0">
          <Button variant={enableSubmit ? "default" : "subtle"} type="submit">
            {isLoading ? <Spinner /> : <p>Save Changes</p>}
          </Button>
        </div>
      </div>
    </form>
  );
}

function WorkspaceSlug() {
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { teams, error, loading, updateTeamAsync } = useTeams();
  const { team_slug } = (useParams() as { team_slug?: string }) ?? {};
  const activeTeam = useMemo(
    () => teams?.find((w) => w?.meta?.slug === team_slug),
    [teams, team_slug],
  );

  function handleUpdateWorkspace(e: any) {
    e.preventDefault();
    const slug = e.target.slug.value;
    if (!activeTeam || slug === activeTeam?.meta?.slug) {
      return;
    }
    console.log("slug", slug, activeTeam?.meta?.slug);
    setIsLoading(true);
    updateTeamAsync(
      {
        ...activeTeam!,
        meta: {
          ...activeTeam!.meta,
          slug,
        },
      },
      activeTeam.meta.slug,
    ).finally(() => {
      setIsLoading(false);
    });
  }
  return (
    <form
      onSubmit={handleUpdateWorkspace}
      className="rounded-lg border border-border bg-card"
    >
      <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium">Team Slug</h2>
          <p className="text-sm text-muted-foreground">
            This is your team&apos;s unique slug on Pulse
          </p>
        </div>
        <Input
          name="slug"
          placeholder="my-team-slug"
          required
          type="text"
          min={3}
          maxLength={32}
          defaultValue={activeTeam?.meta?.slug}
          onChange={(e) => {
            setEnableSubmit(
              hasValue(e.target.value) && e.target.value !== activeTeam!.name,
            );
          }}
        />
      </div>
      <div className="flex items-center justify-between space-x-4 rounded-b-lg border-t border-border bg-accent/20 p-3 sm:px-10">
        <P className="text-muted-foreground">
          Only lowercase letters, numbers, and dashes. Max 48 characters.
        </P>
        <div className="shrink-0">
          <Button variant={enableSubmit ? "default" : "subtle"} type="submit">
            {isLoading ? <Spinner /> : <p>Save Changes</p>}
          </Button>
        </div>
      </div>
    </form>
  );
}

function DeleteWorkspace() {
  return (
    <div className="rounded-lg border border-destructive bg-card">
      <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium">Delete team</h2>
          <P className="text-muted-foreground">
            Permanently delete your team, and all associated collections + their
            items. This action cannot be undone - please proceed with caution.
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
  );
}

interface CerateWorkspaceModelProps {
  children: React.ReactNode;
}

function DeleteWorkspaceModel({ children }: CerateWorkspaceModelProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { teams, error, loading, deleteTeamAsync } = useTeams();
  const { team_slug } = (useParams() as { team_slug?: string }) ?? {};
  const activeTeam = useMemo(
    () => teams?.find((w) => w?.meta?.slug === team_slug),
    [teams, team_slug],
  );

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
                their items.
              </P>
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col space-y-6 bg-secondary/60 px-4 py-8 text-left sm:px-8">
            <div>
              <label
                htmlFor="team-slug"
                className="block select-none text-sm font-medium text-muted-foreground"
              >
                Enter the project slug
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
