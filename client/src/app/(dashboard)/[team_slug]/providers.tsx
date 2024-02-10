"use client";

import { Team, Workspace } from "@/lib/types/types";
import { ReactNode, createContext } from "react";

import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/fetcher";
import useTeam from "@/lib/swr/use-team";
import useWorkspaces from "@/lib/swr/use-wrorkspaces";
import { useParams, useRouter } from "next/navigation";

export default function Providers({ children }: { children: ReactNode }) {
  return <TeamProvider>{children}</TeamProvider>;
}

interface TeamProviderProps {
  teamData: {
    loading?: boolean;
    error?: any;
    team?: Team;
  };
  workspacesData: {
    loading?: boolean;
    error?: any;
    workspaces?: Workspace[];
    activeWorkspace?: Workspace;
  };
  createWorkspace: (name: string, description?: string) => Promise<void>;
  deleteWorkspace: (workspaceSlug: string) => Promise<void>;
  updateWorkspace: (workspace: Workspace) => Promise<void>;
}

export const TeamContext = createContext(
  null
) as unknown as React.Context<TeamProviderProps>;
TeamContext.displayName = "TeamContext";

function TeamProvider({ children }: { children: ReactNode }) {
  const team = useTeam();
  const router = useRouter();
  const workspacesResponse = useWorkspaces();

  const param = useParams();
  const workspace_slug = param?.workspace_slug;
  const workspace = workspacesResponse?.workspaces?.find(
    (w) => w?.meta?.slug === workspace_slug
  );
  // const [createWorkspaceState, setCreateWorkspaceState] =
  //   useState<Status>("idle");

  const { toast } = useToast();

  // Create workspace
  async function createWorkspace(name: string, description?: string) {
    const teamSlug = param?.team_slug;
    try {
      const response = await fetcher(`/api/teams/${teamSlug}/workspaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      workspacesResponse.mutate(
        {
          workspaces: [...workspacesResponse.workspaces, response.workspace],
        },
        {
          revalidate: false,
        }
      );
      document.getElementById("CreateWorkspaceCloseButton")?.click();
      toast({
        title: "Workspace created",
        description: `Workspace ${name} has been created`,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Error occurred while creating workspace ${name}`,
        duration: 2000,
        variant: "destructive",
      });
    }
  }

  // Update workspace
  async function updateWorkspace(workspace: Workspace) {
    const teamSlug = param?.team_slug;
    try {
      const response = await fetcher(
        `/api/teams/${teamSlug}/${workspace.meta.slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ workspace }),
        }
      );
      if (response.workspace?.meta?.slug !== param?.workspace_slug) {
        router.replace(
          `/${teamSlug}/${response.workspace?.meta?.slug}/settings`
        );
      }
      const list = workspacesResponse.workspaces.map((w) => {
        if (w?._id === workspace._id) {
          return response.workspace;
        }
        return w;
      });
      workspacesResponse.mutate({ workspaces: list }, { revalidate: false });
      toast({
        title: "Workspace updated",
        description: `Workspace ${workspace.name} has been updated`,
        duration: 5000,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.message ??
          `Error occurred while updating workspace ${workspace.name}`,
        duration: 2000,
        variant: "destructive",
      });
    }
  }

  // Delete workspace
  async function deleteWorkspace(workspaceSlug: string) {
    const teamSlug = param?.team_slug;
    try {
      await fetcher(`/api/teams/${teamSlug}/${workspaceSlug}`, {
        method: "DELETE",
      });
      if (param?.workspace_slug === workspaceSlug) {
        router.replace(`/${teamSlug}`);
      }
      workspacesResponse.mutate(
        {
          workspaces: workspacesResponse.workspaces.filter(
            (w) => w?.meta?.slug !== workspaceSlug
          ),
        },
        { revalidate: false }
      );
      toast({
        title: "Workspace deleted",
        description: `Workspace has been deleted`,
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Error occurred while deleting workspace`,
        duration: 2000,
        variant: "destructive",
      });
    }
  }

  return (
    <TeamContext.Provider
      value={{
        teamData: team,
        workspacesData: {
          activeWorkspace: workspace,
          error: workspacesResponse.error,
          loading: workspacesResponse.loading,
          workspaces: workspacesResponse.workspaces,
        },
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
      }}>
      {children}
    </TeamContext.Provider>
  );
}
