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
import { ToolTipWrapper } from "@/components/ui/tooltip";
import { hasValue } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import { TeamContext } from "../../providers";

export default function WorkspaceSettingsPage() {
  const {
    workspacesData: { activeWorkspace, error, loading },
    teamData: { team },
  } = useContext(TeamContext);

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
      <div className="flex h-28 border-b border-border lg:h-36">
        <div className="mx-auto flex w-full max-w-screen-xl items-center gap-4 px-2.5 lg:px-20 ">
          <ToolTipWrapper content={<>Back to workspace</>}>
            <Link href={`/${team?.meta?.slug}/${activeWorkspace?.meta?.slug}`}>
              <span className="flex items-center gap-px">
                <h1 className="text-xl font-medium text-secondary-foreground/80">
                  {activeWorkspace?.name}
                </h1>
              </span>
            </Link>
          </ToolTipWrapper>
          <ChevronRightIcon className="cursor-pointer" size={18} />
          <span className="flex items-center gap-px">
            <h1 className="text-xl font-medium text-secondary-foreground/80">
              Settings
            </h1>
          </span>
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
  const {
    workspacesData: { activeWorkspace, error, loading },
    updateWorkspace,
  } = useContext(TeamContext);

  function handleUpdateWorkspace(e: any) {
    e.preventDefault();
    const name = e.target.name.value;
    if (name === activeWorkspace!.name) {
      return;
    }
    console.log("name", name, activeWorkspace?.name);
    setIsLoading(true);
    updateWorkspace({
      ...activeWorkspace!,
      name,
    }).finally(() => {
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
          <h2 className="text-xl font-medium">Workspace Name</h2>
          <p className="text-sm text-muted-foreground">
            This is the name of your project on Dub.co.
          </p>
        </div>
        <Input
          placeholder="My workspace"
          minLength={3}
          maxLength={32}
          name="name"
          required
          defaultValue={activeWorkspace!.name}
          onChange={(e) => {
            setEnableSubmit(
              hasValue(e.target.value) &&
                e.target.value !== activeWorkspace!.name,
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
  const {
    workspacesData: { activeWorkspace, error, loading },
    updateWorkspace,
  } = useContext(TeamContext);

  function handleUpdateWorkspace(e: any) {
    e.preventDefault();
    const slug = e.target.slug.value;
    if (slug === activeWorkspace?.meta?.slug) {
      return;
    }
    console.log("slug", slug, activeWorkspace?.meta?.slug);
    setIsLoading(true);
    updateWorkspace({
      ...activeWorkspace!,
      meta: {
        ...activeWorkspace!.meta,
        slug,
      },
    }).finally(() => {
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
          <h2 className="text-xl font-medium">Workspace Slug</h2>
          <p className="text-sm text-muted-foreground">
            This is your workspace&apos;s unique slug on Pulse
          </p>
        </div>
        <Input
          name="slug"
          placeholder="my-workspace-slug"
          required
          type="text"
          min={3}
          maxLength={32}
          defaultValue={activeWorkspace?.meta?.slug}
          onChange={(e) => {
            setEnableSubmit(
              hasValue(e.target.value) &&
                e.target.value !== activeWorkspace!.name,
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

export function DeleteWorkspaceModel({ children }: CerateWorkspaceModelProps) {
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
        <DialogContent className="p-0 sm:max-w-[425px]">
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
                Enter the project slug
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
