"use client";

import { useContext, useEffect, useState } from "react";

import CollectionPanel from "./collection/collection-panel.view";
import { Spinner } from "@/components/atom/spinner";
import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import WorkspaceContentView from "./workspace-content-view";
import { useParams } from "next/navigation";
import useWorkspaces from "@/lib/swr/use-wrorkspaces";

export const LeftPanelSize = Object.freeze({
    min: 0,
    default: 320,
    large: typeof window !== 'undefined' ? window?.innerWidth / 2 ?? 500 : 500,
    max: typeof window !== 'undefined' ? window?.innerWidth : 1000
});


/**
 * Displays the workspace view
 */
export default function WorkspaceView({ children }: {
    children?: React.ReactNode;
}) {
    const { workspacesData: { error, loading, workspaces, activeWorkspace } } = useContext(TeamContext);
    const param = useParams();


    const isLoading = false;
    const [leftPanelSize, setLeftPanelSize] = useState<number>(LeftPanelSize.min);

    useEffect(() => {
        if (activeWorkspace) {
            setLeftPanelSize(LeftPanelSize.default);
        }
    }, [activeWorkspace]);

    if (isLoading) {
        return (
            <div className="h-full w-full flex place-content-center items-center">
                <Spinner />
            </div>
        );
    } else if (error) {
        return <div>Error</div>;
    }



    return (
        <WorkspaceContentView
            leftPanelState={leftPanelSize}
            onLeftPanelStateChange={setLeftPanelSize}
            leftPanel={
                activeWorkspace ? <CollectionPanel
                    workspace={activeWorkspace}
                    leftPanelSize={leftPanelSize}
                    setLeftPanelSize={setLeftPanelSize} /> : <>No Workspace</>
            }
        >
            <div className="max-w-screen-lg mx-auto py-4 px-4 lg:px-6">
                {children}
            </div>
        </WorkspaceContentView>
    );
}


