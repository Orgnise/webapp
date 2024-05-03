import { Maximize2, Minimize2, PanelRightOpen, PlusIcon } from "lucide-react";
import React, { useState } from "react";

import { Spinner } from "@/components/atom/spinner";
import Tab from "@/components/atom/tab";
import { ToolTipWrapper } from "@/components/ui/tooltip";
import useCollections from "@/lib/swr/use-collections";
import { Collection, Workspace } from "@/lib/types/types";
import { useParams } from "next/navigation";
import { WorkspaceSettingsDropDown } from "../workspace-settings-dropdown";
import { LeftPanelSize } from "../workspace-view";
import CollectionBoard from "./collection-board";
import CollectionList from "./collection-list";
import CollectionTable from "./collection-table";
import { WorkspaceSwitcher } from "./workspace-switcher";

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
      <WorkspaceSwitcher />
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
