import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../fetcher";

export default function useTeam() {
  const { team_slug } = useParams() as { team_slug?: string };
  const {
    data: team,
    error,
    mutate,
  } = useSWR<any>(team_slug && `/api/teams/${team_slug}`, fetcher, {
    dedupingInterval: 30000,
  });

  return {
    team,
    error,
    mutate,
    loading: team_slug && !team && !error ? true : false,
  };
}
