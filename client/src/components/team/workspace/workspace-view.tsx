"use client";

import { useContext, useEffect, useState } from "react";

import CollectionPanel from "./collection/collection-panel.view";
import NotFoundView from "../team-not-found";
import { Spinner } from "@/components/atom/spinner";
import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import WorkspaceContentView from "./workspace-content-view";
import { useParams } from "next/navigation";

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
    const { workspacesData: { error, loading, activeWorkspace } } = useContext(TeamContext);
    const param = useParams();

    const [leftPanelSize, setLeftPanelSize] = useState<number>(LeftPanelSize.min);

    useEffect(() => {
        if (activeWorkspace) {
            setLeftPanelSize(LeftPanelSize.default);
        }
    }, [activeWorkspace?._id]);


    if (loading) {
        return (
            <div className="h-full w-full flex place-content-center items-center">
                <Spinner />
            </div>
        );
    } else if (error) {
        return <div className="CollectionContentPage h-full w-full py-12 max-w-3xl mx-auto">
            Something went wrong
        </div>
    } else if (!activeWorkspace) {
        return <div className="CollectionContentPage h-full w-full py-12 max-w-3xl mx-auto">
            <NotFoundView item="Workspace" />
        </div>
    }




    return (
        <WorkspaceContentView
            leftPanelSize={leftPanelSize}
            setLeftPanelSize={setLeftPanelSize}
            leftPanel={
                <CollectionPanel
                    workspace={activeWorkspace}
                    leftPanelSize={leftPanelSize}
                    setLeftPanelSize={setLeftPanelSize} />
            }
        >
            <div className="max-w-screen-lg min-h-screen mx-auto px-4 lg:px-6">
                {children}
            </div>
        </WorkspaceContentView>
    );
}


