"use client";

import { Workspace } from "@/lib/types/types";
import { ReactNode, createContext } from "react";

// import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

import { fetcher } from "@/lib/fetcher";
import useWorkspaces from "@/lib/swr/use-wrorkspaces";
import z from "@/lib/zod";
import { createWorkspaceSchema } from "@/lib/zod/schemas/workspaces";
import { useParams, useRouter } from "next/navigation";

export default function Providers({ children }: { children: ReactNode }) {
  return <TeamProvider>{children}</TeamProvider>;
}

interface TeamProviderProps {
  workspacesData: {
    loading?: boolean;
    error?: any;
    workspaces?: Workspace[];
    activeWorkspace?: Workspace;
  };
  createWorkspace: (
    data: z.infer<typeof createWorkspaceSchema>,
  ) => Promise<void>;
  deleteWorkspace: (workspaceSlug: string) => Promise<void>;
  updateWorkspace: (workspace: Workspace) => Promise<void>;
}

export const TeamContext = createContext(
  null,
) as unknown as React.Context<TeamProviderProps>;
TeamContext.displayName = "TeamContext";

function TeamProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const workspacesResponse = useWorkspaces();

  const param = useParams();
  const workspace_slug = param?.workspace_slug;
  const workspace = workspacesResponse?.workspaces?.find(
    (w) => w?.meta?.slug === workspace_slug,
  );
  // const [createWorkspaceState, setCreateWorkspaceState] =
  //   useState<Status>("idle");

  // const { toast } = useToast();

  // Create workspace
  async function createWorkspace(data: z.infer<typeof createWorkspaceSchema>) {
    const teamSlug = param?.team_slug;
    try {
      const response = await fetcher(`/api/teams/${teamSlug}/workspaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      workspacesResponse.mutate(
        {
          workspaces: [...workspacesResponse.workspaces, response.workspace],
        },
        {
          revalidate: false,
        },
      );
      document.getElementById("CreateWorkspaceCloseButton")?.click();
      displayToast({
        title: "Workspace created",
        description: `Workspace ${name} has been created`,
        duration: 5000,
      });
    } catch (error: any) {
      displayToast({
        title: "Error",
        description:
          error?.error?.message ?? "Error occurred while creating workspace",
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
        },
      );
      if (response.workspace?.meta?.slug !== param?.workspace_slug) {
        router.replace(
          `/${teamSlug}/${response.workspace?.meta?.slug}/settings`,
        );
      }
      const list = workspacesResponse.workspaces.map((w) => {
        if (w?._id === workspace._id) {
          return response.workspace;
        }
        return w;
      });
      workspacesResponse.mutate({ workspaces: list }, { revalidate: false });
      displayToast({
        title: "Workspace updated",
        description: `Workspace ${workspace.name} has been updated`,
        duration: 5000,
      });
    } catch (err: any) {
      displayToast({
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
            (w) => w?.meta?.slug !== workspaceSlug,
          ),
        },
        {
          revalidate: false,
        },
      );
      displayToast({
        title: "Workspace deleted",
        description: `Workspace has been deleted`,
        duration: 5000,
      });
    } catch (error) {
      displayToast({
        title: "Error",
        description: `Error occurred while deleting workspace`,
        duration: 2000,
        variant: "destructive",
      });
    }
  }

  function displayToast({ title, description, variant, duration }: any) {
    toast(
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>,
    );
  }

  return (
    <TeamContext.Provider
      value={{
        workspacesData: {
          activeWorkspace: workspace,
          error: workspacesResponse.error,
          loading: workspacesResponse.loading,
          workspaces: workspacesResponse.workspaces,
        },
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}
