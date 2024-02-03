"use client";

import { H1, H2, H3 } from "@/components/atom/typography";
import { ReactNode, useContext } from "react";
import { useParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Label from "@/components/atom/label";
import Link from "next/link";
import { ListView } from "@/components/ui/listview";
import { LockIcon } from "lucide-react";
import { Logo } from "@/components/atom/logo";
import { Spinner } from "@/components/atom/spinner";
import { TeamContext } from "./providers";
import { Visibility } from "@/lib/models/workspace.model";
import { Workspace } from "@/lib/types/types";

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
            <h1 className="text-2xl ">My Workspaces</h1>
            <div>
              <Button className="flex gap-1">
                Create Workspace</Button>
            </div>
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
            {
              <span>{item?.visibility === Visibility.Private && <LockIcon />}</span>
            }
          </Link>}
        noItemsElement={<div className="h-full py-10 w-full flex place-content-center items-center">
          <Label size="h1">No workspace available</Label>
        </div>
        }
        placeholder={<div className="h-full w-full flex place-content-center items-center">
          <Spinner />
        </div>}
      />
    </div>
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
