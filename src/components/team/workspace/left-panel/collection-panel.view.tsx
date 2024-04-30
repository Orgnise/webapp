import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChevronDown,
  Circle,
  CircleCheck,
  Maximize2,
  Minimize2,
  PanelRightOpen,
  PlusIcon,
} from "lucide-react";
import React, { useContext, useState } from "react";

import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import Label from "@/components/atom/label";
import { Spinner } from "@/components/atom/spinner";
import Tab from "@/components/atom/tab";
import { ListView } from "@/components/ui/listview";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ToolTipWrapper } from "@/components/ui/tooltip";
import useCollections from "@/lib/swr/use-collections";
import { Collection, Workspace } from "@/lib/types/types";
import { Fold } from "@/lib/utils";
import cx from "classnames";
import Link from "next/link";
import { useParams } from "next/navigation";
import { WorkspaceSettingsDropDown } from "../workspace-settings-dropdown";
import { LeftPanelSize } from "../workspace-view";
import CollectionBoard from "./collection-board";
import CollectionList from "./collection-list";
import CollectionTable from "./collection-table";

type PanelLayout = "List" | "Board" | "Table" | "Graph";

interface CollectionPanelProps {
  workspace?: Workspace;
  leftPanelSize: number;
  setLeftPanelSize?: React.Dispatch<React.SetStateAction<number>>;
}

export default function CollectionPanel({
  workspace,
  leftPanelSize,
  setLeftPanelSize = () => {},
}: CollectionPanelProps) {
  // const {  loading, error } = useContext(WorkspaceContext);
  const [activeLayout, setActiveLayout] = React.useState<PanelLayout>("List");
  const { team_slug, workspace_slug } = useParams() as {
    team_slug: string;
    workspace_slug: string;
  };

  // if (loading) {
  //   return (
  //     <div className="h-full w-full flex place-content-center items-center">
  //       <Spinner />
  //     </div>
  //   );
  // } else if (error) {
  //   return (
  //     <div className="h-full w-full flex place-content-center items-center">
  //       <P>Something went wrong</P>
  //     </div>
  //   );
  // }

  const { createCollection } = {
    createCollection: () => {},
  };

  if (!workspace) return <></>;

  return (
    <div
      style={{
        width: leftPanelSize,
      }}
      className={`flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-expo`}
    >
      <div className="flex items-center border border-border  bg-background">
        <Tab
          tab="List"
          selected={activeLayout === "List"}
          onClick={() => {
            setLeftPanelSize(LeftPanelSize.default);
            setActiveLayout("List");
          }}
        />
        <Tab
          tab="Board"
          selected={activeLayout === "Board"}
          onClick={() => {
            setActiveLayout("Board");
            setLeftPanelSize(LeftPanelSize.large);
          }}
        />
        <Tab
          tab="Table"
          selected={activeLayout === "Table"}
          onClick={() => {
            setActiveLayout("Table");
            setLeftPanelSize(LeftPanelSize.large);
          }}
        />
        <div className="flex-grow" />
        <div className="px-2">
          <WorkspaceSettingsDropDown
            team_slug={team_slug}
            workspace_slug={workspace_slug}
          />
        </div>
      </div>
      <PanelTopToolbar
        leftPanelSize={leftPanelSize}
        setLeftPanelSize={setLeftPanelSize}
      />
      <div className="h-2" />
      {activeLayout === "List" && (
        <CollectionList
        //  collections={collections}
        // isLoading={loading}
        />
      )}
      {activeLayout === "Board" && (
        <CollectionBoard
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
          workspace={workspace}
          createCollection={createCollection}
          // allCollection={collections}
          // isLoadingCollection={false}
        />
      )}
      {activeLayout === "Table" && (
        <CollectionTable
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
          workspace={workspace}
          createCollection={createCollection}
          // allCollection={collections}
          // isLoadingCollection={false}
        />
      )}
      {/* 
      {activeLayout === PanelLayout.graph && (
        <CollectionGraph
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
          workspace={workspace}
          createCollection={createCollection}
          allCollection={allCollection}
          isLoadingCollection={isLoadingCollection}
        /> */}
      {/* )} */}
    </div>
  );
}
export function PanelTopToolbar({
  leftPanelSize,
  setLeftPanelSize = () => {},
}: {
  leftPanelSize: number;
  setLeftPanelSize?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [status, setStatus] = useState<"IDLE" | "LOADING">("IDLE");
  // const { createCollection } = useContext(WorkspaceContext);
  const { createCollection } = useCollections();

  async function handleCreateCollection() {
    setStatus("LOADING");
    const col = {
      object: "collection",
    } as Collection;
    const response = await createCollection(col).finally(() => {
      setStatus("IDLE");
    });
  }

  return (
    <div className="flex place-content-between items-center border-b border-r border-border bg-background  px-1">
      <WorkspaceToggleDropDown />
      <div className="ml-2 flex h-4 items-center">
        <ToolTipWrapper content={<>Create Collection</>}>
          {status === "LOADING" ? (
            <Spinner className="theme-text-primary h-6" />
          ) : (
            <PlusIcon
              className="theme-text-primary cursor-pointer rounded p-1 outline-1"
              onClick={async () => {
                await handleCreateCollection();
              }}
            />
          )}
        </ToolTipWrapper>
        {leftPanelSize === LeftPanelSize.max ? (
          <Maximize2
            className="hover:bg-onSurface cursor-pointer rounded p-1 outline-1"
            onClick={() => {
              if (leftPanelSize === LeftPanelSize.max) {
                setLeftPanelSize(LeftPanelSize.default);
              } else {
                setLeftPanelSize(LeftPanelSize.max);
              }
            }}
          />
        ) : (
          <Minimize2
            className="hover:bg-onSurface cursor-pointer rounded p-1 outline-1"
            onClick={() => {
              if (leftPanelSize === LeftPanelSize.max) {
                setLeftPanelSize(LeftPanelSize.default);
              } else {
                setLeftPanelSize(LeftPanelSize.max);
              }
            }}
          />
        )}
        <PanelRightOpen
          size={24}
          className="hover:bg-onSurface cursor-pointer rounded p-1 outline-1"
          onClick={() => {
            setLeftPanelSize(LeftPanelSize.min);
          }}
        />
      </div>
    </div>
  );
}

export function WorkspaceToggleDropDown() {
  const {
    workspacesData: { workspaces, error, loading },
  } = useContext(TeamContext);

  const { workspace_slug } = (useParams() as { workspace_slug?: string }) ?? {};

  if (!workspaces || loading) {
    return <></>;
  }

  const workspace =
    workspaces?.find((w) => w?.meta?.slug === workspace_slug) ??
    workspaces?.[0];

  return (
    <Sheet>
      <SheetTrigger className="flex items-center py-1">
        <button className="flex h-9 items-center gap-2 px-2">
          <span className="max-w-[190px] truncate">{workspace?.name}</span>
          <ChevronDown size={15} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="border-border p-0">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle>Workspaces</SheetTitle>
        </SheetHeader>
        <WorkspaceListView workspaces={workspaces} />
      </SheetContent>
    </Sheet>
  );
}

export function WorkspaceListView({ workspaces }: { workspaces: Workspace[] }) {
  const { team_slug, workspace_slug } =
    (useParams() as { team_slug?: string; workspace_slug?: string }) ?? {};

  return (
    <Fold
      value={workspaces}
      ifPresent={(workspaces) => (
        <div className="Layout h-full w-full px-3">
          {/* CREATE WORKSPACE */}
          {/* <div className="flex gap-2 px-1 items-center mt-3 place-content-between">
            <SmallLabel>WORKSPACES</SmallLabel>
            <Button size={"sm"} variant={"ghost"} className="flex gap-2">
              <PlusIcon />
              create Workspace
            </Button>
          </div> */}

          <Fold
            value={workspaces}
            ifPresent={(list) => (
              <ListView
                items={list}
                className="flex h-full flex-col gap-1 overflow-y-auto pt-2"
                renderItem={(workspace, index) => {
                  const isActive = workspace_slug === workspace.meta.slug;
                  return (
                    <SheetClose asChild key={index}>
                      <div className="flex place-content-between items-center">
                        <Link
                          href={`/${team_slug}/${workspace.meta.slug}`}
                          className={cx(
                            "link group flex flex-grow items-center gap-2  rounded px-4 py-3 hover:bg-accent",
                            {
                              "text-primary ": isActive,
                            },
                          )}
                        >
                          <Circle
                            size={15}
                            fill={isActive ? "true" : "none"}
                            className={cx("", {
                              hidden: isActive,
                              "text-muted-foreground": !isActive,
                            })}
                          />
                          <CircleCheck
                            size={15}
                            className={cx("", {
                              "text-primary": isActive,
                              hidden: !isActive,
                            })}
                          />
                          <p
                            className={cx(" ", {
                              "text-primary": isActive,
                              "text-muted-foreground": !isActive,
                            })}
                          >
                            {workspace.name}
                          </p>
                        </Link>
                        <WorkspaceSettingsDropDown
                          team_slug={team_slug}
                          workspace_slug={workspace.meta.slug}
                          className=" text-muted-foreground"
                        />
                      </div>
                    </SheetClose>
                  );
                }}
                noItemsElement={
                  <div className="bg-surface hover:bg-surface m-3 px-3  py-2 ">
                    <Label size="body" variant="s1">
                      Create a workspace to get started
                    </Label>
                  </div>
                }
              />
            )}
            ifAbsent={() => (
              <div className="bg-surface hover:bg-surface m-3 px-3  py-2 ">
                <Label size="body" variant="s1">
                  Create a workspace to get started
                </Label>
              </div>
            )}
          />
        </div>
      )}
      ifAbsent={() => (
        <div className=" m-3 flex h-full flex-col  place-content-center items-center bg-gray-100 px-3 py-2 hover:bg-gray-100">
          <LoadingSpinner />
        </div>
      )}
    />
  );
}
