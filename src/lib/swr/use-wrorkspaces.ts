"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR, { KeyedMutator } from "swr";

import { fetcher } from "../fetcher";
import { AccessLevel, Workspace } from "../types/types";
import { displayToast } from "./use-collections";
import { Visibility } from "../schema/workspace.schema";

type UpdateWorkspace = {
  name?: string;
  description?: string;
  slug?: string;
  visibility?: Visibility;
  defaultAccess?: AccessLevel
}


interface IWorkspaces {
  error: any;
  mutate: KeyedMutator<any>;
  loading: boolean;
  workspaces: Workspace[];
  deleteWorkspace: (workspaceSlug: string) => Promise<void>;
  updateWorkspace: ({ name, description, slug, visibility, defaultAccess }: UpdateWorkspace, teamSlug: string) => Promise<void>;
}
export default function useWorkspaces(): IWorkspaces {
  const router = useRouter();

  const { team_slug, workspace_slug } = useParams() as { team_slug?: string, workspace_slug?: string };
  const {
    data: data,
    error,
    mutate,
  } = useSWR<any>(`/api/teams/${team_slug}/workspaces`, fetcher, {
    dedupingInterval: 120000,
  });

  // Update workspace
  async function updateWorkspace(
    workspace: UpdateWorkspace,
    workspaceSlug: string,
  ) {

    try {
      const response = await fetcher(
        `/api/teams/${team_slug}/${workspaceSlug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workspace),
        },
      );
      if (response.workspace?.meta?.slug !== workspace_slug) {
        router.push(
          `/${team_slug}/${response.workspace?.meta?.slug}/settings`,
        );
      }
      const list = data.workspaces.map((w: Workspace) => {
        if (w?._id === response.workspace._id) {
          return response.workspace;
        }
        return w;
      });
      mutate({ workspaces: list }, { revalidate: false });

    } catch (err: any) {
      displayToast({
        title: "Error",
        description: error?.error?.message ?? error?.message ?? "Failed to update workspace",
        variant: "error",
      });
      throw error;
    }
  }
  // Delete workspace
  async function deleteWorkspace(workspaceSlug: string) { }

  return {
    mutate,
    workspaces: data?.workspaces,
    error,
    loading: !data && !error ? true : false,
    deleteWorkspace,
    updateWorkspace,
  };
}
