import Providers from "./providers";
import { ReactNode } from "react";
import WorkspaceView from "@/components/team/workspace/workspace-view";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
    return (
        <Providers>
            <WorkspaceView>
                {children}
            </WorkspaceView>
        </Providers>
    );
}