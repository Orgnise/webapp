"use client";

import { ReactNode, createContext } from "react";
import { Team, Workspace } from "@/lib/types/types";

import { useParams } from "next/navigation";
import useTeam from "@/lib/swr/use-team";
import useWorkspaces from "@/lib/swr/use-wrorkspaces";

export default function Providers({ children }: { children: ReactNode }) {
  return <TeamProvider>
    {children}
  </TeamProvider>
}



interface TeamProviderProps {
  teamData: {
    loading?: boolean;
    error?: any;
    team?: Team;
  },
  workspacesData: {
    loading?: boolean;
    error?: any;
    workspaces?: Workspace[];
    activeWorkspace?: Workspace;
  }
}

export const TeamContext = createContext(null) as unknown as React.Context<TeamProviderProps>;
TeamContext.displayName = "TeamContext";

function TeamProvider({ children }: { children: ReactNode }) {

  const team = useTeam();
  const workspacesResponse = useWorkspaces();

  const param = useParams();
    const workspace_slug = param?.workspace_slug;
    const workspace = workspacesResponse?.workspaces?.find((w) => w?.meta?.slug === workspace_slug);

  return <TeamContext.Provider value={{
    teamData: team,
    workspacesData: {
      activeWorkspace: workspace,
      error: workspacesResponse.error,
      loading: workspacesResponse.loading,
      workspaces: workspacesResponse.workspaces
    }
    
  }}>
    {children}
  </TeamContext.Provider>;
}