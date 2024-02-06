"use client";

import { ReactNode, createContext, useState } from "react";
import { Team, Workspace } from "@/lib/types/types";

import { fetcher } from "@/lib/fetcher";
import { useParams } from "next/navigation";
import useTeam from "@/lib/swr/use-team";
import { useToast } from "@/components/ui/use-toast";
import useWorkspaces from "@/lib/swr/use-wrorkspaces";

export default function Providers({ children }: { children: ReactNode }) {
  return <TeamProvider>
    {children}
  </TeamProvider>
}


type Status = "idle" | "loading" | "success" | "error";
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
  },
  create: {
    workspace: {
      createWorkspace: (name: string, description?: string) => void;
      status: Status;
    }
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
  const [createWorkspaceState, setCreateWorkspaceState] = useState<Status>( "idle");

  const { toast } = useToast();

  async function createWorkspace(name: string, description?: string) {
    const teamSlug = param?.team_slug;
    try {
      setCreateWorkspaceState( "loading");
      const response = await fetcher(`/api/teams/${teamSlug}/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })
      setCreateWorkspaceState("success");
      workspacesResponse.mutate(
        {
          data: [...workspacesResponse.workspaces, response.workspace],
        }
      );
      document.getElementById('CreateWorkspaceCloseButton')?.click();
      toast({
        title: "Workspace created",
        description: `Workspace ${name} has been created`,
        duration: 5000,
      })
    } catch (error) {
      setCreateWorkspaceState( "error");
      toast({
        title: "Error",
        description: `Error occurred while creating workspace ${name}`,
        duration: 2000,
        variant: "destructive"
      })
    }
  }

  return <TeamContext.Provider value={{
    teamData: team,
    workspacesData: {
      activeWorkspace: workspace,
      error: workspacesResponse.error,
      loading: workspacesResponse.loading,
      workspaces: workspacesResponse.workspaces
    },
    create: {
      workspace: {
        createWorkspace,
        status:createWorkspaceState,
      }
    }
  }}>
    {children}
  </TeamContext.Provider>;
}