"use client";

import { H3, P } from "@/components/atom/typography";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LockIcon, Shapes } from "lucide-react";
import { useContext, useState } from "react";

import Label from "@/components/atom/label";
import { Logo } from "@/components/atom/logo";
import { Spinner } from "@/components/atom/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/ui/listview";
import { Visibility } from "@/lib/models/workspace.model";
import { Workspace } from "@/lib/types/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TeamContext } from "./providers";

export default async function TeamsPageClient() {
  const { team_slug } = useParams() as { team_slug?: string };
  const { teamData, workspacesData } = useContext(TeamContext);
  if (teamData.loading) {
    return (
      <div className="h-full w-full flex place-content-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex h-36 items-center border-b border-border bg-background">
        <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-2xl ">My Workspaces</h1>
            <CerateWorkspaceModel>
              <Button size={"sm"}>Create Workspace</Button>
            </CerateWorkspaceModel>
          </div>
        </div>
      </div>
      <ListView
        items={workspacesData?.workspaces}
        loading={workspacesData.loading}
        className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid max-w-screen-xl mx-auto py-10 lg:px-20 px-2.5"
        renderItem={(item: Workspace, index: number) => (
          <Link
            key={index}
            href={`${team_slug}/${item.meta.slug}`}
            className="flex place-content-between items-start border w-full h-32 rounded p-6 border-border cursor-pointer bg-card hover:bg-accent/20  hover:text-accent-foreground">
            <div className="flex items-center gap-4">
              <Logo className="h-6" />
              <div>
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
        noItemsElement={
          <div className="h-full py-20 w-full flex flex-col place-content-center items-center text-center">
            <Shapes className="text-accent" size={60} />
            <P className="mt-6">No workspace available</P>
            <P className="text-sm text-muted-foreground">
              Create a workspace to start managing your collections.
            </P>
          </div>
        }
        placeholder={
          <div className="h-full w-full flex place-content-center items-center">
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to start managing your collections.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateWorkspace}>
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-1">
              <Label>Name</Label>
              <Input
                maxLength={30}
                minLength={3}
                name="name"
                required
                placeholder="Workspace name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="">
                Description <small>(optional)</small>
              </Label>
              <Input
                maxLength={60}
                name="description"
                placeholder="Workspace description"
              />
            </div>
          </div>
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
      <div className="h-full flex flex-col gap-4 w-full items-center place-content-center max-w-xl mx-auto text-center">
        <Label size="h1">Open work</Label>
        <Label size="body1">
          Open a workspace to start working on your tasks.
        </Label>

        <Button
          variant={"outline"}
          className="rounded-full"
          onClick={() => {
            setActive(true);
          }}>
          "Open Workspace"
        </Button>

        <Label size="body" variant="cap">
          You can also use humburger menu to open workspace.
        </Label>
      </div>
    </div>
  );
}
