"use client";

import { H3 } from "@/components/atom/typography";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LockIcon } from "lucide-react";
import { useContext, useState } from "react";

import Label from "@/components/atom/label";
import { Logo } from "@/components/atom/logo";
import { Spinner } from "@/components/atom/spinner";
import { TextField } from "@/components/molecule/text-field";
import EmptyWorkspaceView from "@/components/team/workspace/empty-workspace-view";
import { Button } from "@/components/ui/button";
import { ListView } from "@/components/ui/listview";
import { Visibility } from "@/lib/schema/workspace.schema";
import { Workspace } from "@/lib/types/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TeamContext } from "./providers";

export default function TeamsPageClient() {
  const { team_slug } = useParams() as { team_slug?: string };
  const { teamData, workspacesData } = useContext(TeamContext);
  if (teamData.loading) {
    return (
      <div className="flex h-full w-full place-content-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex h-36 items-center border-b border-border bg-background">
        <div className="mx-auto w-full max-w-screen-xl px-2.5">
          <div className="flex items-center justify-between">
            <h1 className="prose-2xl">My Workspaces</h1>
            <CerateWorkspaceModel>
              <Button size={"sm"}>Create Workspace</Button>
            </CerateWorkspaceModel>
          </div>
        </div>
      </div>
      <ListView
        items={workspacesData?.workspaces}
        loading={workspacesData.loading}
        className="mx-auto grid max-w-screen-xl grid-cols-1   gap-5 px-2.5 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:px-20"
        renderItem={(item: Workspace, index: number) => (
          <Link
            key={index}
            href={`${team_slug}/${item.meta.slug}`}
            className="flex h-32 w-full cursor-pointer place-content-between items-start rounded border border-border bg-card p-6 hover:text-accent-foreground  hover:shadow"
          >
            <div className="flex items-center gap-4">
              <Logo className="h-6" />
              <div className="flex-grow">
                <H3>{item.name}</H3>
                {item?.description && (
                  <p className="text-sm ">{item.description}</p>
                )}
              </div>
            </div>

            <span>
              {item?.visibility === Visibility.Private && <LockIcon />}
            </span>
          </Link>
        )}
        noItemsElement={<EmptyWorkspaceView />}
        placeholder={
          <div className="flex h-full w-full place-content-center items-center">
            <Spinner />
          </div>
        }
      />
    </div>
  );
}

interface CerateWorkspaceModelProps {
  children: React.ReactNode;
}

export function CerateWorkspaceModel({ children }: CerateWorkspaceModelProps) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const { createWorkspace } = useContext(TeamContext);

  function handleCreateWorkspace(e: any) {
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
    if (status === "loading") {
      return;
    }
    setStatus("loading");
    createWorkspace(name, description).finally(() => {
      setStatus("idle");
    });
  }

  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-border p-6">
        <DialogHeader>
          <Label size="h2" variant="t2">
            Create workspace
          </Label>
          <DialogDescription>
            Create a new workspace to start managing your collections.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateWorkspace} className="flex flex-col pt-3">
          <TextField
            maxLength={30}
            minLength={3}
            name="name"
            label="Workspace name"
            required
            placeholder="Workspace name"
          />

          <TextField
            maxLength={60}
            name="description"
            label="Workspace description"
            placeholder="Workspace description"
          />

          <div className="flex justify-end">
            <DialogClose className="hidden" id="CreateWorkspaceCloseButton">
              Cancel
            </DialogClose>
            <Button type="submit">
              {status === "loading" ? (
                <Spinner className="text-primary-foreground" />
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Suggest to open workspace
 */
export function SuggestOpenWorkspace({ setActive }: any) {
  return (
    <div className="h-full">
      <div className="mx-auto flex h-full w-full max-w-xl flex-col place-content-center items-center gap-4 text-center">
        <Label size="h1">Open work</Label>
        <Label size="body1">
          Open a workspace to start working on your tasks.
        </Label>

        <Button
          variant={"outline"}
          className="rounded-full"
          onClick={() => {
            setActive(true);
          }}
        >
          Open Workspace
        </Button>

        <Label size="body" variant="cap">
          You can also use humburger menu to open workspace.
        </Label>
      </div>
    </div>
  );
}
