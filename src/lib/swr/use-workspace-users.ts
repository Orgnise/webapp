import { useParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import { fetcher } from "../fetcher";
import { WorkspaceMemberProps } from "../types/types";
import { displayToast } from "./use-collections";


export interface AddWorkspaceMemberProp {
  email: string;
  role: string;
}

interface Props {
  users: WorkspaceMemberProps[],
  loading: boolean,
  error: any,
  addMembers: (members: AddWorkspaceMemberProp[]) => Promise<any>
}
export default function useWorkspaceUsers(): Props {
  const { team_slug, workspace_slug } = useParams() as {
    team_slug: string;
    workspace_slug: string;
  };

  const { data: res, error } = useSWR<any>(
    team_slug && `/api/teams/${team_slug}/${workspace_slug}/users`,
    fetcher,
    {
      dedupingInterval: 120000,
    });


  async function addMembers(members: AddWorkspaceMemberProp[]) {
    try {
      fetcher(`/api/teams/${team_slug}/${workspace_slug}/users`, {
        method: "POST",
        body: JSON.stringify(members),
      }).then((response) => {
        mutate(`/api/teams/${team_slug}/${workspace_slug}/users`);
        displayToast({
          title: "Members added",
          description: "Members have been added",
        });
      });
    } catch (error: any) {
      console.error("error", error);
      displayToast({
        title: "Error",
        description: error?.message ?? "Failed to delete team",
        variant: "error",
      });
      // throw error;
    }
  }

  return {
    users: res?.users ?? [],
    loading: !error && !res?.users,
    error,
    addMembers
  };
}
