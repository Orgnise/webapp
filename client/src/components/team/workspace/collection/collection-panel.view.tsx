import {
  ChevronDown,
  Circle,
  Maximize2,
  Minimize2,
  PanelRightOpen,
  PlusIcon,
} from "lucide-react";
import { P, SmallLabel } from "@/components/atom/typography";
import React, { useContext, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import CollectionBoard from "./collection-board";
import CollectionList from "./collection-list";
import CollectionTable from "./collection-table";
import { Fold } from "@/lib/utils";
import Label from "@/components/atom/label";
import { LeftPanelSize } from "../workspace-view";
import Link from "next/link";
import { ListView } from "@/components/ui/listview";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Spinner } from "@/components/atom/spinner";
import Tab from "@/components/atom/tab";
import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import { ToolTipWrapper } from "@/components/ui/tooltip";
import { Collection, Workspace } from "@/lib/types/types";
import { WorkspaceContext } from "@/app/(dashboard)/[team_slug]/[workspace_slug]/providers";
import cx from "classnames";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

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
  const { collections, loading, error } = useContext(WorkspaceContext);
  const [activeLayout, setActiveLayout] = React.useState<PanelLayout>("List");

  if (loading) {
    return (
      <div className="h-full w-full flex place-content-center items-center">
        <Spinner />
      </div>
    );
  } else if (error) {
    return (
      <div className="h-full w-full flex place-content-center items-center">
        <P>Something went wrong</P>
      </div>
    );
  }

  const { createCollection } = {
    createCollection: () => {},
  };

  if (!workspace) return <></>;

  return (
    <div
      style={{
        width: leftPanelSize,
      }}
      className={`flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-expo`}>
      <div className="flex items-center bg-background border  border-border">
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
        {/* <Tab
          tab="Graph"
          selected={activeLayout === 'Graph'}
          onClick={() => {
            setActiveLayout('Graph');
            setLeftPanelSize(LeftPanelSize.large);
          }}
        /> */}

        {/* <CustomDropDown
          className="pt-1 mx-3"
          button={<SvgIcon icon="VerticalEllipse" size={4} className="h-5" />}>
          <div className="flex flex-col gap-2 border theme-border rounded">
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-surface rounded cursor-pointer transition-all ease-in duration-200"
              onClick={() => {
                navigate("settings");
              }}>
              Workspace Settings
            </div>
          </div>
        </CustomDropDown> */}
      </div>
      <PanelTopToolbar
        leftPanelSize={leftPanelSize}
        setLeftPanelSize={setLeftPanelSize}
      />
      <div className="h-2" />
      {activeLayout === "List" && (
        <CollectionList collections={collections} isLoading={loading} />
      )}
      {activeLayout === "Board" && (
        <CollectionBoard
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
          workspace={workspace}
          createCollection={createCollection}
          allCollection={collections}
          isLoadingCollection={false}
        />
      )}
      {activeLayout === "Table" && (
        <CollectionTable
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
          workspace={workspace}
          createCollection={createCollection}
          allCollection={collections}
          isLoadingCollection={false}
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
  const [status, setStatus] = useState<
    "IDLE" | "LOADING" | "LOADING" | "SUCCESS" | "ERROR"
  >("IDLE");
  const { createCollection } = useContext(WorkspaceContext);
  const { toast } = useToast();

  async function handleCreateCollection() {
    setStatus("LOADING");
    try {
      const col = {
        object: "collection",
      } as Collection;
      const response = await createCollection(col);
      setStatus("SUCCESS");
      toast({
        title: "Collection Created",
        description: "Collection has been created",
        duration: 3000,
      });
    } catch (error) {
      setStatus("ERROR");
      toast({
        title: "Error",
        description: "Something went wrong",
        duration: 3000,
        variant: "destructive",
      });
      console.error("Error creating collection", error);
    }
  }

  return (
    <div className="flex items-center place-content-between border-b border-border bg-accent/60  px-1">
      <WorkspaceToggleDropDown />
      <div className="ml-2 flex items-center h-4">
        <ToolTipWrapper onHover={<>Create</>}>
          {status === "LOADING" ? (
            <Spinner className="theme-text-primary" />
          ) : (
            <PlusIcon
              className="theme-text-primary rounded p-1 outline-1 cursor-pointer"
              onClick={async () => {
                await handleCreateCollection();
              }}
            />
          )}
        </ToolTipWrapper>
        {leftPanelSize === LeftPanelSize.max ? (
          <Maximize2
            className="hover:bg-onSurface rounded p-1 outline-1 cursor-pointer"
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
            className="hover:bg-onSurface rounded p-1 outline-1 cursor-pointer"
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
          className="hover:bg-onSurface rounded p-1 outline-1 cursor-pointer"
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
    <div>
      <Sheet>
        <SheetTrigger className="flex items-center">
          <button className="h-9 flex items-center gap-2 px-2">
            {workspace?.name}
            <ChevronDown />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 border-border">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle>{workspace?.name}</SheetTitle>
          </SheetHeader>
          <WorkspaceListView workspaces={workspaces} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function WorkspaceListView({ workspaces }: { workspaces: Workspace[] }) {
  const { team_slug, workspace_slug } =
    (useParams() as { team_slug?: string; workspace_slug?: string }) ?? {};

  return (
    <Fold
      value={workspaces}
      ifPresent={(workspaces) => (
        <div className="Layout px-3 w-full h-full">
          {/* CREATE WORKSPACE */}
          <div className="flex gap-2 px-1 items-center mt-3 place-content-between">
            <SmallLabel>WORKSPACES</SmallLabel>
            <Button size={"sm"} variant={"ghost"} className="flex gap-2">
              <PlusIcon />
              create Workspace
            </Button>
          </div>

          <Fold
            value={workspaces}
            ifPresent={(list) => (
              <ListView
                items={list}
                className="flex flex-col gap-1 overflow-y-auto h-full"
                renderItem={(workspace) => {
                  const isActive = workspace_slug === workspace.meta.slug;
                  return (
                    <SheetClose asChild>
                      <Link
                        href={`/${team_slug}/${workspace.meta.slug}`}
                        className={cx(
                          "group link py-3 flex items-center gap-2  rounded px-4",
                          {
                            "hover:bg-accent":
                              workspace_slug !== workspace.meta.slug,
                            "text-primary ": isActive,
                          }
                        )}>
                        <Circle
                          size={15}
                          fill={isActive ? "true" : "none"}
                          className={cx("", {
                            "fill-current": isActive,
                            "text-muted-foreground": !isActive,
                          })}
                        />
                        <P>{workspace.name}</P>
                      </Link>
                    </SheetClose>
                  );
                }}
                noItemsElement={
                  <div className="px-3 py-2 bg-surface hover:bg-surface  m-3 ">
                    <Label size="body" variant="s1">
                      Create a workspace to get started
                    </Label>
                  </div>
                }
              />
            )}
            ifAbsent={() => (
              <div className="px-3 py-2 bg-surface hover:bg-surface  m-3 ">
                <Label size="body" variant="s1">
                  Create a workspace to get started
                </Label>
              </div>
            )}
          />
        </div>
      )}
      ifAbsent={() => (
        <div className=" px-3 py-2 bg-gray-100 hover:bg-gray-100  m-3 h-full flex flex-col items-center place-content-center">
          <LoadingSpinner />
        </div>
      )}
    />
  );
}
