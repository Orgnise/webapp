"use client";

import { useEffect, useState } from "react";

import { Spinner } from "@/components/atom/spinner";
import useWorkspaces from "@/lib/swr/use-workspaces";
import NotFoundView from "../team-not-found";
import CollectionPanel from "./left-panel/collection-panel.view";
import WorkspaceContentView from "./workspace-content-view";

export const LeftPanelSize = Object.freeze({
  min: 0,
  default: 320,
  large: typeof window !== "undefined" ? window?.innerWidth / 2 ?? 500 : 500,
  max: typeof window !== "undefined" ? window?.innerWidth : 1000,
});

/**
 * Displays the workspace view
 */
export default function WorkspaceView({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { activeWorkspace, loading, error } = useWorkspaces();

  const [leftPanelSize, setLeftPanelSize] = useState<number>(LeftPanelSize.min);

  useEffect(() => {
    if (activeWorkspace) {
      setLeftPanelSize(LeftPanelSize.default);
    }
  }, [activeWorkspace]);

  if (loading) {
    return (
      <div className="flex h-full w-full place-content-center items-center">
        <Spinner />
      </div>
    );
  } else if (error) {
    return (
      <div className="WorkspaceView mx-auto h-full w-full max-w-3xl py-12">
        Something went wrong
      </div>
    );
  } else if (!activeWorkspace) {
    return (
      <div className="WorkspaceView mx-auto h-full w-full max-w-3xl py-12">
        <NotFoundView item="Workspace" />
      </div>
    );
  }

  return (
    <WorkspaceContentView
      leftPanelSize={leftPanelSize}
      setLeftPanelSize={setLeftPanelSize}
      leftPanel={
        <CollectionPanel
          workspace={activeWorkspace}
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
        />
      }
    >
      <div className="max-w-screen flex h-full min-h-[calc(100vh-64px)] flex-col">
        {children}
      </div>
    </WorkspaceContentView>
  );
}
