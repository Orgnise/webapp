import { useParams, useRouter } from "next/navigation";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "../fetcher";
import { Team } from "../types/types";
import { displayToast } from "./use-collections";
import { PRO_PLAN, getNextPlan } from "../constants/pricing";

type UpdateTeam = { name?: string; description?: string; slug?: string };
interface ITeam extends Team {
  error: any;
  loading: boolean;
  activeTeam?: Team;
  mutate: KeyedMutator<any>;
  deleteTeamAsync: (teamSlug: string) => Promise<void>;
  nextPlan: any;
  updateTeamAsync: ({ name, description, slug }: UpdateTeam, teamSlug: string) => Promise<void>;
}

export default function useTeam(): ITeam {
  const router = useRouter();
  const { team_slug } = useParams() as { team_slug?: string };
  const { data, error, mutate } = useSWR<any>(
    team_slug && `/api/teams/${team_slug}`,
    fetcher,
    {
      dedupingInterval: 30000,
    },
  );

  // Delete team
  async function deleteTeamAsync(teamSlug: string) {
    const activeTeamSlug = team_slug;
    // const workspaceSlug = param?.workspace_slug;
    // const activeCollectionSlug = param?.collection_slug;
    try {
      fetch(`/api/teams/${teamSlug}`, {
        method: "DELETE",
      }).then(async (res) => {
        const json = await res.json();
        if (res.ok) {
          displayToast({
            title: "Team deleted",
            description: "Team has been deleted successfully",
          });
          console.log("Team deleted", { activeTeamSlug, teamSlug });
          if (activeTeamSlug === teamSlug) {
            router.replace("/");
            console.log("Closing the team page");
          }

          mutate(
            { team: undefined },
            { revalidate: false, optimisticData: undefined },
          );
        } else {
          displayToast({
            title: "Error",
            description: json?.message ?? "Failed to delete team",
            variant: "error",
          });
        }
      });
    } catch (error: any) {
      console.error("error", error);
      throw error;
    }
  }

  // Update collection name
  async function updateTeamAsync({ name, description, slug }: UpdateTeam, teamSlug: string) {
    try {
      const response = await fetcher(`/api/teams/${teamSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, slug }),
      });
      // Change the url if the collection slug has changed
      if (teamSlug != response.team.meta.slug) {
        router.replace(`/${response.team.meta.slug}/settings`);
      }
      console.log({ Team: response.team });
      mutate(
        { ...response.team },
        { revalidate: false, optimisticData: response.team },
      );
    } catch (error: any) {
      displayToast({
        title: "Error",
        description: error?.error?.message ?? error?.message ?? "Failed to update team",
        variant: "error",
      });
      throw error;
    }
  }

  return {
    activeTeam: data,
    ...data,
    nextPlan: data?.plan ? getNextPlan(data.plan) : PRO_PLAN,
    error,
    mutate,
    loading: !data && !error ? true : false,
    updateTeamAsync,
    deleteTeamAsync,
  };
}
