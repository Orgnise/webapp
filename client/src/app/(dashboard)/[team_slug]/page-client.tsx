"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { H3, P } from "@/components/atom/typography";
import { LockIcon, Shapes } from "lucide-react";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Label from "@/components/atom/label";
import Link from "next/link";
import { ListView } from "@/components/ui/listview";
import { Logo } from "@/components/atom/logo";
import { Spinner } from "@/components/atom/spinner";
import { TeamContext } from "./providers";
import { Visibility } from "@/lib/models/workspace.model";
import { Workspace } from "@/lib/types/types";
import { useParams } from "next/navigation";

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
            <CerateWorkspaceModel >
              <Button variant="outline" size={'sm'}>Create Workspace</Button>
            </CerateWorkspaceModel>
          </div>
        </div>
      </div>
      <ListView
        items={workspacesData?.workspaces}
        loading={workspacesData.loading}
        className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid max-w-screen-xl mx-auto py-10 lg:px-20 px-2.5"
        renderItem={(item: Workspace, index: number) =>
          <Link
            href={`${team_slug}/${item.meta.slug}`}
            className="flex place-content-between items-start border w-full h-32 rounded p-6 border-border cursor-pointer hover:bg-accent hover:text-accent-foreground">
            <div className="flex items-center gap-4">
              <Logo className="h-6" />
              <div>
                <H3>{item.name}</H3>
                {
                  item?.description &&
                  <p className="text-sm ">{item.description}</p>
                }
              </div>
            </div>

            <span>{item?.visibility === Visibility.Private && <LockIcon />}</span>

          </Link>}
        noItemsElement={
          <div className="h-full py-20 w-full flex flex-col place-content-center items-center text-center">
            <Shapes className="text-accent" size={60} />
            <P className="mt-6">No workspace available</P>
            <P className="text-sm text-muted-foreground">
              Create a workspace to start managing your collections.
            </P>
          </div>
        }
        placeholder={<div className="h-full w-full flex place-content-center items-center">
          <Spinner />
        </div>}
      />
    </div>
  );
}


interface CerateWorkspaceModelProps {
  children: React.ReactNode;
}

export function CerateWorkspaceModel({ children }: CerateWorkspaceModelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { create: { workspace: { status, createWorkspace } } } = useContext(TeamContext);

  return (<>
    <Dialog modal={true}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to start managing your collections.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-1">
            <Label>
              Name
            </Label>
            <Input
              maxLength={30}
              minLength={3}
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="">
              Description <small>(optional)</small>
            </Label>
            <Input
              maxLength={60}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose className="hidden" id='CreateWorkspaceCloseButton'>
            Cancel
          </DialogClose>
          <Button
            type="submit"
            disabled={!title}
            onClick={(e) => {
              if (status === "loading") {
                return;
              }
              createWorkspace(title, description);
            }}
          >
            {status === "loading" ? <Spinner className="text-primary-foreground" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </>
  )
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
          }}
        >
          "Open Workspace"
        </Button>

        <Label size="body" variant="cap">
          You can also use humburger menu to open workspace.
        </Label>
      </div>
    </div>
  );
}
